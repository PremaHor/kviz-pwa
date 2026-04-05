import type { HandicapType } from '@/types'

export type CombinedHandicapUI = {
  cognitiveDementia: boolean
  dyslexia: boolean
  visualImpairment: boolean
  hearingImpairment: boolean
  autismSpectrum: boolean
  czechLearners: boolean
  /** Nezobrazovat obrázky u otázek (zrak). */
  hideQuestionMedia: boolean
  /** Pastelové / jemné barvy u tlačítek (kognitivní). */
  cognitivePastelUi: boolean
  /** Větší dotykové cíle (kognitivní). */
  largeTouchTargets: boolean
  /** Krémové pozadí (dyslexie). */
  creamyBackground: boolean
  /** OpenDyslexic + řádkování (dyslexie). */
  dyslexiaTypography: boolean
  /** Snížit animace (PAS). */
  reduceMotion: boolean
  /** Zvýraznit vizuální zpětnou vazbu (sluch). */
  hearingVisualFeedback: boolean
  /** Třídy pro kořenový obal aplikace. */
  rootClassName: string
}

/**
 * Sloučí více handicapů do jednoho UI profilu (priority: zrak skrývá média; PAS snižuje pohyb).
 */
export function combineHandicaps(handicaps: HandicapType[]): CombinedHandicapUI {
  const h = new Set(handicaps.filter((x) => x !== 'none'))

  const cognitiveDementia = h.has('cognitive_dementia')
  const dyslexia = h.has('dyslexia')
  const visualImpairment = h.has('visual_impairment')
  const hearing = h.has('hearing_impairment')
  const autismSpectrum = h.has('autism_spectrum')
  const czechLearners = h.has('czech_learners')

  const hideQuestionMedia = visualImpairment
  const cognitivePastelUi = cognitiveDementia
  const largeTouchTargets = cognitiveDementia
  const creamyBackground = dyslexia && !visualImpairment
  const dyslexiaTypography = dyslexia
  const reduceMotion = autismSpectrum
  const hearingVisualFeedback = hearing

  const rootParts: string[] = []
  if (creamyBackground) rootParts.push('a11y-cream-root')
  if (visualImpairment) rootParts.push('a11y-high-contrast-root')

  return {
    cognitiveDementia,
    dyslexia,
    visualImpairment,
    hearingImpairment: hearing,
    autismSpectrum,
    czechLearners,
    hideQuestionMedia,
    cognitivePastelUi,
    largeTouchTargets,
    creamyBackground,
    dyslexiaTypography,
    reduceMotion,
    hearingVisualFeedback,
    rootClassName: rootParts.join(' '),
  }
}
