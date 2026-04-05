import { useMemo } from 'react'
import {
  combineHandicaps,
  type CombinedHandicapUI,
} from '@/lib/accessibility/combineHandicaps'
import { useQuizStore } from '@/store/useQuizStore'

/**
 * Aktuální kombinovaný profil přístupnosti podle konfigurace v store.
 */
export function useAccessibility(): CombinedHandicapUI {
  const handicaps = useQuizStore((s) => s.config.handicaps)
  return useMemo(() => combineHandicaps(handicaps), [handicaps])
}
