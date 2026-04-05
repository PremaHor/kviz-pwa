import { motion } from 'framer-motion'
import { Pencil } from 'lucide-react'
import type { KeyboardEvent, ReactNode } from 'react'
import { useCallback, useMemo, useState } from 'react'
import {
  clampCompetitiveTimeLimitSeconds,
  defaultCompetitiveLimitForGroup,
} from '@/lib/competitiveScoring'
import { formatEstimatedQuizDuration } from '@/lib/estimateTime'
import { THEME_LABEL_CS } from '@/lib/themeWizardOptions'
import type { HandicapType, QuizConfiguration, QuizTheme } from '@/types'
import { useQuizStore } from '@/store/useQuizStore'

const HANDICAP_LABELS: Record<Exclude<HandicapType, 'none'>, string> = {
  cognitive_dementia: 'Kognitivní (Demence)',
  dyslexia: 'Dyslexie',
  visual_impairment: 'Zrakové postižení',
  hearing_impairment: 'Sluchové postižení',
  autism_spectrum: 'Poruchy autistického spektra',
  czech_learners: 'Cizinci (Základy češtiny)',
}

const CATEGORY_LABELS = {
  fun: 'Zábavné',
  educational: 'Výukové',
  knowledge: 'Vědomostní',
  competitive: 'Soutěžní',
} as const

const TARGET_LABELS = {
  kids: 'Děti',
  juniors: 'Junioři',
  adults: 'Dospělí',
  seniors: 'Senioři',
} as const

const LENGTH_LABELS: Record<
  QuizConfiguration['quizLength'],
  string
> = {
  short: 'Krátký (15 otázek)',
  medium: 'Střední (25 otázek)',
  long: 'Dlouhý (35 otázek)',
}

function handicapsSummaryText(handicaps: HandicapType[]): string {
  const real = handicaps.filter((h): h is Exclude<HandicapType, 'none'> => h !== 'none')
  if (real.length === 0) return 'Žádné'
  return real.map((h) => HANDICAP_LABELS[h]).join(', ')
}

function themeSummaryText(config: QuizConfiguration): string {
  if (config.theme === 'random') {
    return THEME_LABEL_CS.random
  }
  if (config.theme === 'custom') {
    const t = config.customThemeText.trim()
    return t ? `${t} (vlastní)` : `${THEME_LABEL_CS.custom} (vlastní)`
  }
  return THEME_LABEL_CS[config.theme as QuizTheme]
}

export function validateConfigForGeneration(config: QuizConfiguration): string | null {
  if (!config.targetGroup) {
    return 'Vyberte cílovou skupinu.'
  }
  if (!config.quizLength) {
    return 'Vyberte délku kvízu.'
  }
  if (!config.theme) {
    return 'Vyberte téma kvízu.'
  }
  if (config.theme === 'custom' && config.customThemeText.trim().length < 3) {
    return 'U vlastního tématu zadejte alespoň 3 znaky.'
  }
  return null
}

type SummaryRowProps = {
  label: string
  value: string
  onEdit: () => void
}

function SummaryRow({ label, value, onEdit }: SummaryRowProps) {
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onEdit()
      }
    },
    [onEdit]
  )

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onEdit}
      onKeyDown={onKeyDown}
      className="flex cursor-pointer items-center gap-3 border-b border-slate-600/60 py-3.5 text-left transition-colors hover:bg-slate-800/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/80"
    >
      <span className="min-w-0 flex-1 text-sm font-medium text-slate-300">
        {label}
      </span>
      <span className="max-w-[55%] text-right text-sm text-white sm:max-w-[60%]">
        {value}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onEdit()
        }}
        className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-700/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        aria-label={`Upravit: ${label}`}
      >
        <Pencil className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}

type SummaryStepProps = {
  onEditWizardStep: (step: 1 | 2 | 3) => void
  onGenerate: () => void
}

