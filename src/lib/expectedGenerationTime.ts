import type { HandicapType, QuizConfiguration } from '@/types'

/** Očekávaná doba generování (s) pro simulaci progress baru: délka + příplatek za handicapy. */
export function expectedGenerationSeconds(config: QuizConfiguration): number {
  const base =
    config.quizLength === 'short'
      ? 30
      : config.quizLength === 'medium'
        ? 90
        : 150
  const n = config.handicaps.filter(
    (h): h is Exclude<HandicapType, 'none'> => h !== 'none'
  ).length
  const extra = n <= 0 ? 0 : n === 1 ? 10 : n === 2 ? 20 : 30
  return base + extra
}
