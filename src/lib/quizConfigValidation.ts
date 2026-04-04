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
  'motor_skills',
  'cognitive',
  'dementia',
]
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
  const handicaps = handicapsRaw.filter(
    (h): h is HandicapType =>
      isString(h) && HANDICAPS.includes(h as HandicapType)
  )
  if (handicaps.length !== handicapsRaw.length) {
    throw new Error('Neplatná hodnota v handicapech.')
  }

  return {
    targetGroup: targetGroup as TargetGroup,
    handicaps,
    category: category as QuizCategory,
    theme: theme as QuizTheme,
    quizLength: quizLength as QuizLength,
  }
}
