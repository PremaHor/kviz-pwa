export type TargetGroup = 'kids' | 'juniors' | 'adults' | 'seniors'

export type HandicapType =
  | 'none'
  | 'visual_impairment'
  | 'dyslexia'
  | 'motor_skills'
  | 'cognitive'
  | 'dementia'

export type QuizCategory = 'knowledge' | 'educational' | 'fun' | 'competitive'

export type QuizTheme = 'seasonal' | 'animals' | 'general' | 'science' | 'pop_culture'

/** Délka kvízu — počet otázek určuje `getQuestionCount` v `lib/quizLength`. */
export type QuizLength = 'short' | 'medium' | 'long'

export interface QuizConfiguration {
  targetGroup: TargetGroup
  handicaps: HandicapType[]
  category: QuizCategory
  theme: QuizTheme
  quizLength: QuizLength
}

/** Ilustrace bez dalšího LLM — doplňuje se z Wikimedia Commons / volitelně Pexels. */
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
   * Krátké anglické klíčové slovo/spojení pro vyhledání ilustrace (vyplní Gemini).
   * Nepoužívá se v zobrazení otázky uživateli.
   */
  mediaSearchHint?: string
  /** Vyplní se po generování levným vyhledáním médií (ne z AI). */
  media?: QuizMedia
}

export interface GeneratedQuiz {
  title: string
  questions: QuizQuestion[]
}
