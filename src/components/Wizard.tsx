import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Baby,
  BookOpen,
  Check,
  Gamepad2,
  GraduationCap,
  LayoutList,
  Leaf,
  List,
  ListOrdered,
  PartyPopper,
  Sparkles,
  Sun,
  Trophy,
  User,
  Users,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getAccessibilityFlags,
  quizOptionIdleClass,
  quizOptionLabelClass,
  quizOptionsGridClass,
  quizQuestionTitleClass,
  quizSurfaceClass,
} from '@/lib/accessibilityUi'
import { getQuestionCount, quizLengthChoices } from '@/lib/quizLength'
import { allowedCategories, allowedThemes } from '@/lib/wizardOptions'
import type {
  HandicapType,
  QuizCategory,
  QuizLength,
  QuizTheme,
  TargetGroup,
} from '@/types'
import { useQuizStore } from '@/store/useQuizStore'

const TOTAL_STEPS = 5

const targetOptions: { value: TargetGroup; label: string; icon: typeof User }[] =
  [
    { value: 'kids', label: 'Děti', icon: Baby },
    { value: 'juniors', label: 'Junioři', icon: Users },
    { value: 'adults', label: 'Dospělí', icon: User },
    { value: 'seniors', label: 'Senioři', icon: GraduationCap },
  ]

const handicapOptionsBase: { value: HandicapType; label: string }[] = [
  { value: 'none', label: 'Žádný' },
  { value: 'visual_impairment', label: 'Zrakové postižení' },
  { value: 'dyslexia', label: 'Dyslexie' },
  { value: 'motor_skills', label: 'Motorika' },
  { value: 'cognitive', label: 'Kognitivní' },
]

const handicapOptionDementia: { value: HandicapType; label: string } = {
  value: 'dementia',
  label: 'Demence',
}

const categoryOptions: { value: QuizCategory; label: string; icon: typeof BookOpen }[] =
  [
    { value: 'knowledge', label: 'Vědomostní', icon: BookOpen },
    { value: 'educational', label: 'Výukové', icon: GraduationCap },
    { value: 'fun', label: 'Zábavné', icon: PartyPopper },
    { value: 'competitive', label: 'Soutěžní', icon: Trophy },
  ]

const themeOptions: { value: QuizTheme; label: string; icon: typeof Leaf }[] = [
  { value: 'seasonal', label: 'Sezónní', icon: Sun },
  { value: 'animals', label: 'Zvířata', icon: Leaf },
  { value: 'general', label: 'Všeobecné', icon: BookOpen },
  { value: 'science', label: 'Věda', icon: Sparkles },
  { value: 'pop_culture', label: 'Popkultura', icon: Gamepad2 },
]

function toggleHandicap(
  current: HandicapType[],
  value: HandicapType
): HandicapType[] {
  if (value === 'none') {
    return ['none']
  }
  const withoutNone = current.filter((h) => h !== 'none')
  if (withoutNone.includes(value)) {
    const next = withoutNone.filter((h) => h !== value)
    return next.length === 0 ? ['none'] : next
  }
  return [...withoutNone, value]
}

const labelTarget: Record<TargetGroup, string> = {
  kids: 'Děti',
  juniors: 'Junioři',
  adults: 'Dospělí',
  seniors: 'Senioři',
}

const labelHandicap: Record<HandicapType, string> = {
  none: 'Žádný',
  visual_impairment: 'Zrakové postižení',
  dyslexia: 'Dyslexie',
  motor_skills: 'Motorika',
  cognitive: 'Kognitivní',
  dementia: 'Demence',
}

const labelCategory: Record<QuizCategory, string> = {
  knowledge: 'Vědomostní',
  educational: 'Výukové',
  fun: 'Zábavné',
  competitive: 'Soutěžní',
}

const labelTheme: Record<QuizTheme, string> = {
  seasonal: 'Sezónní',
  animals: 'Zvířata',
  general: 'Všeobecné',
  science: 'Věda',
  pop_culture: 'Popkultura',
}

const lengthIcons: Record<QuizLength, typeof List> = {
  short: List,
  medium: ListOrdered,
  long: LayoutList,
}

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
}

