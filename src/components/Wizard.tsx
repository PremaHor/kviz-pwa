import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Baby,
  Banknote,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  ChevronUp,
  Clapperboard,
  Dices,
  Film,
  FlaskConical,
  Gamepad2,
  Globe2,
  GraduationCap,
  Hammer,
  Heart,
  HeartPulse,
  Landmark,
  LayoutList,
  Leaf,
  LineChart,
  List,
  ListOrdered,
  Map,
  Microscope,
  Music2,
  OctagonAlert,
  PartyPopper,
  Rocket,
  Scale,
  Share2,
  Shield,
  ShieldAlert,
  Smile,
  Sparkles,
  Stethoscope,
  Sun,
  Trophy,
  User,
  Users,
  Wand2,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CompetitiveSettings } from '@/components/competitive/CompetitiveSettings'
import { GameModeStep } from '@/components/wizard/GameModeStep'
import { SummaryStep } from '@/components/wizard/SummaryStep'
import {
  getAccessibilityFlags,
  quizOptionIdleClass,
  quizOptionLabelClass,
  quizOptionsGridClass,
  quizQuestionTitleClass,
  quizSurfaceClass,
} from '@/lib/accessibilityUi'
import { clampCompetitiveTimeLimitSeconds } from '@/lib/competitiveScoring'
import { quizLengthChoices } from '@/lib/quizLength'
import { allowedCategories, allowedThemes } from '@/lib/wizardOptions'
import { getThemeCardsForWizardStep } from '@/lib/topicsByGroup'
import {
  defaultThemeForAudience,
  SPECIAL_THEME_CARDS,
} from '@/lib/themeWizardOptions'

const THEME_STEP_ICONS: Record<QuizTheme, LucideIcon> = {
  kid_seasonal: Sun,
  kid_animals: Leaf,
  kid_fairy_tales_magic: Sparkles,
  kid_space_dinosaurs: Rocket,
  kid_fun_friends_fun: Users,
  kid_fun_animal_jokes: Smile,
  kid_edu_my_body: Heart,
  kid_edu_traffic_signs: OctagonAlert,
  kid_edu_first_aid: HeartPulse,
  jr_gaming_tech: Gamepad2,
  jr_nature_science: FlaskConical,
  jr_pop_culture: Clapperboard,
  jr_fake_news_myths: ShieldAlert,
  jr_fun_social_networks: Share2,
  jr_fun_jokes_memes: Smile,
  jr_fun_tiktok_trends: Music2,
  jr_edu_financial_literacy: Banknote,
  jr_edu_ecology_climate: Leaf,
  jr_edu_sex_education: BookOpen,
  jr_comp_esports_sports: Trophy,
  jr_comp_logic_puzzles: Brain,
  jr_comp_brain_races: Brain,
  ad_general: BookOpen,
  ad_travel_geography: Globe2,
  ad_history_culture: Landmark,
  ad_science_tech: Microscope,
  ad_fun_bizarre_laws: Scale,
  ad_fun_amazing_records: Award,
  ad_fun_cinema_gems: Film,
  ad_edu_health_prevention: Stethoscope,
  ad_edu_law_everyday: Scale,
  ad_edu_psychology: Brain,
  ad_comp_brain_races: Brain,
  ad_comp_economy_quiz: LineChart,
  ad_comp_global_challenges: Globe2,
  sr_retro_6080: Sun,
  sr_golden_czech_hands: Hammer,
  sr_nature_herbs: Leaf,
  sr_history_local: Map,
  sr_fun_youth_hits: Music2,
  sr_fun_cinema_treasures: Clapperboard,
  sr_fun_dance_evenings: Music2,
  sr_edu_healthy_aging: Heart,
  sr_edu_online_safety: Shield,
  sr_edu_first_aid_seniors: HeartPulse,
  sr_comp_who_remembers: Brain,
  sr_comp_veterans_quiz: Landmark,
  sr_comp_family_history: Users,
  random: Dices,
  custom: Wand2,
}
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

