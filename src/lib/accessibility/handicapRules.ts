import type { HandicapType, QuizConfiguration } from '@/types'

/** Počet možností odpovědi podle handicapů (kognitivní = 3). */
export function quizOptionCountForConfig(config: QuizConfiguration): 3 | 4 {
  return config.handicaps.includes('cognitive_dementia') ? 3 : 4
}

export function hasHandicap(
  handicaps: HandicapType[],
  h: Exclude<HandicapType, 'none'>
): boolean {
  return handicaps.includes(h)
}

/**
 * Striktní pravidla pro prompt (Gemini). `handicaps` = hodnoty bez `none`.
 */
export function getAccessibilityPromptRules(handicaps: string[]): string {
  const rules: string[] = []

  if (handicaps.includes('cognitive_dementia')) {
    rules.push(
      'KOGNITIVNÍ / DEMENCE: Každá otázka maximálně 10 slov; žádné negace v otázce; přesně 3 možnosti odpovědi v poli "options" (ne 4); "correctAnswerIndex" pouze 0, 1 nebo 2.'
    )
  }
  if (handicaps.includes('dyslexia')) {
    rules.push(
      'DYSLEXIE: Vyhni se slovům s velmi podobnými tvary (např. být/byt, byl/býl); nepoužívej slova s 3 a více souhláskami v řadě (bez mezery samohlásky). Krátké věty, běžná slova.'
    )
  }
  if (handicaps.includes('visual_impairment')) {
    rules.push(
      'ZRAKOVÉ POSTIŽENÍ: Otázky musí dávat plný smysl bez obrázků; žádné „podívej se“, „na obrázku“, barvy jako jediný rozdíl mezi odpověďmi.'
    )
  }
  if (handicaps.includes('hearing_impairment')) {
    rules.push(
      'SLUCHOVÉ POSTIŽENÍ: Žádné otázky o zvucích, hudbě, hlasech ani „poslechni si“; vše jen z textu a logiky.'
    )
  }
  if (handicaps.includes('autism_spectrum')) {
    rules.push(
      'PAS (AUTISMUS): Doslovný, přímý jazyk; žádné metafory, ironie a dvojznačnosti; jednoznačné otázky a odpovědi.'
    )
  }
  if (handicaps.includes('czech_learners')) {
    rules.push(
      'CIZinci (čeština A1–A2): Používej především přítomný čas a základní slovní zásobu; otázka maximálně 5 slov; jednoduché věty.'
    )
  }

  return rules.join('\n')
}
