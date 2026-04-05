import type { QuizCategory, QuizTheme, TargetGroup } from '@/types'

/**
 * Textové názvy témat podle skupiny a kategorie (krok 3 průvodce).
 * `knowledge` používá jen `default`; ostatní kategorie přidávají své řádky.
 */
export const TOPICS = {
  kids: {
    default: [
      'Sezónní',
      'Zvířata',
      'Pohádky a kouzla',
      'Vesmír a dinosauři',
    ],
    fun: ['Kamarádi a legrace', 'Zvířecí vtipy'],
    educational: ['Moje tělo', 'Dopravní značky', 'První pomoc'],
    /** Řetězce obsažené v názvu tématu se vyřadí (ochrana při rozšiřování seznamů). */
    forbidden: ['Fake News', 'Zlaté české', 'Gaming'],
  },

  juniors: {
    default: [
      'Gaming a technologie',
      'Příroda a věda',
      'Popkultura',
      'Fake News a mýty',
    ],
    fun: ['Sociální sítě', 'Vtipy a memes', 'TikTok trendy'],
    educational: [
      'Finanční gramotnost',
      'Ekologie a klima',
      'Sexuální výchova',
    ],
    competitive: ['Esport a sport', 'Logické hádanky', 'Mozkové závody'],
  },

  adults: {
    default: [
      'Všeobecné',
      'Cestování a geografie',
      'Historie a kultura',
      'Věda a technika',
    ],
    fun: ['Bizarní zákony', 'Neuvěřitelné rekordy', 'Filmové perly'],
    educational: [
      'Zdraví a prevence',
      'Právo pro každý den',
      'Psychologie',
    ],
    competitive: [
      'Mozkové závody',
      'Ekonomické kvízy',
      'Globální výzvy',
    ],
  },

  seniors: {
    default: [
      'Retro (60. až 80. léta)',
      'Zlaté české ručičky',
      'Příroda a bylinky',
      'Historie a místopis',
    ],
    fun: ['Hity naší mladosti', 'Filmové poklady', 'Taneční večery'],
    educational: [
      'Zdravé stárnutí',
      'Bezpečnost na internetu',
      'První pomoc pro seniory',
    ],
    competitive: [
      'Kdo si pamatuje víc?',
      'Kvíz pro pamětníky',
      'Rodinná historie',
    ],
  },
} as const

/** Mapa „název karty“ → interní ID tématu (Gemini / store). */
export const TOPIC_THEME_BY_GROUP_AND_LABEL: {
  [G in TargetGroup]: Record<string, QuizTheme>
} = {
  kids: {
    Sezónní: 'kid_seasonal',
    Zvířata: 'kid_animals',
    'Pohádky a kouzla': 'kid_fairy_tales_magic',
    'Vesmír a dinosauři': 'kid_space_dinosaurs',
    'Kamarádi a legrace': 'kid_fun_friends_fun',
    'Zvířecí vtipy': 'kid_fun_animal_jokes',
    'Moje tělo': 'kid_edu_my_body',
    'Dopravní značky': 'kid_edu_traffic_signs',
    'První pomoc': 'kid_edu_first_aid',
  },
  juniors: {
    'Gaming a technologie': 'jr_gaming_tech',
    'Příroda a věda': 'jr_nature_science',
    Popkultura: 'jr_pop_culture',
    'Fake News a mýty': 'jr_fake_news_myths',
    'Sociální sítě': 'jr_fun_social_networks',
    'Vtipy a memes': 'jr_fun_jokes_memes',
    'TikTok trendy': 'jr_fun_tiktok_trends',
    'Finanční gramotnost': 'jr_edu_financial_literacy',
    'Ekologie a klima': 'jr_edu_ecology_climate',
    'Sexuální výchova': 'jr_edu_sex_education',
    'Esport a sport': 'jr_comp_esports_sports',
    'Logické hádanky': 'jr_comp_logic_puzzles',
    'Mozkové závody': 'jr_comp_brain_races',
  },
  adults: {
    Všeobecné: 'ad_general',
    'Cestování a geografie': 'ad_travel_geography',
    'Historie a kultura': 'ad_history_culture',
    'Věda a technika': 'ad_science_tech',
    'Bizarní zákony': 'ad_fun_bizarre_laws',
    'Neuvěřitelné rekordy': 'ad_fun_amazing_records',
    'Filmové perly': 'ad_fun_cinema_gems',
    'Zdraví a prevence': 'ad_edu_health_prevention',
    'Právo pro každý den': 'ad_edu_law_everyday',
    Psychologie: 'ad_edu_psychology',
    'Mozkové závody': 'ad_comp_brain_races',
    'Ekonomické kvízy': 'ad_comp_economy_quiz',
    'Globální výzvy': 'ad_comp_global_challenges',
  },
  seniors: {
    'Retro (60. až 80. léta)': 'sr_retro_6080',
    'Zlaté české ručičky': 'sr_golden_czech_hands',
    'Příroda a bylinky': 'sr_nature_herbs',
    'Historie a místopis': 'sr_history_local',
    'Hity naší mladosti': 'sr_fun_youth_hits',
    'Filmové poklady': 'sr_fun_cinema_treasures',
    'Taneční večery': 'sr_fun_dance_evenings',
    'Zdravé stárnutí': 'sr_edu_healthy_aging',
    'Bezpečnost na internetu': 'sr_edu_online_safety',
    'První pomoc pro seniory': 'sr_edu_first_aid_seniors',
    'Kdo si pamatuje víc?': 'sr_comp_who_remembers',
    'Kvíz pro pamětníky': 'sr_comp_veterans_quiz',
    'Rodinná historie': 'sr_comp_family_history',
  },
}

