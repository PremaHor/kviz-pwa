import type {
  HandicapType,
  QuizCategory,
  QuizConfiguration,
  QuizLength,
  QuizTheme,
  TargetGroup,
} from '../types'

const TARGETS: TargetGroup[] = ['kids', 'juniors', 'adults', 'seniors']
const HANDICAPS: HandicapType[] = [
  'none',
  'visual_impairment',
  'dyslexia',
  'cognitive_dementia',
  'hearing_impairment',
  'autism_spectrum',
  'czech_learners',
]

/** Zpětná kompatibilita starších klientů API. */
const LEGACY_HANDICAP_KEYS = new Set([
  'motor_skills',
  'cognitive',
  'dementia',
])

function normalizeHandicapsFromApi(strings: string[]): HandicapType[] {
  const set = new Set<HandicapType>()
  for (const h of strings) {
    if (h === 'none') continue
    if (h === 'motor_skills') continue
    if (h === 'cognitive' || h === 'dementia') {
      set.add('cognitive_dementia')
      continue
    }
    if (HANDICAPS.includes(h as HandicapType) && h !== 'none') {
      set.add(h as HandicapType)
    }
  }
  return set.size === 0 ? ['none'] : [...set]
}
const CATEGORIES: QuizCategory[] = [
  'knowledge',
  'educational',
  'fun',
  'competitive',
]
const THEMES: QuizTheme[] = [
  'seasonal',
  'animals',
  'general',
  'science',
  'pop_culture',
]
const LENGTHS: QuizLength[] = ['short', 'medium', 'long']

function isString(v: unknown): v is string {
  return typeof v === 'string'
}

/** Ověří tělo POST /api/generate-quiz (omezí zneužití tvaru požadavku). */
export function parseQuizConfigurationBody(raw: unknown): QuizConfiguration {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Neplatné tělo požadavku (očekávám JSON objekt).')
  }
  const o = raw as Record<string, unknown>

  const targetGroup = o.targetGroup
  const category = o.category
  const theme = o.theme
  const quizLength = o.quizLength

  if (!isString(targetGroup) || !TARGETS.includes(targetGroup as TargetGroup)) {
    throw new Error('Neplatná cílová skupina.')
  }
  if (!isString(category) || !CATEGORIES.includes(category as QuizCategory)) {
    throw new Error('Neplatná kategorie.')
  }
  if (!isString(theme) || !THEMES.includes(theme as QuizTheme)) {
    throw new Error('Neplatné téma.')
  }
  if (!isString(quizLength) || !LENGTHS.includes(quizLength as QuizLength)) {
    throw new Error('Neplatná délka kvízu.')
  }

  const handicapsRaw = o.handicaps
  if (!Array.isArray(handicapsRaw)) {
    throw new Error('Neplatné pole handicapů.')
  }
  const strings = handicapsRaw.filter(isString)
  if (strings.length !== handicapsRaw.length) {
    throw new Error('Neplatná hodnota v handicapech.')
  }
  const allowedInput = new Set<string>([
    ...HANDICAPS,
    ...LEGACY_HANDICAP_KEYS,
  ])
  for (const h of strings) {
    if (!allowedInput.has(h)) {
      throw new Error('Neplatná hodnota v handicapech.')
    }
  }

  const handicaps = normalizeHandicapsFromApi(strings)

  return {
    targetGroup: targetGroup as TargetGroup,
    handicaps,
    category: category as QuizCategory,
    theme: theme as QuizTheme,
    quizLength: quizLength as QuizLength,
  }
}
