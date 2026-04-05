import type {
  HandicapType,
  QuizCategory,
  QuizConfiguration,
  QuizLength,
  TargetGroup,
} from '../types'
import { clampCompetitiveTimeLimitSeconds } from './competitiveScoring'
import {
  ALL_QUIZ_THEMES,
  normalizeIncomingThemeString,
} from './themeWizardOptions'

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
  if (!isString(theme)) {
    throw new Error('Neplatné téma.')
  }
  const themeNorm = normalizeIncomingThemeString(theme)
  if (!themeNorm || !ALL_QUIZ_THEMES.includes(themeNorm)) {
    throw new Error('Neplatné téma.')
  }

  let customThemeText = ''
  if (Object.prototype.hasOwnProperty.call(o, 'customThemeText')) {
    const ct = o.customThemeText
    if (ct != null && !isString(ct)) {
      throw new Error('Neplatný text vlastního tématu.')
    }
    if (isString(ct)) {
      customThemeText = ct.trim().slice(0, 500)
    }
  }

  if (themeNorm === 'custom' && customThemeText.length < 3) {
    throw new Error('Vlastní téma musí mít alespoň 3 znaky.')
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

  const tg = targetGroup as TargetGroup
  let cat = category as QuizCategory
  if (tg === 'kids' && cat === 'competitive') {
    cat = 'knowledge'
  }

  let competitiveTimeLimitSeconds: number | undefined
  if (
    cat === 'competitive' &&
    Object.prototype.hasOwnProperty.call(o, 'competitiveTimeLimitSeconds')
  ) {
    const raw = o.competitiveTimeLimitSeconds
    if (raw != null) {
      if (typeof raw !== 'number' || !Number.isFinite(raw)) {
        throw new Error('Neplatný časový limit (očekávám číslo).')
      }
      const n = Math.round(raw)
      if (n < 5 || n > 60) {
        throw new Error('Časový limit musí být mezi 5 a 60 sekundami.')
      }
      competitiveTimeLimitSeconds = clampCompetitiveTimeLimitSeconds(n, tg)
    }
  }

  return {
    targetGroup: tg,
    handicaps,
    category: cat,
    theme: themeNorm,
    customThemeText,
    quizLength: quizLength as QuizLength,
    ...(competitiveTimeLimitSeconds !== undefined
      ? { competitiveTimeLimitSeconds }
      : {}),
  }
}