export function getTopics(targetGroup: string, category: string): string[] {
  const g = targetGroup as TargetGroup
  const c = category as QuizCategory
  const groupTopics =
    g in TOPICS ? TOPICS[g as TargetGroup] : undefined
  if (!groupTopics) {
    return [...TOPICS.adults.default]
  }

  let topics: string[] = [...groupTopics.default]

  if (c === 'fun' && 'fun' in groupTopics && groupTopics.fun) {
    topics = [...topics, ...groupTopics.fun]
  } else if (
    c === 'educational' &&
    'educational' in groupTopics &&
    groupTopics.educational
  ) {
    topics = [...topics, ...groupTopics.educational]
  } else if (
    c === 'competitive' &&
    'competitive' in groupTopics &&
    groupTopics.competitive
  ) {
    topics = [...topics, ...groupTopics.competitive]
  }

  if ('forbidden' in groupTopics && groupTopics.forbidden?.length) {
    topics = topics.filter(
      (t) =>
        !groupTopics.forbidden!.some((fragment) => t.includes(fragment))
    )
  }

  return topics
}

export function topicLabelToQuizTheme(
  targetGroup: TargetGroup,
  label: string
): QuizTheme | undefined {
  return TOPIC_THEME_BY_GROUP_AND_LABEL[targetGroup][label]
}

/** Karty témat pro krok 3 (bez „Překvap mě!“ / „Vlastní téma“). */
export function getThemeLabelsForWizardStep(
  targetGroup: TargetGroup,
  category: QuizCategory
): string[] {
  return getTopics(targetGroup, category)
}

export function getThemeCardsForWizardStep(
  targetGroup: TargetGroup,
  category: QuizCategory
): { value: QuizTheme; label: string }[] {
  const labels = getThemeLabelsForWizardStep(targetGroup, category)
  const map = TOPIC_THEME_BY_GROUP_AND_LABEL[targetGroup]
  const out: { value: QuizTheme; label: string }[] = []
  for (const label of labels) {
    const value = map[label]
    if (value) out.push({ value, label })
  }
  return out
}

/** Všechna témata pro skupinu (validace store / API napříč kategoriemi). */
export function allThemeIdsForTargetGroup(targetGroup: TargetGroup): QuizTheme[] {
  const map = TOPIC_THEME_BY_GROUP_AND_LABEL[targetGroup]
  const uniq = new Set(Object.values(map))
  return [...uniq]
}
