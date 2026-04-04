import type { QuizLength } from '@/types'

export const QUESTION_COUNT_BY_LENGTH: Record<QuizLength, number> = {
  short: 15,
  medium: 25,
  long: 35,
}

export function getQuestionCount(length: QuizLength): number {
  return QUESTION_COUNT_BY_LENGTH[length]
}

export const quizLengthChoices: {
  value: QuizLength
  label: string
  count: number
}[] = [
  { value: 'short', label: 'Krátký', count: 15 },
  { value: 'medium', label: 'Střední', count: 25 },
  { value: 'long', label: 'Dlouhý', count: 35 },
]
