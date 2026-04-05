export type TargetGroup = 'kids' | 'juniors' | 'adults' | 'seniors'

export type HandicapType =
  | 'none'
  | 'visual_impairment'
  | 'dyslexia'
  | /** Kognitivní omezení a/nebo demence, jedna volba v průvodci */
  'cognitive_dementia'
  | 'hearing_impairment'
  | 'autism_spectrum'
  | 'czech_learners'

export type QuizCategory = 'knowledge' | 'educational' | 'fun' | 'competitive'

/** Téma kvízu, dynamicky podle publika a speciálních voleb. */
export type QuizTheme =
  | 'kid_seasonal'
  | 'kid_animals'
  | 'kid_fairy_tales_magic'
  | 'kid_space_dinosaurs'
  | 'jr_gaming_tech'
  | 'jr_nature_science'
  | 'jr_pop_culture'
  | 'jr_fake_news_myths'
  | 'ad_general'
  | 'ad_travel_geography'
  | 'ad_history_culture'
  | 'ad_science_tech'
  | 'sr_retro_6080'
  | 'sr_golden_czech_hands'
  | 'sr_nature_herbs'
  | 'sr_history_local'
  | 'random'
  | 'custom'

/** Délka kvízu; počet otázek určuje `getQuestionCount` v `lib/quizLength`. */
export type QuizLength = 'short' | 'medium' | 'long'

export interface QuizConfiguration {
  targetGroup: TargetGroup
  handicaps: HandicapType[]
  category: QuizCategory
  theme: QuizTheme
  /** Vyplní uživatel u volby „Vlastní téma“. */
  customThemeText: string
  quizLength: QuizLength
}

/** Ilustrace bez dalšího LLM, doplňuje se z Wikimedia Commons nebo volitelně Pexels. */
export type QuizMedia =
  | {
      kind: 'image'
      url: string
      displayUrl: string
      alt: string
      sourceLabel: string
      sourceUrl?: string
    }
  | {
      kind: 'video'
      url: string
      alt: string
      mime?: string
      sourceLabel: string
      sourceUrl?: string
    }

export interface QuizQuestion {
  id: string
  questionText: string
  options: [string, string, string, string]
  correctAnswerIndex: number
  explanation: string
  /**
   * Krátký anglický popis bezpečného obrázku pro vyhledání ilustrace (vyplní model).
   * Atmosféra / téma nesmí prozradit správnou odpověď. Nepoužívá se jako text otázky.
   */
  imageContextPrompt: string
  /** Vyplní se po generování levným vyhledáním médií (ne z AI). */
  media?: QuizMedia
}

export interface GeneratedQuiz {
  title: string
  questions: QuizQuestion[]
}
