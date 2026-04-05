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
  | 'kid_fun_friends_fun'
  | 'kid_fun_animal_jokes'
  | 'kid_edu_my_body'
  | 'kid_edu_traffic_signs'
  | 'kid_edu_first_aid'
  | 'jr_gaming_tech'
  | 'jr_nature_science'
  | 'jr_pop_culture'
  | 'jr_fake_news_myths'
  | 'jr_fun_social_networks'
  | 'jr_fun_jokes_memes'
  | 'jr_fun_tiktok_trends'
  | 'jr_edu_financial_literacy'
  | 'jr_edu_ecology_climate'
  | 'jr_edu_sex_education'
  | 'jr_comp_esports_sports'
  | 'jr_comp_logic_puzzles'
  | 'jr_comp_brain_races'
  | 'ad_general'
  | 'ad_travel_geography'
  | 'ad_history_culture'
  | 'ad_science_tech'
  | 'ad_fun_bizarre_laws'
  | 'ad_fun_amazing_records'
  | 'ad_fun_cinema_gems'
  | 'ad_edu_health_prevention'
  | 'ad_edu_law_everyday'
  | 'ad_edu_psychology'
  | 'ad_comp_brain_races'
  | 'ad_comp_economy_quiz'
  | 'ad_comp_global_challenges'
  | 'sr_retro_6080'
  | 'sr_golden_czech_hands'
  | 'sr_nature_herbs'
  | 'sr_history_local'
  | 'sr_fun_youth_hits'
  | 'sr_fun_cinema_treasures'
  | 'sr_fun_dance_evenings'
  | 'sr_edu_healthy_aging'
  | 'sr_edu_online_safety'
  | 'sr_edu_first_aid_seniors'
  | 'sr_comp_who_remembers'
  | 'sr_comp_veterans_quiz'
  | 'sr_comp_family_history'
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
  /**
   * Sekundy na otázku u kategorie „soutěžní“ (UI u juniorů; jinak výchozí 12).
   * Klient může poslat na `/api/generate-quiz`, server hodnotu sjednotí na otázky.
   */
  competitiveTimeLimitSeconds?: number
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

/** 3 možnosti u kognitivního handicapu, jinak 4. */
export type QuizOptionsTuple = [string, string, string] | [string, string, string, string]

export interface QuizQuestion {
  id: string
  questionText: string
  options: QuizOptionsTuple
  correctAnswerIndex: number
  explanation: string
  /**
   * Krátký anglický popis bezpečného obrázku pro vyhledání ilustrace (vyplní model).
   * Atmosféra / téma nesmí prozradit správnou odpověď. Nepoužívá se jako text otázky.
   */
  imageContextPrompt: string
  /**
   * Sekundy na zodpovězení; typicky jen u `competitive`, nastaví server podle konfigurace.
   */
  timeLimit?: number
  /** Vyplní se po generování levným vyhledáním médií (ne z AI). */
  media?: QuizMedia
}

export interface GeneratedQuiz {
  title: string
  questions: QuizQuestion[]
}
