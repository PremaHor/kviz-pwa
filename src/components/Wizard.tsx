import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Baby,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
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

const TOTAL_STEPS = 4

const targetOptions: { value: TargetGroup; label: string; icon: typeof User }[] =
  [
    { value: 'kids', label: 'Děti', icon: Baby },
    { value: 'juniors', label: 'Junioři', icon: Users },
    { value: 'adults', label: 'Dospělí', icon: User },
    { value: 'seniors', label: 'Senioři', icon: GraduationCap },
  ]

type RealHandicap = Exclude<HandicapType, 'none'>

/** Více výběr v pokročilém panelu (bez „Žádný“ — prázdný výběr = `['none']` ve store). */
const advancedHandicapOptions: { value: RealHandicap; label: string }[] = [
  { value: 'cognitive_dementia', label: 'Kognitivní (Demence)' },
  { value: 'dyslexia', label: 'Dyslexie' },
  { value: 'visual_impairment', label: 'Zrakové postižení' },
  { value: 'hearing_impairment', label: 'Sluchové postižení (Neslyšící)' },
  { value: 'autism_spectrum', label: 'Poruchy autistického spektra' },
  { value: 'czech_learners', label: 'Cizinci (Základy češtiny)' },
]

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

function toggleAdvancedHandicap(
  current: HandicapType[],
  value: RealHandicap
): HandicapType[] {
  const base = current.filter((h) => h !== 'none')
  if (base.includes(value)) {
    const next = base.filter((h) => h !== value)
    return next.length === 0 ? ['none'] : next
  }
  return [...base, value]
}

const labelTarget: Record<TargetGroup, string> = {
  kids: 'Děti',
  juniors: 'Junioři',
  adults: 'Dospělí',
  seniors: 'Senioři',
}

