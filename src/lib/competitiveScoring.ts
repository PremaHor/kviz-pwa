import type { TargetGroup } from '../types'

/** Základní body za správnou odpověď v soutěžním režimu. */
export const COMPETITIVE_BASE_POINTS = 100

/** Výchozí limit, když skupina není soutěžní nebo chybí konfigurace. */
export const DEFAULT_COMPETITIVE_TIME_LIMIT_SECONDS = 12

export function competitiveLimitRangeForGroup(
  group: TargetGroup
): { min: number; max: number } {
  switch (group) {
    case 'adults':
      return { min: 8, max: 10 }
    case 'seniors':
      return { min: 20, max: 45 }
    case 'juniors':
      return { min: 10, max: 15 }
    case 'kids':
    default:
      return { min: 10, max: 12 }
  }
}

export function defaultCompetitiveLimitForGroup(group: TargetGroup): number {
  switch (group) {
    case 'adults':
      return 9
    case 'seniors':
      return 25
    case 'juniors':
      return 12
    case 'kids':
    default:
      return 12
  }
}

/** Tlačítka v průvodci podle věkové skupiny. */
export function competitiveTimePresetsForGroup(
  group: TargetGroup
): readonly number[] {
  switch (group) {
    case 'adults':
      return [8, 9, 10]
    case 'seniors':
      return [20, 25, 30, 35, 40]
    case 'juniors':
      return [10, 11, 12]
    case 'kids':
    default:
      return [10, 11, 12]
  }
}

/** Maximální časový bonus podle skupiny (senioři: bez časového bonusu). */
export function competitiveMaxTimeBonusForGroup(group: TargetGroup): number {
  switch (group) {
    case 'adults':
      return 65
    case 'juniors':
      return 50
    case 'seniors':
      return 0
    case 'kids':
    default:
      return 50
  }
}

export function clampCompetitiveTimeLimitSeconds(
  raw: number | undefined,
  targetGroup: TargetGroup = 'juniors'
): number {
  const { min, max } = competitiveLimitRangeForGroup(targetGroup)
  const def = defaultCompetitiveLimitForGroup(targetGroup)
  const n =
    raw === undefined || !Number.isFinite(raw) ? def : Math.round(raw as number)
  return Math.min(max, Math.max(min, n))
}

/**
 * Body za jednu otázku: správně = základ + časový bonus (0 až max podle skupiny).
 */
export function competitivePointsForAnswer(
  correct: boolean,
  secondsRemaining: number,
  timeLimitSeconds: number,
  targetGroup: TargetGroup
): number {
  if (!correct) return 0
  const maxBonus = competitiveMaxTimeBonusForGroup(targetGroup)
  if (maxBonus === 0) {
    return COMPETITIVE_BASE_POINTS
  }
  const limit = Math.max(1, clampCompetitiveTimeLimitSeconds(timeLimitSeconds, targetGroup))
  const rem = Math.max(0, Math.min(limit, secondsRemaining))
  const ratio = rem / limit
  return COMPETITIVE_BASE_POINTS + Math.round(maxBonus * ratio)
}

export function competitiveMaxScore(
  questionCount: number,
  targetGroup: TargetGroup
): number {
  const bonus = competitiveMaxTimeBonusForGroup(targetGroup)
  return questionCount * (COMPETITIVE_BASE_POINTS + bonus)
}