export function Wizard() {
  const [step, setStep] = useState(1)
  const config = useQuizStore((s) => s.config)
  const setConfig = useQuizStore((s) => s.setConfig)
  const setAppStep = useQuizStore((s) => s.setStep)
  const generationError = useQuizStore((s) => s.generationError)
  const setGenerationError = useQuizStore((s) => s.setGenerationError)

  const handicaps =
    config.handicaps.length === 0 ? (['none'] as HandicapType[]) : config.handicaps

  useEffect(() => {
    const cats = allowedCategories(config.targetGroup, config.handicaps)
    const themes = allowedThemes(config.targetGroup, config.handicaps)
    const patch: Partial<{ category: QuizCategory; theme: QuizTheme }> = {}
    if (!cats.includes(config.category)) {
      patch.category = cats[0]
    }
    if (!themes.includes(config.theme)) {
      patch.theme = themes[0]
    }
    if (Object.keys(patch).length > 0) {
      setConfig(patch)
    }
  }, [
    config.targetGroup,
    config.handicaps,
    config.category,
    config.theme,
    setConfig,
  ])

  const categoryChoices = useMemo(
    () =>
      categoryOptions.filter((o) =>
        allowedCategories(config.targetGroup, config.handicaps).includes(o.value)
      ),
    [config.targetGroup, config.handicaps]
  )

  const themeChoices = useMemo(
    () =>
      themeOptions.filter((o) =>
        allowedThemes(config.targetGroup, config.handicaps).includes(o.value)
      ),
    [config.targetGroup, config.handicaps]
  )

  const previewFlags = useMemo(() => getAccessibilityFlags(config), [config])

  const handicapOptions = useMemo(
    () =>
      config.targetGroup === 'seniors'
        ? [...handicapOptionsBase, handicapOptionDementia]
        : handicapOptionsBase,
    [config.targetGroup]
  )

  const selectTargetGroup = useCallback(
    (value: TargetGroup) => {
      if (value !== 'seniors') {
        const next = config.handicaps.filter((h) => h !== 'dementia')
        setConfig({
          targetGroup: value,
          handicaps: next.length === 0 ? ['none'] : next,
        })
        return
      }
      setConfig({ targetGroup: value })
    },
    [config.handicaps, setConfig]
  )

  const goNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
  }, [])

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1))
  }, [])

  const handleCreate = () => {
    setAppStep('loading')
  }

  return (
    <div className="w-full max-w-lg">
      {generationError && (
        <div
          role="alert"
          className="mb-6 flex gap-3 rounded-xl border border-rose-500/50 bg-rose-950/50 p-4 text-left text-sm text-rose-100"
        >
          <AlertCircle
            className="h-5 w-5 shrink-0 text-rose-400"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-rose-50">Generování se nezdařilo</p>
            <p className="mt-1 text-rose-200/90">{generationError}</p>
          </div>
          <button
            type="button"
            onClick={() => setGenerationError(null)}
            className="shrink-0 rounded-lg p-1 text-rose-300 hover:bg-rose-900/50 hover:text-white"
            aria-label="Zavřít hlášku"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
      )}
      <header className="mb-8 text-center">
        <p className="text-sm font-medium text-indigo-300" aria-live="polite">
          Krok {step} z {TOTAL_STEPS}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Nastavení kvízu
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
          Nastavte skupinu, přístupnost, typ otázek a téma — v češtině, s ohledem na potřeby
          hráčů. V posledním kroku zvolíte délku kvízu (15, 25 nebo 35 otázek).
        </p>
        <div
          className="mx-auto mt-4 h-1.5 max-w-xs overflow-hidden rounded-full bg-slate-700/80"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label="Průběh průvodce"
        >
          <motion.div
            className="h-full rounded-full bg-indigo-500"
            initial={false}
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 1 && (
            <fieldset className="space-y-4 border-0 p-0">
              <legend className="sr-only">Cílová skupina</legend>
              <p className="text-center text-slate-300" id="step1-desc">
                Vyberte cílovou skupinu
              </p>
              <div
                className="grid grid-cols-2 gap-3"
                role="group"
                aria-labelledby="step1-desc"
              >
                {targetOptions.map(({ value, label, icon: Icon }) => {
                  const selected = config.targetGroup === value
                  return (
                    <motion.button
                      key={value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectTargetGroup(value)}
                      aria-pressed={selected}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-colors ${
                        selected
                          ? 'border-indigo-400 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/10'
                          : 'border-slate-600/80 bg-slate-800/40 text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      <Icon className="h-8 w-8 text-indigo-300" aria-hidden />
                      <span className="font-semibold">{label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="space-y-4 border-0 p-0">
              <legend className="sr-only">Přístupnost a handicapy</legend>
              <p className="text-center text-slate-300" id="step2-desc">
                Vyberte všechny relevantní možnosti
                {config.targetGroup === 'seniors' && (
                  <span className="mt-2 block text-sm text-slate-400">
                    U seniorů je k dispozici také volba Demence.
                  </span>
                )}
              </p>
              <div
                className="flex flex-col gap-2"
                role="group"
                aria-labelledby="step2-desc"
              >
                {handicapOptions.map(({ value, label }) => {
                  const active = handicaps.includes(value)
                  return (
                    <motion.button
                      key={value}
                      type="button"
                      whileTap={{ scale: 0.99 }}
                      onClick={() =>
                        setConfig({ handicaps: toggleHandicap(handicaps, value) })
                      }
                      aria-pressed={active}
                      className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left font-medium transition-colors ${
                        active
                          ? 'border-indigo-400 bg-indigo-500/15 text-white'
                          : 'border-slate-600/80 bg-slate-800/40 text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      {label}
                      {active ? (
                        <Check className="h-5 w-5 shrink-0 text-indigo-400" aria-hidden />
                      ) : (
                        <span className="h-5 w-5 shrink-0 rounded border border-slate-500" />
                      )}
                    </motion.button>
                  )
                })}
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-slate-600/80 bg-slate-900/30 p-4">
                <p
                  className="mb-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500"
                  id="preview-label"
                >
                  Náhled zobrazení při hře
                </p>
                <div className={previewFlags.dyslexia ? 'font-dyslexia' : ''}>
                  <div
                    className={quizSurfaceClass(previewFlags)}
                    aria-labelledby="preview-label"
                  >
                    <p className={quizQuestionTitleClass(previewFlags)}>
                      Kolik je pootevřených oken?
                    </p>
                    <div
                      className={quizOptionsGridClass(previewFlags)}
                      role="presentation"
                    >
                      <div
                        className={`flex items-center ${quizOptionIdleClass(previewFlags)}`}
                      >
                        <span className={quizOptionLabelClass(previewFlags)}>A.</span>
                        Jedno
                      </div>
                      <div
                        className={`flex items-center ${quizOptionIdleClass(previewFlags)}`}
                      >
                        <span className={quizOptionLabelClass(previewFlags)}>B.</span>
                        Dvě
                      </div>
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-center text-xs text-slate-500">
                  Zrakové postižení: silný kontrast · Dyslexie: font Lexend ·
                  Motorika: větší cíle
                </p>
              </div>
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="space-y-4 border-0 p-0">
              <legend className="sr-only">Kategorie kvízu</legend>
              <p className="text-center text-slate-300" id="step3-desc">
                Jaký typ otázek chcete?
              </p>
              {categoryChoices.length < categoryOptions.length && (
                <p className="text-center text-xs text-slate-500">
                  Nabídka je omezená podle věkové skupiny a zvolené přístupnosti.
                </p>
              )}
              <div
                className="grid grid-cols-2 gap-3"
                role="group"
                aria-labelledby="step3-desc"
              >
                {categoryChoices.map(({ value, label, icon: Icon }) => {
                  const selected = config.category === value
                  return (
                    <motion.button
                      key={value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setConfig({ category: value })}
                      aria-pressed={selected}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-colors ${
                        selected
                          ? 'border-indigo-400 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/10'
                          : 'border-slate-600/80 bg-slate-800/40 text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      <Icon className="h-8 w-8 text-indigo-300" aria-hidden />
                      <span className="text-sm font-semibold sm:text-base">
                        {label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {step === 4 && (
            <fieldset className="space-y-4 border-0 p-0">
              <legend className="sr-only">Téma kvízu</legend>
              <p className="text-center text-slate-300" id="step4-desc">
                Zvolte téma otázek
              </p>
              {themeChoices.length < themeOptions.length && (
                <p className="text-center text-xs text-slate-500">
                  Některá témata nejsou pro tuto kombinaci vhodná — obsah se řídí i
                  kontextem zvolené skupiny (v zadání pro AI).
                </p>
              )}
              <div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                role="group"
                aria-labelledby="step4-desc"
              >
                {themeChoices.map(({ value, label, icon: Icon }) => {
                  const selected = config.theme === value
                  return (
                    <motion.button
                      key={value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setConfig({ theme: value })}
                      aria-pressed={selected}
                      className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 text-center transition-colors sm:p-4 ${
                        selected
                          ? 'border-indigo-400 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/10'
                          : 'border-slate-600/80 bg-slate-800/40 text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      <Icon className="h-7 w-7 text-indigo-300 sm:h-8 sm:w-8" aria-hidden />
                      <span className="text-sm font-semibold">{label}</span>
                    </motion.button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-center text-lg font-semibold text-white">
                Shrnutí
              </h2>
              <fieldset className="space-y-3 border-0 p-0">
                <legend className="sr-only">Délka kvízu</legend>
                <p
                  className="text-center text-slate-300"
                  id="step5-length-desc"
                >
                  Zvolte délku kvízu
                </p>
                <div
                  className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                  role="group"
                  aria-labelledby="step5-length-desc"
                >
                  {quizLengthChoices.map(({ value, label, count }) => {
                    const selected = config.quizLength === value
                    const Icon = lengthIcons[value]
                    return (
                      <motion.button
                        key={value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setConfig({ quizLength: value })}
                        aria-pressed={selected}
                        className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-3 text-center transition-colors sm:py-4 ${
                          selected
                            ? 'border-indigo-400 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/10'
                            : 'border-slate-600/80 bg-slate-800/40 text-slate-200 hover:border-slate-500'
                        }`}
                      >
                        <Icon
                          className="h-6 w-6 text-indigo-300 sm:h-7 sm:w-7"
                          aria-hidden
                        />
                        <span className="text-sm font-semibold">{label}</span>
                        <span className="text-xs text-slate-400">
                          {count} otázek
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </fieldset>
              {!import.meta.env.VITE_GEMINI_API_KEY?.trim() && (
                <div
                  role="status"
                  className="rounded-xl border border-amber-500/40 bg-amber-950/35 px-4 py-3 text-left text-sm text-amber-100/95"
                >
                  <p className="font-medium text-amber-50">Ukázkový režim</p>
                  <p className="mt-1 text-amber-100/85">
                    Bez klíče API se vygenerují jen dvě ukázkové otázky (délka z průvodce se u
                    plného kvízu projektuje až po nastavení{' '}
                    <span className="whitespace-nowrap font-mono text-xs text-amber-200">
                      VITE_GEMINI_API_KEY
                    </span>{' '}
                    — viz <span className="font-mono text-xs">.env.example</span>).
                  </p>
                </div>
              )}
              <dl className="space-y-3 rounded-2xl border border-slate-600/80 bg-slate-800/50 p-5">
                <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                  <dt className="text-slate-400">Skupina</dt>
                  <dd className="font-medium text-white">
                    {labelTarget[config.targetGroup]}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                  <dt className="text-slate-400">Handicapy</dt>
                  <dd className="font-medium text-white">
                    {handicaps.map((h) => labelHandicap[h]).join(', ')}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                  <dt className="text-slate-400">Kategorie</dt>
                  <dd className="font-medium text-white">
                    {labelCategory[config.category]}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                  <dt className="text-slate-400">Téma</dt>
                  <dd className="font-medium text-white">
                    {labelTheme[config.theme]}
                  </dd>
                </div>
                <div className="flex flex-col gap-0.5 sm:flex-row sm:justify-between">
                  <dt className="text-slate-400">Délka</dt>
                  <dd className="font-medium text-white">
                    {
                      quizLengthChoices.find((c) => c.value === config.quizLength)
                        ?.label
                    }{' '}
                    ({getQuestionCount(config.quizLength)} otázek)
                  </dd>
                </div>
              </dl>
              <p className="text-center text-xs leading-relaxed text-slate-500">
                {import.meta.env.VITE_GEMINI_API_KEY?.trim()
                  ? 'Otázky a vysvětlení vygeneruje model Gemini podle tohoto nastavení. Klíč zůstává ve vašem prostředí (proměnná Vite).'
                  : 'Po přidání klíče API se použije Google Gemini; data neukládáme na server této aplikace.'}
                {import.meta.env.VITE_QUIZ_MEDIA !== '0' &&
                  ' K otázce vygeneruje model krátký anglický popis motivu (pouze pro vyhledání obrázku); ilustraci pak dohledáme z Wikimedia Commons nebo volitelně Pexels — bez druhého běhu AI.'}
              </p>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreate}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 transition-colors hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300"
              >
                <Sparkles className="h-5 w-5" aria-hidden />
                Vytvořit kvíz
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step < 5 && (
        <nav
          className="mt-8 flex items-center justify-between gap-3"
          aria-label="Kroky průvodce"
        >
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/60 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700/80 disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Zpět
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400"
          >
            Další
            <ArrowRight className="h-4 w-4" aria-hidden />
          </motion.button>
        </nav>
      )}
    </div>
  )
}
