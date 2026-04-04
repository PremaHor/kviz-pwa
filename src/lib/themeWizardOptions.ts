import type { HandicapType, QuizTheme, TargetGroup } from '@/types'

/** Karty témat podle publika (bez ikon — ty mapuje UI kvůli malému serverovému bundlu). */
export const THEME_OPTIONS: Record<
  TargetGroup,
  readonly { value: QuizTheme; label: string }[]
> = {
  kids: [
    { value: 'kid_seasonal', label: 'Sezónní' },
    { value: 'kid_animals', label: 'Zvířata' },
    { value: 'kid_fairy_tales_magic', label: 'Pohádky a kouzla' },
    { value: 'kid_space_dinosaurs', label: 'Vesmír a dinosauři' },
  ],
  juniors: [
    { value: 'jr_gaming_tech', label: 'Gaming a technologie' },
    { value: 'jr_nature_science', label: 'Příroda a věda' },
    { value: 'jr_pop_culture', label: 'Popkultura' },
    { value: 'jr_fake_news_myths', label: 'Fake News a mýty' },
  ],
  adults: [
    { value: 'ad_general', label: 'Všeobecné' },
    { value: 'ad_travel_geography', label: 'Cestování a geografie' },
    { value: 'ad_history_culture', label: 'Historie a kultura' },
    { value: 'ad_science_tech', label: 'Věda a technika' },
  ],
  seniors: [
    { value: 'sr_retro_6080', label: 'Retro (60.–80. léta)' },
    { value: 'sr_golden_czech_hands', label: 'Zlaté české ručičky' },
    { value: 'sr_nature_herbs', label: 'Příroda a bylinky' },
    { value: 'sr_history_local', label: 'Historie a místopis' },
  ],
}

export const SPECIAL_THEME_CARDS: readonly {
  value: QuizTheme
  label: string
}[] = [
  { value: 'random', label: 'Překvap mě!' },
  { value: 'custom', label: 'Vlastní téma' },
]

export const ALL_QUIZ_THEMES: QuizTheme[] = [
  ...THEME_OPTIONS.kids.map((t) => t.value),
  ...THEME_OPTIONS.juniors.map((t) => t.value),
  ...THEME_OPTIONS.adults.map((t) => t.value),
  ...THEME_OPTIONS.seniors.map((t) => t.value),
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
  jr_gaming_tech: 'Gaming a technologie',
  jr_nature_science: 'Příroda a věda',
  jr_pop_culture: 'Popkultura',
  jr_fake_news_myths: 'Fake News a mýty',
  ad_general: 'Všeobecné',
  ad_travel_geography: 'Cestování a geografie',
  ad_history_culture: 'Historie a kultura',
  ad_science_tech: 'Věda a technika',
  sr_retro_6080: 'Retro (60.–80. léta)',
  sr_golden_czech_hands: 'Zlaté české ručičky',
  sr_nature_herbs: 'Příroda a bylinky',
  sr_history_local: 'Historie a místopis',
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
  return [
    ...THEME_OPTIONS[targetGroup].map((o) => o.value),
    'random',
    'custom',
  ]
}

export function defaultThemeForAudience(targetGroup: TargetGroup): QuizTheme {
  return THEME_OPTIONS[targetGroup][0].value
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
  jr_gaming_tech: 'video game controller esports technology',
  jr_nature_science: 'science experiment nature discovery',
  jr_pop_culture: 'cinema streaming music youth culture',
  jr_fake_news_myths: 'newspaper magnifying glass fact check',
  ad_general: 'books knowledge library culture',
  ad_travel_geography: 'world map travel landmark geography',
  ad_history_culture: 'historical building museum culture',
  ad_science_tech: 'science laboratory technology research',
  sr_retro_6080: 'vintage retro nostalgia czechoslovakia',
  sr_golden_czech_hands: 'cooking kitchen garden traditional crafts',
  sr_nature_herbs: 'herbs medicinal plants garden',
  sr_history_local: 'czech town landscape regional history',
  random: 'educational quiz diverse topics',
  custom: 'general knowledge topic illustration',
}
