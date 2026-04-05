import type { QuizConfiguration, QuizLength } from '@/types'

const BASE_RANGE_MINUTES: Record<QuizLength, readonly [number, number]> = {
  short: [7, 10],
  medium: [12, 15],
  long: [18, 22],
}

export function estimateTimeMinutesRange(
  config: QuizConfiguration
): { min: number; max: number } {
  const [a, b] = BASE_RANGE_MINUTES[config.quizLength]
  let min = a
  let max = b
  const h = new Set(config.handicaps.filter((x) => x !== 'none'))
  if (h.has('cognitive_dementia')) {
    min += 5
    max += 5
  }
  if (h.has('visual_impairment')) {
    min += 3
    max += 3
  }
  if (h.has('dyslexia')) {
    min += 3
    max += 3
  }
  return { min, max }
}

/** Text ve tvaru „12–15 minut“. */
export function formatEstimatedQuizDuration(config: QuizConfiguration): string {
  const { min, max } = estimateTimeMinutesRange(config)
  return `${min}–${max} minut`
}
