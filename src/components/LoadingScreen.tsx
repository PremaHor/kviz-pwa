import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Loader2, XCircle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { THEME_LABEL_CS } from '@/lib/themeWizardOptions'
import { expectedGenerationSeconds } from '@/lib/expectedGenerationTime'
import type { HandicapType, QuizConfiguration, QuizTheme } from '@/types'
import { useQuizStore } from '@/store/useQuizStore'

const HANDICAP_LABELS: Record<Exclude<HandicapType, 'none'>, string> = {
  cognitive_dementia: 'Kognitivní (demence)',
  dyslexia: 'Dyslexie',
  visual_impairment: 'Zrakové postižení',
  hearing_impairment: 'Sluchové postižení',
  autism_spectrum: 'PAS',
  czech_learners: 'Cizinci (základy češtiny)',
}

const CATEGORY_LABELS = {
  fun: 'Zábavné',
  educational: 'Výukové',
  knowledge: 'Vědomostní',
  competitive: 'Soutěžní',
} as const satisfies Record<QuizConfiguration['category'], string>

const LENGTH_LABELS: Record<QuizConfiguration['quizLength'], string> = {
  short: 'Krátký',
  medium: 'Střední',
  long: 'Dlouhý',
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

function handicapsDisplay(config: QuizConfiguration): string {
  const real = config.handicaps.filter(
    (h): h is Exclude<HandicapType, 'none'> => h !== 'none'
  )
  if (real.length === 0) return 'Žádné'
  return real.map((h) => HANDICAP_LABELS[h]).join(', ')
}

function loadingMessages(): readonly string[] {
  const mediaOn = import.meta.env.VITE_QUIZ_MEDIA !== '0'
  return mediaOn
    ? ([
        'Připravuji kontext kvízu…',
        'Vytvářím otázky pomocí AI…',
        'Hledám ilustrace…',
        'Kontrola správnosti…',
      ] as const)
    : ([
        'Připravuji kontext kvízu…',
        'Vytvářím otázky pomocí AI…',
        'Dokončuji úpravy kvízu…',
        'Kontrola správnosti…',
      ] as const)
}

function messageIndexForProgress(progress: number): number {
  if (progress < 24) return 0
  if (progress < 49) return 1
  if (progress < 74) return 2
  return 3
}

function formatExpectedDuration(sec: number): string {
  if (sec < 60) return `${sec} s`
  const m = sec / 60
  return Number.isInteger(m) ? `${m} min` : `${m.toFixed(1).replace('.', ',')} min`
}

type SummaryRowProps = { label: string; value: string }

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-slate-600/50 py-2.5 last:border-b-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <dt className="shrink-0 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="min-w-0 text-left text-sm font-medium text-slate-100 sm:text-right">
        {value}
      </dd>
    </div>
  )
}