const labelHandicap: Record<HandicapType, string> = {
  none: 'Žádný',
  cognitive_dementia: 'Kognitivní (Demence)',
  dyslexia: 'Dyslexie',
  visual_impairment: 'Zrakové postižení',
  hearing_impairment: 'Sluchové postižení (Neslyšící)',
  autism_spectrum: 'Poruchy autistického spektra',
  czech_learners: 'Cizinci (Základy češtiny)',
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

  const [advancedAccessibilityOpen, setAdvancedAccessibilityOpen] = useState(
    () => config.handicaps.some((h) => h !== 'none')
  )

  const activeHandicaps = useMemo(
    () =>
      config.handicaps.filter((h): h is RealHandicap => h !== 'none'),
    [config.handicaps]
  )

  const handicapSummaryLabel = useMemo(() => {
    if (activeHandicaps.length === 0) return 'Standardní (bez úprav)'
    return activeHandicaps.map((h) => labelHandicap[h]).join(', ')
  }, [activeHandicaps])

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

  const selectTargetGroup = useCallback(
    (value: TargetGroup) => {
      setConfig({ targetGroup: value })
    },
    [setConfig]
  )

  const goNext = useCallback(() => {
    setStep((s) => {
      if (s === 1) {
        const hasRealHandicap = config.handicaps.some((h) => h !== 'none')
        if (!hasRealHandicap) {
          setConfig({ handicaps: ['none'] })
        }
      }
      return Math.min(s + 1, TOTAL_STEPS)
    })
  }, [config.handicaps, setConfig])

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
          Zvolte publikum, typ otázek, téma a délku. Přístupnost můžete upřesnit v pokročilém
          nastavení pod výběrem skupiny.
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
              <legend className="sr-only">Cílová skupina a přístupnost</legend>
              <p className="text-center text-slate-300" id="step1-desc">
                Kdo bude kvíz hrát?
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

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() =>
                    setAdvancedAccessibilityOpen((open) => !open)
                  }
                  aria-expanded={advancedAccessibilityOpen}
                  className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition-colors text-slate-400 hover:text-white"
                >
                  <span aria-hidden className="select-none text-base">
                    ⚙️
                  </span>
                  <span>Pokročilé nastavení přístupnosti</span>
                  {advancedAccessibilityOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {advancedAccessibilityOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 border-t border-slate-700/80 pt-5">
                        <p
                          className="text-center text-sm text-slate-400"
                          id="step1-advanced-desc"
                        >
                          Volitelné — označte vše, co platí pro vaše publikum.
                        </p>
                        <div
                          className="flex flex-col gap-2"
                          role="group"
                          aria-labelledby="step1-advanced-desc"
                        >
                          {advancedHandicapOptions.map(({ value, label }) => {
                            const active = activeHandicaps.includes(value)
                            return (
                              <motion.button
                                key={value}
                                type="button"
                                whileTap={{ scale: 0.99 }}
                                onClick={() =>
                                  setConfig({
                                    handicaps: toggleAdvancedHandicap(
                                      config.handicaps,
                                      value
                                    ),
                                  })
                                }
                                aria-pressed={active}
                                className={`flex items-center justify-between rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-colors sm:text-base ${
                                  active
                                    ? 'border-indigo-400 bg-indigo-500/15 text-white'
                                    : 'border-slate-600/80 bg-slate-800/40 text-slate-200 hover:border-slate-500'
                                }`}
                              >
                                {label}
                                {active ? (
                                  <Check
                                    className="h-5 w-5 shrink-0 text-indigo-400"
                                    aria-hidden
                                  />
                                ) : (
                                  <span className="h-5 w-5 shrink-0 rounded border border-slate-500" />
                                )}
                              </motion.button>
                            )
                          })}
                        </div>

                        <div className="rounded-2xl border border-dashed border-slate-600/80 bg-slate-900/30 p-4">
                          <p
                            className="mb-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500"
                            id="preview-label"
                          >
                            Náhled zobrazení při hře
                          </p>
                          <div
                            className={previewFlags.dyslexia ? 'font-dyslexia' : ''}
                          >
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
                                  <span className={quizOptionLabelClass(previewFlags)}>
                                    A.
                                  </span>
                                  Jedno
                                </div>
                                <div
                                  className={`flex items-center ${quizOptionIdleClass(previewFlags)}`}
                                >
                                  <span className={quizOptionLabelClass(previewFlags)}>
                                    B.
                                  </span>
                                  Dvě
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2 text-center text-xs text-slate-500">
                            Zrak: silný kontrast · Dyslexie: font Lexend · další volby upřesňují
                            zadání pro AI (např. jednoduchší jazyk, bez audio otázek).
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </fieldset>
          )}

          {step === 2 && (
            <fieldset className="space-y-4 border-0 p-0">
              <legend className="sr-only">Kategorie kvízu</legend>
              <p className="text-center text-slate-300" id="step2-desc">
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

          {step === 3 && (
            <fieldset className="space-y-4 border-0 p-0">
              <legend className="sr-only">Téma kvízu</legend>
              <p className="text-center text-slate-300" id="step3-desc">
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
                aria-labelledby="step3-desc"
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

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-center text-lg font-semibold text-white">
                Shrnutí
              </h2>
              <fieldset className="space-y-3 border-0 p-0">
                <legend className="sr-only">Délka kvízu</legend>
                <p
                  className="text-center text-slate-300"
                  id="step4-length-desc"
                >
                  Zvolte délku kvízu
                </p>
                <div
                  className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                  role="group"
                  aria-labelledby="step4-length-desc"
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
              {import.meta.env.DEV && (
                <div
                  role="note"
                  className="rounded-xl border border-sky-500/35 bg-sky-950/30 px-4 py-3 text-left text-sm text-sky-100/95"
                >
                  <p className="font-medium text-sky-50">Lokální vývoj</p>
                  <p className="mt-1 text-sky-100/90">
                    Pro generování z AI spusťte <span className="font-mono text-xs">npm run dev</span>{' '}
                    (Vercel CLI včetně <span className="font-mono text-xs">/api/generate-quiz</span>).
                    Čistý <span className="font-mono text-xs">vite</span> bez API zobrazí jen krátkou
                    ukázku. Volitelně <span className="font-mono text-xs">VITE_DEV_MOCK=1</span> v{' '}
                    <span className="font-mono text-xs">.env</span>.
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
                  <dt className="text-slate-400">Přístupnost</dt>
                  <dd className="font-medium text-white">
                    {handicapSummaryLabel}
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
                Otázky a vysvětlení připraví na serveru Google Gemini podle tohoto nastavení. Klíč k API
                není v prohlížeči — drží ho nasazení (např. proměnné prostředí na Vercelu).
                {import.meta.env.VITE_QUIZ_MEDIA !== '0' &&
                  ' Ilustrace doplní server z veřejných zdrojů (Wikimedia; volitelně Pexels) — bez druhého běhu AI u klienta.'}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <nav
        className={`mt-8 flex items-center gap-3 ${
          step < TOTAL_STEPS ? 'justify-between' : 'justify-start'
        }`}
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
        {step < TOTAL_STEPS ? (
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400"
          >
            Další krok
            <ArrowRight className="h-4 w-4" aria-hidden />
          </motion.button>
        ) : null}
      </nav>

      {step === TOTAL_STEPS && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-6"
        >
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
        </motion.div>
      )}
    </div>
  )
}
