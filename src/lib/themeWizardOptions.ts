import type { HandicapType, QuizTheme, TargetGroup } from '@/types'
import {
  allThemeIdsForTargetGroup,
  TOPICS,
  TOPIC_THEME_BY_GROUP_AND_LABEL,
} from '@/lib/topicsByGroup'

function themeOptionsFromDefaults(
  targetGroup: TargetGroup
): readonly { value: QuizTheme; label: string }[] {
  const map = TOPIC_THEME_BY_GROUP_AND_LABEL[targetGroup]
  return TOPICS[targetGroup].default.map((label) => ({
    value: map[label]!,
    label,
  }))
}

/** Základní čtyři karty témat (řádek „default“ v `topicsByGroup`). */
export const THEME_OPTIONS: Record<
  TargetGroup,
  readonly { value: QuizTheme; label: string }[]
> = {
  kids: themeOptionsFromDefaults('kids'),
  juniors: themeOptionsFromDefaults('juniors'),
  adults: themeOptionsFromDefaults('adults'),
  seniors: themeOptionsFromDefaults('seniors'),
}

export const SPECIAL_THEME_CARDS: readonly {
  value: QuizTheme
  label: string
}[] = [
  { value: 'random', label: 'Překvap mě!' },
  { value: 'custom', label: 'Vlastní téma' },
]

const GROUP_ORDER: TargetGroup[] = ['kids', 'juniors', 'adults', 'seniors']

export const ALL_QUIZ_THEMES: QuizTheme[] = [
  ...new Set(
    GROUP_ORDER.flatMap((g) => allThemeIdsForTargetGroup(g))
  ),
  'random',
  'custom',
]

const LEGACY_THEME_MAP: Record<string, QuizTheme> = {
  seasonal: 'kid_seasonal',
  animals: 'kid_animals',
  general: 'ad_general',
  science: 'ad_science_tech',
  pop_culture: 'jr_pop_culture',
}

export const THEME_LABEL_CS: Record<QuizTheme, string> = {
  kid_seasonal: 'Sezónní',
  kid_animals: 'Zvířata',
  kid_fairy_tales_magic: 'Pohádky a kouzla',
  kid_space_dinosaurs: 'Vesmír a dinosauři',
  kid_fun_friends_fun: 'Kamarádi a legrace',
  kid_fun_animal_jokes: 'Zvířecí vtipy',
  kid_edu_my_body: 'Moje tělo',
  kid_edu_traffic_signs: 'Dopravní značky',
  kid_edu_first_aid: 'První pomoc',
  jr_gaming_tech: 'Gaming a technologie',
  jr_nature_science: 'Příroda a věda',
  jr_pop_culture: 'Popkultura',
  jr_fake_news_myths: 'Fake News a mýty',
  jr_fun_social_networks: 'Sociální sítě',
  jr_fun_jokes_memes: 'Vtipy a memes',
  jr_fun_tiktok_trends: 'TikTok trendy',
  jr_edu_financial_literacy: 'Finanční gramotnost',
  jr_edu_ecology_climate: 'Ekologie a klima',
  jr_edu_sex_education: 'Sexuální výchova',
  jr_comp_esports_sports: 'Esport a sport',
  jr_comp_logic_puzzles: 'Logické hádanky',
  jr_comp_brain_races: 'Mozkové závody',
  ad_general: 'Všeobecné',
  ad_travel_geography: 'Cestování a geografie',
  ad_history_culture: 'Historie a kultura',
  ad_science_tech: 'Věda a technika',
  ad_fun_bizarre_laws: 'Bizarní zákony',
  ad_fun_amazing_records: 'Neuvěřitelné rekordy',
  ad_fun_cinema_gems: 'Filmové perly',
  ad_edu_health_prevention: 'Zdraví a prevence',
  ad_edu_law_everyday: 'Právo pro každý den',
  ad_edu_psychology: 'Psychologie',
  ad_comp_brain_races: 'Mozkové závody',
  ad_comp_economy_quiz: 'Ekonomické kvízy',
  ad_comp_global_challenges: 'Globální výzvy',
  sr_retro_6080: 'Retro (60. až 80. léta)',
  sr_golden_czech_hands: 'Zlaté české ručičky',
  sr_nature_herbs: 'Příroda a bylinky',
  sr_history_local: 'Historie a místopis',
  sr_fun_youth_hits: 'Hity naší mladosti',
  sr_fun_cinema_treasures: 'Filmové poklady',
  sr_fun_dance_evenings: 'Taneční večery',
  sr_edu_healthy_aging: 'Zdravé stárnutí',
  sr_edu_online_safety: 'Bezpečnost na internetu',
  sr_edu_first_aid_seniors: 'První pomoc pro seniory',
  sr_comp_who_remembers: 'Kdo si pamatuje víc?',
  sr_comp_veterans_quiz: 'Kvíz pro pamětníky',
  sr_comp_family_history: 'Rodinná historie',
  random: 'Překvap mě!',
  custom: 'Vlastní téma',
}

