import type { HandicapType, QuizCategory, QuizTheme, TargetGroup } from '@/types'

const ALL_CATEGORIES: QuizCategory[] = [
  'knowledge',
  'educational',
  'fun',
  'competitive',
]

const ALL_THEMES: QuizTheme[] = [
  'seasonal',
  'animals',
  'general',
  'science',
  'pop_culture',
]

/**
 * Kategorie otázek dostupné pro danou skupinu a handicapy (krok 3 průvodce).
 */
export function allowedCategories(
  targetGroup: TargetGroup,
  handicaps: HandicapType[]
): QuizCategory[] {
  const h = new Set(handicaps.filter((x) => x !== 'none'))
  let list = [...ALL_CATEGORIES]

  if (targetGroup === 'kids') {
    list = list.filter((c) => c !== 'competitive')
  }

  if (targetGroup === 'seniors' && h.has('dementia')) {
    list = list.filter((c) => c !== 'competitive')
  }

  if (h.has('cognitive')) {
    list = list.filter((c) => c !== 'competitive')
  }

  return list
}

/**
 * Témata dostupná pro danou skupinu a handicapy (krok 4 průvodce).
 */
export function allowedThemes(
  targetGroup: TargetGroup,
  handicaps: HandicapType[]
): QuizTheme[] {
  const h = new Set(handicaps.filter((x) => x !== 'none'))
  let list = [...ALL_THEMES]

  if (targetGroup === 'kids') {
    list = list.filter((t) => t !== 'pop_culture')
  }

  if (h.has('dementia')) {
    list = list.filter((t) => t !== 'pop_culture' && t !== 'science')
  }

  return list
}