export function SummaryStep({ onEditWizardStep, onGenerate }: SummaryStepProps) {
  const config = useQuizStore((s) => s.config)
  const gameMode = useQuizStore((s) => s.gameMode)
  const roomCode = useQuizStore((s) => s.multiplayer.roomCode)
  const setGenerationError = useQuizStore((s) => s.setGenerationError)
  const [localError, setLocalError] = useState<string | null>(null)

  const estimated = useMemo(() => formatEstimatedQuizDuration(config), [config])

  const competitiveSeconds = useMemo(() => {
    if (config.category !== 'competitive' || config.targetGroup === 'kids') {
      return null
    }
    return clampCompetitiveTimeLimitSeconds(
      config.competitiveTimeLimitSeconds ??
        defaultCompetitiveLimitForGroup(config.targetGroup),
      config.targetGroup
    )
  }, [config])

  const handleGenerate = useCallback(() => {
    setLocalError(null)
    setGenerationError(null)
    const err = validateConfigForGeneration(config)
    if (err) {
      setLocalError(err)
      return
    }
    if (gameMode === 'multi' && !roomCode) {
      setLocalError(
        'V režimu multiplayer nejdřív vytvořte místnost nebo se k ní připojte (krok 1).'
      )
      return
    }
    onGenerate()
  }, [config, gameMode, roomCode, onGenerate, setGenerationError])

  const devNote: ReactNode =
    import.meta.env.DEV ? (
      <div
        role="note"
        className="rounded-xl border border-sky-500/35 bg-sky-950/30 px-4 py-3 text-left text-sm text-sky-100/95"
      >
        <p className="font-medium text-sky-50">Lokální vývoj</p>
        <p className="mt-1 text-sky-100/90">
          Pro generování z AI spusťte{' '}
          <span className="font-mono text-xs">npm run dev</span> (Vercel CLI včetně{' '}
          <span className="font-mono text-xs">/api/generate-quiz</span>). Čistý{' '}
          <span className="font-mono text-xs">vite</span> bez API zobrazí jen krátkou ukázku.
        </p>
      </div>
    ) : null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-lg font-semibold text-white">
          Shrnutí nastavení
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-xs leading-relaxed text-slate-500">
          Klepnutím na řádek nebo na ikonu tužky přejdete k úpravě dané části.
        </p>
      </div>

      {gameMode === 'multi' ? (
        <p className="rounded-xl border border-indigo-500/35 bg-indigo-950/25 px-4 py-3 text-center text-sm text-indigo-100/95">
          Multiplayer – hraje více hráčů
          {roomCode ? (
            <>
              {' '}
              · kód místnosti <span className="font-mono font-semibold">{roomCode}</span>
            </>
          ) : null}
        </p>
      ) : null}

      <div className="rounded-2xl border border-slate-600/80 bg-slate-800/35 px-1 sm:px-3">
        <SummaryRow
          label="Cílová skupina"
          value={TARGET_LABELS[config.targetGroup]}
          onEdit={() => onEditWizardStep(1)}
        />
        <SummaryRow
          label="Přístupnost / Handicapy"
          value={handicapsSummaryText(config.handicaps)}
          onEdit={() => onEditWizardStep(1)}
        />
        <SummaryRow
          label="Kategorie"
          value={CATEGORY_LABELS[config.category]}
          onEdit={() => onEditWizardStep(2)}
        />
        <SummaryRow
          label="Téma"
          value={themeSummaryText(config)}
          onEdit={() => onEditWizardStep(3)}
        />
        <SummaryRow
          label="Délka"
          value={LENGTH_LABELS[config.quizLength]}
          onEdit={() => onEditWizardStep(3)}
        />
        {competitiveSeconds != null ? (
          <SummaryRow
            label="Čas na otázku (soutěžní)"
            value={`${competitiveSeconds} s`}
            onEdit={() => onEditWizardStep(2)}
          />
        ) : null}
      </div>

      <p className="rounded-xl border border-slate-600/70 bg-slate-900/50 px-4 py-3 text-center text-sm text-slate-200">
        <span className="font-medium text-slate-100">Odhadovaný čas:</span>{' '}
        {estimated}
      </p>

      {localError ? (
        <p className="text-center text-sm text-amber-200" role="alert">
          {localError}
        </p>
      ) : null}

      {devNote}

      <p className="text-center text-xs leading-relaxed text-slate-500">
        Otázky připraví na serveru Google Gemini podle tohoto nastavení. Klíč k API drží nasazení
        (např. Vercel).
        {import.meta.env.VITE_QUIZ_MEDIA !== '0' &&
          ' Ilustrace může doplnit server z veřejných zdrojů.'}
      </p>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => onEditWizardStep(3)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700/80"
        >
          Zpět
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300 sm:flex-none sm:min-w-[11rem]"
        >
          Vytvořit kvíz
        </motion.button>
      </div>
    </div>
  )
}