export function LoadingScreen() {
  const config = useQuizStore((s) => s.config)
  const generationAbort = useQuizStore((s) => s.generationAbort)
  const reduceMotion = useReducedMotion() ?? false

  const expectedSec = useMemo(
    () => expectedGenerationSeconds(config),
    [config]
  )
  const durationMs = expectedSec * 1000

  const messages = useMemo(() => [...loadingMessages()], [])

  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let frame: number

    const tick = (now: number) => {
      const elapsed = now - start
      let p: number
      if (elapsed <= durationMs) {
        const t = elapsed / durationMs
        const eased = 1 - (1 - t) ** 2
        p = eased * 90
      } else {
        const over = elapsed - durationMs
        const crawlSpan = durationMs * 1.8
        const crawl = Math.min(9, (over / crawlSpan) * 9)
        p = 90 + crawl
      }
      setProgress(Math.min(99.2, p))
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [durationMs])

  const msgIdx = messageIndexForProgress(progress)
  const statusText = messages[msgIdx] ?? messages[0]

  const handleCancel = useCallback(() => {
    generationAbort?.()
  }, [generationAbort])

  return (
    <div
      className="flex w-full max-w-md flex-col items-stretch gap-8 px-3 py-8 text-center sm:max-w-lg sm:px-5 sm:py-12 md:max-w-xl"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Generování kvízu"
    >
      <div className="space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 shadow-[0_0_40px_-8px_rgba(129,140,248,0.5)]">
          <Loader2
            className="h-6 w-6 animate-spin text-indigo-300"
            aria-hidden
          />
        </div>
        <h1 className="bg-gradient-to-r from-indigo-100 via-white to-violet-200 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl">
          Generuji váš kvíz
        </h1>
        <p className="mx-auto max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm">
          Očekávaná doba generování: zhruba{' '}
          <span className="font-medium text-slate-400">
            {formatExpectedDuration(expectedSec)}
          </span>
          . Můžete zrušit a vrátit se k nastavení.
        </p>
      </div>

      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
        className="rounded-2xl border border-slate-600/70 bg-slate-900/45 px-4 py-3 text-left shadow-inner ring-1 ring-white/5 backdrop-blur-sm sm:px-5"
        aria-labelledby="loading-summary-heading"
      >
        <h2
          id="loading-summary-heading"
          className="mb-1 text-center text-xs font-semibold uppercase tracking-wider text-slate-400"
        >
          Shrnutí nastavení
        </h2>
        <dl>
          <SummaryRow label="Téma" value={themeSummaryText(config)} />
          <SummaryRow label="Kategorie" value={CATEGORY_LABELS[config.category]} />
          <SummaryRow
            label="Délka"
            value={LENGTH_LABELS[config.quizLength]}
          />
          <SummaryRow label="Handicapy" value={handicapsDisplay(config)} />
        </dl>
      </motion.section>

      <div className="space-y-3">
        <div
          className="relative h-3 overflow-hidden rounded-full border border-indigo-500/25 bg-slate-950/80 shadow-inner"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          aria-valuetext={`${Math.round(progress)} procent, ${statusText}`}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"
            initial={false}
            animate={{
              width: `${progress}%`,
              opacity: reduceMotion ? 1 : [0.88, 1, 0.92],
            }}
            transition={{
              width: { duration: 0.12, ease: 'linear' },
              opacity: reduceMotion
                ? { duration: 0 }
                : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={msgIdx}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.28 }}
            className="min-h-[2.75rem] text-sm font-medium leading-snug text-indigo-100/95 sm:min-h-[3rem] sm:text-base"
          >
            {statusText}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-xl border border-slate-500/60 bg-slate-800/60 px-5 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-rose-400/50 hover:bg-rose-950/40 hover:text-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
        >
          Zrušit
        </button>
      </div>
    </div>
  )
}

export function GenerationErrorScreen() {
  const generationError = useQuizStore((s) => s.generationError)
  const setStep = useQuizStore((s) => s.setStep)
  const setGenerationError = useQuizStore((s) => s.setGenerationError)
  const reduceMotion = useReducedMotion() ?? false

  const retry = useCallback(() => {
    setGenerationError(null)
    setStep('loading')
  }, [setGenerationError, setStep])

  const back = useCallback(() => {
    setGenerationError(null)
    setStep('wizard')
  }, [setGenerationError, setStep])

  const message =
    generationError?.trim() || 'Generování kvízu se nezdařilo. Zkuste to znovu.'

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: reduceMotion ? 0 : 0.3 }}
      className="flex w-full max-w-md flex-col items-center gap-8 px-3 py-10 text-center sm:max-w-lg sm:px-6"
      role="alert"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/35 bg-rose-950/40">
          <XCircle className="h-8 w-8 text-rose-400" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            Generování se nepovedlo
          </h1>
          <p className="mx-auto mt-3 max-w-md text-left text-sm leading-relaxed text-rose-100/90 sm:text-center">
            {message}
          </p>
        </div>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={retry}
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition-colors hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300"
        >
          Zkusit znovu
        </button>
        <button
          type="button"
          onClick={back}
          className="rounded-xl border border-slate-500/70 bg-slate-800/50 px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          Zpět do nastavení
        </button>
      </div>
    </motion.div>
  )
}