/** Více výběr v pokročilém panelu (bez „Žádný“; prázdný výběr = `['none']` ve store). */
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
  const gameMode = useQuizStore((s) => s.gameMode)
  const multiplayer = useQuizStore((s) => s.multiplayer)
  const setConfig = useQuizStore((s) => s.setConfig)
  const setAppStep = useQuizStore((s) => s.setStep)

  const [advancedAccessibilityOpen, setAdvancedAccessibilityOpen] = useState(
    () => config.handicaps.some((h) => h !== 'none')
  )

  const activeHandicaps = useMemo(
    () =>
      config.handicaps.filter((h): h is RealHandicap => h !== 'none'),
    [config.handicaps]
  )

  useEffect(() => {
    const cats = allowedCategories(config.targetGroup, config.handicaps)
    const themes = allowedThemes(config.targetGroup, config.handicaps)
    const visible = new Set([
      ...getThemeCardsForWizardStep(config.targetGroup, config.category).map(
        (c) => c.value
      ),
      'random',
      'custom',
    ])
    const patch: Partial<{
      category: QuizCategory
      theme: QuizTheme
      customThemeText: string
    }> = {}
    if (!cats.includes(config.category)) {
      patch.category = cats[0]
    }
    if (!themes.includes(config.theme)) {
      patch.theme = defaultThemeForAudience(config.targetGroup)
      patch.customThemeText = ''
    } else if (!visible.has(config.theme)) {
      patch.theme = defaultThemeForAudience(config.targetGroup)
      patch.customThemeText = ''
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

  useEffect(() => {
    if (config.category !== 'competitive' || config.targetGroup === 'kids') return
    const raw = config.competitiveTimeLimitSeconds
    const clamped = clampCompetitiveTimeLimitSeconds(raw, config.targetGroup)
    if (raw === undefined || raw !== clamped) {
      setConfig({ competitiveTimeLimitSeconds: clamped })
    }
  }, [
    config.category,
    config.targetGroup,
    config.competitiveTimeLimitSeconds,
    setConfig,
  ])

  const categoryChoices = useMemo(
    () =>
      categoryOptions.filter((o) =>
        allowedCategories(config.targetGroup, config.handicaps).includes(o.value)
      ),
    [config.targetGroup, config.handicaps]
  )

  const themeStepCards = useMemo(() => {
    const rows = [
      ...getThemeCardsForWizardStep(config.targetGroup, config.category),
      ...SPECIAL_THEME_CARDS,
    ] as const
    return rows.map((row) => ({
      ...row,
      icon: THEME_STEP_ICONS[row.value],
    }))
  }, [config.targetGroup, config.category])

  const canProceedFromThemeStep = useMemo(() => {
    if (config.theme !== 'custom') return true
    return config.customThemeText.length >= 3
  }, [config.theme, config.customThemeText])

  const canProceedFromStep1 = useMemo(
    () =>
      gameMode === 'single' ||
      (Boolean(multiplayer.roomCode) && multiplayer.players.length > 0),
    [gameMode, multiplayer.roomCode, multiplayer.players.length]
  )

  const selectTheme = useCallback(
    (value: QuizTheme) => {
      setConfig({
        theme: value,
        ...(value === 'custom'
          ? {}
          : { customThemeText: '' }),
      })
    },
    [setConfig]
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
              <legend className="sr-only">Režim hry, cílová skupina a přístupnost</legend>
              <GameModeStep />
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
                          Volitelné: označte vše, co platí pro vaše publikum.
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
                aria-labelledby="step2-desc"
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
              {config.category === 'competitive' &&
                config.targetGroup !== 'kids' && (
                  <CompetitiveSettings config={config} onChange={setConfig} />
                )}
            </fieldset>
          )}

          {step === 3 && (
            <fieldset className="space-y-4 border-0 p-0">
              <legend className="sr-only">Téma kvízu</legend>
              <p className="text-center text-slate-300" id="step3-desc">
                Zvolte téma otázek
              </p>
              <p className="text-center text-xs text-slate-500">
                Nabídka se mění podle zvolené skupiny. „Překvap mě!“ nechá AI zvolit
                téma; u vlastního tématu zadejte alespoň 3 znaky (včetně mezer).
              </p>
              <div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                role="group"
                aria-labelledby="step3-desc"
              >
                {themeStepCards.map(({ value, label, icon: Icon }) => {
                  const selected = config.theme === value
                  const cardBase = `flex flex-col gap-2 rounded-2xl border p-3 text-center shadow-sm backdrop-blur-md transition-colors sm:p-4 ${
                    selected
                      ? 'border-indigo-400/70 bg-indigo-500/20 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-400/25'
                      : 'border-white/10 bg-white/5 text-slate-100 hover:border-white/20 hover:bg-white/[0.08]'
                  }`

                  if (value === 'custom') {
                    return (
                      <div key="custom" className="sm:col-span-3">
                        <div className={`${cardBase} items-stretch`}>
                          <motion.button
                            type="button"
                            layout
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => selectTheme('custom')}
                            aria-pressed={selected}
                            aria-expanded={selected}
                            className="flex flex-col items-center gap-2"
                          >
                            <Icon
                              className="h-7 w-7 text-indigo-300 sm:h-8 sm:w-8"
                              aria-hidden
                            />
                            <span className="text-sm font-semibold">{label}</span>
                          </motion.button>
                          <AnimatePresence initial={false}>
                            {selected && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{
                                  duration: 0.3,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-white/10 px-1 pt-3">
                                  <label
                                    htmlFor="wizard-custom-theme"
                                    className="mb-2 block text-left text-xs font-medium text-slate-400"
                                  >
                                    Vlastní téma
                                  </label>
                                  <input
                                    id="wizard-custom-theme"
                                    type="text"
                                    value={config.customThemeText}
                                    onChange={(e) =>
                                      setConfig({ customThemeText: e.target.value })
                                    }
                                    maxLength={500}
                                    placeholder="Napište téma..."
                                    className="w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/80 focus:outline-none focus:ring-2 focus:ring-indigo-400/25"
                                  />
                                  {config.customThemeText.length > 0 &&
                                    config.customThemeText.length < 3 && (
                                      <p className="mt-2 text-left text-xs text-amber-200/90">
                                        Ještě alespoň {3 - config.customThemeText.length}{' '}
                                        znak
                                        {3 - config.customThemeText.length === 1 ? '' : 'y'}.
                                      </p>
                                    )}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )
                  }

                  return (
                    <motion.button
                      key={value}
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectTheme(value)}
                      aria-pressed={selected}
                      className={`${cardBase} items-center`}
                    >
                      <Icon
                        className="h-7 w-7 text-indigo-300 sm:h-8 sm:w-8"
                        aria-hidden
                      />
                      <span className="text-sm font-semibold">{label}</span>
                    </motion.button>
                  )
                })}
              </div>

              <fieldset className="space-y-3 border-0 border-t border-slate-700/80 p-0 pt-6">
                <legend className="sr-only">Délka kvízu</legend>
                <p
                  className="text-center text-slate-300"
                  id="step3-length-desc"
                >
                  Zvolte délku kvízu
                </p>
                <div
                  className="grid grid-cols-1 gap-3 sm:grid-cols-3"
                  role="group"
                  aria-labelledby="step3-length-desc"
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
            </fieldset>
          )}

          {step === 4 && (
            <SummaryStep
              onEditWizardStep={(s) => setStep(s)}
              onGenerate={handleCreate}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {step !== 4 ? (
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
              disabled={
                (step === 1 && !canProceedFromStep1) ||
                (step === 3 && !canProceedFromThemeStep)
              }
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-400 disabled:pointer-events-none disabled:opacity-40"
            >
              Další krok
              <ArrowRight className="h-4 w-4" aria-hidden />
            </motion.button>
          ) : null}
        </nav>
      ) : null}
    </div>
  )
}