export const TARGET_GROUP_LABEL_CS: Record<TargetGroup, string> = {
  kids: 'Děti',
  juniors: 'Junioři',
  adults: 'Dospělí',
  seniors: 'Senioři',
}

export function themesValidForAudience(
  targetGroup: TargetGroup,
  _handicaps: HandicapType[]
): QuizTheme[] {
  void _handicaps
  return [...allThemeIdsForTargetGroup(targetGroup), 'random', 'custom']
}

export function defaultThemeForAudience(targetGroup: TargetGroup): QuizTheme {
  const label = TOPICS[targetGroup].default[0]
  return TOPIC_THEME_BY_GROUP_AND_LABEL[targetGroup][label]!
}

export function normalizeIncomingThemeString(raw: string): QuizTheme | null {
  if (ALL_QUIZ_THEMES.includes(raw as QuizTheme)) {
    return raw as QuizTheme
  }
  const legacy = LEGACY_THEME_MAP[raw]
  return legacy ?? null
}

export function compactThemeSummary(config: {
  theme: QuizTheme
  customThemeText: string
}): string {
  if (config.theme === 'random') {
    return 'náhodné téma (viz detailní instrukce v obohacení promptu)'
  }
  if (config.theme === 'custom') {
    const t = config.customThemeText.trim()
    return t.length > 0 ? t.slice(0, 120) : 'vlastní téma (doplň popis)'
  }
  return THEME_LABEL_CS[config.theme]
}

export const THEME_MEDIA_HINT_EN: Record<QuizTheme, string> = {
  kid_seasonal: 'spring easter children holiday nature',
  kid_animals: 'cute animals wildlife forest',
  kid_fairy_tales_magic: 'fairy tale castle storybook magic',
  kid_space_dinosaurs: 'dinosaur planet space stars',
  kid_fun_friends_fun: 'children friends playground cheerful',
  kid_fun_animal_jokes: 'funny cute animals cartoon friendly',
  kid_edu_my_body: 'human body health children simple diagram',
  kid_edu_traffic_signs: 'road signs traffic safety education',
  kid_edu_first_aid: 'first aid kit safety simple illustration',
  jr_gaming_tech: 'video game controller esports technology',
  jr_nature_science: 'science experiment nature discovery',
  jr_pop_culture: 'cinema streaming music youth culture',
  jr_fake_news_myths: 'newspaper magnifying glass fact check',
  jr_fun_social_networks: 'smartphone social media youth',
  jr_fun_jokes_memes: 'comic meme style youth culture',
  jr_fun_tiktok_trends: 'youth dance colorful stage',
  jr_edu_financial_literacy: 'coins savings budget education',
  jr_edu_ecology_climate: 'earth climate nature youth',
  jr_edu_sex_education: 'health education classroom abstract tasteful',
  jr_comp_esports_sports: 'esports arena controller sports',
  jr_comp_logic_puzzles: 'puzzle brain thinking logic',
  jr_comp_brain_races: 'quiz competition brain',
  ad_general: 'books knowledge library culture',
  ad_travel_geography: 'world map travel landmark geography',
  ad_history_culture: 'historical building museum culture',
  ad_science_tech: 'science laboratory technology research',
  ad_fun_bizarre_laws: 'courthouse gavel unusual law',
  ad_fun_amazing_records: 'trophy records achievement',
  ad_fun_cinema_gems: 'cinema film classic theater',
  ad_edu_health_prevention: 'healthcare stethoscope wellness',
  ad_edu_law_everyday: 'legal documents civic office',
  ad_edu_psychology: 'psychology calm office abstract',
  ad_comp_brain_races: 'quiz show competition adults',
  ad_comp_economy_quiz: 'economy charts business',
  ad_comp_global_challenges: 'globe sustainability challenges',
  sr_retro_6080: 'vintage retro nostalgia czechoslovakia',
  sr_golden_czech_hands: 'cooking kitchen garden traditional crafts',
  sr_nature_herbs: 'herbs medicinal plants garden',
  sr_history_local: 'czech town landscape regional history',
  sr_fun_youth_hits: 'vintage radio music nostalgia',
  sr_fun_cinema_treasures: 'classic cinema projector film',
  sr_fun_dance_evenings: 'ballroom dance vintage evening',
  sr_edu_healthy_aging: 'seniors walking park wellness',
  sr_edu_online_safety: 'computer seniors safety education',
  sr_edu_first_aid_seniors: 'first aid senior care gentle',
  sr_comp_who_remembers: 'memory quiz seniors friendly',
  sr_comp_veterans_quiz: 'family photo album nostalgia',
  sr_comp_family_history: 'genealogy family tree heritage',
  random: 'educational quiz diverse topics',
  custom: 'general knowledge topic illustration',
}
