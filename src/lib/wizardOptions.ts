import type { HandicapType, QuizCategory, QuizTheme, TargetGroup } from '@/types'
import { themesValidForAudience } from '@/lib/themeWizardOptions'

const ALL_CATEGORIES: QuizCategory[] = [
  'knowledge',
  'educational',
  'fun',
  'competitive',
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

  if (h.has('cognitive_dementia')) {
    list = list.filter((c) => c !== 'competitive')
  }

  return list
}

/**
 * Témata dostupná pro publikum (krok 3) + speciální karty.
 */
export function allowedThemes(
  targetGroup: TargetGroup,
  handicaps: HandicapType[]
): QuizTheme[] {
  return themesValidForAudience(targetGroup, handicaps)
}
