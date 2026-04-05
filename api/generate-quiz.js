"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server/generate-quiz.ts
var generate_quiz_exports = {};
__export(generate_quiz_exports, {
  config: () => config,
  default: () => handler
});
module.exports = __toCommonJS(generate_quiz_exports);

// src/lib/accessibility/handicapRules.ts
function quizOptionCountForConfig(config2) {
  return config2.handicaps.includes("cognitive_dementia") ? 3 : 4;
}
function getAccessibilityPromptRules(handicaps) {
  const rules = [];
  if (handicaps.includes("cognitive_dementia")) {
    rules.push(
      'KOGNITIVN\xCD / DEMENCE: Ka\u017Ed\xE1 ot\xE1zka maxim\xE1ln\u011B 10 slov; \u017E\xE1dn\xE9 negace v ot\xE1zce; p\u0159esn\u011B 3 mo\u017Enosti odpov\u011Bdi v poli "options" (ne 4); "correctAnswerIndex" pouze 0, 1 nebo 2.'
    );
  }
  if (handicaps.includes("dyslexia")) {
    rules.push(
      "DYSLEXIE: Vyhni se slov\u016Fm s velmi podobn\xFDmi tvary (nap\u0159. b\xFDt/byt, byl/b\xFDl); nepou\u017E\xEDvej slova s 3 a v\xEDce souhl\xE1skami v \u0159ad\u011B (bez mezery samohl\xE1sky). Kr\xE1tk\xE9 v\u011Bty, b\u011B\u017En\xE1 slova."
    );
  }
  if (handicaps.includes("visual_impairment")) {
    rules.push(
      "ZRAKOV\xC9 POSTI\u017DEN\xCD: Ot\xE1zky mus\xED d\xE1vat pln\xFD smysl bez obr\xE1zk\u016F; \u017E\xE1dn\xE9 \u201Epod\xEDvej se\u201C, \u201Ena obr\xE1zku\u201C, barvy jako jedin\xFD rozd\xEDl mezi odpov\u011B\u010Fmi."
    );
  }
  if (handicaps.includes("hearing_impairment")) {
    rules.push(
      "SLUCHOV\xC9 POSTI\u017DEN\xCD: \u017D\xE1dn\xE9 ot\xE1zky o zvuc\xEDch, hudb\u011B, hlasech ani \u201Eposlechni si\u201C; v\u0161e jen z textu a logiky."
    );
  }
  if (handicaps.includes("autism_spectrum")) {
    rules.push(
      "PAS (AUTISMUS): Doslovn\xFD, p\u0159\xEDm\xFD jazyk; \u017E\xE1dn\xE9 metafory, ironie a dvojzna\u010Dnosti; jednozna\u010Dn\xE9 ot\xE1zky a odpov\u011Bdi."
    );
  }
  if (handicaps.includes("czech_learners")) {
    rules.push(
      "CIZinci (\u010De\u0161tina A1\u2013A2): Pou\u017E\xEDvej p\u0159edev\u0161\xEDm p\u0159\xEDtomn\xFD \u010Das a z\xE1kladn\xED slovn\xED z\xE1sobu; ot\xE1zka maxim\xE1ln\u011B 5 slov; jednoduch\xE9 v\u011Bty."
    );
  }
  return rules.join("\n");
}

// src/lib/topicsByGroup.ts
var TOPICS = {
  kids: {
    default: [
      "Sez\xF3nn\xED",
      "Zv\xED\u0159ata",
      "Poh\xE1dky a kouzla",
      "Vesm\xEDr a dinosau\u0159i"
    ],
    fun: ["Kamar\xE1di a legrace", "Zv\xED\u0159ec\xED vtipy"],
    educational: ["Moje t\u011Blo", "Dopravn\xED zna\u010Dky", "Prvn\xED pomoc"],
    /** Řetězce obsažené v názvu tématu se vyřadí (ochrana při rozšiřování seznamů). */
    forbidden: ["Fake News", "Zlat\xE9 \u010Desk\xE9", "Gaming"]
  },
  juniors: {
    default: [
      "Gaming a technologie",
      "P\u0159\xEDroda a v\u011Bda",
      "Popkultura",
      "Fake News a m\xFDty"
    ],
    fun: ["Soci\xE1ln\xED s\xEDt\u011B", "Vtipy a memes", "TikTok trendy"],
    educational: [
      "Finan\u010Dn\xED gramotnost",
      "Ekologie a klima",
      "Sexu\xE1ln\xED v\xFDchova"
    ],
    competitive: ["Esport a sport", "Logick\xE9 h\xE1danky", "Mozkov\xE9 z\xE1vody"]
  },
  adults: {
    default: [
      "V\u0161eobecn\xE9",
      "Cestov\xE1n\xED a geografie",
      "Historie a kultura",
      "V\u011Bda a technika"
    ],
    fun: ["Bizarn\xED z\xE1kony", "Neuv\u011B\u0159iteln\xE9 rekordy", "Filmov\xE9 perly"],
    educational: [
      "Zdrav\xED a prevence",
      "Pr\xE1vo pro ka\u017Ed\xFD den",
      "Psychologie"
    ],
    competitive: [
      "Mozkov\xE9 z\xE1vody",
      "Ekonomick\xE9 kv\xEDzy",
      "Glob\xE1ln\xED v\xFDzvy"
    ]
  },
  seniors: {
    default: [
      "Retro (60. a\u017E 80. l\xE9ta)",
      "Zlat\xE9 \u010Desk\xE9 ru\u010Di\u010Dky",
      "P\u0159\xEDroda a bylinky",
      "Historie a m\xEDstopis"
    ],
    fun: ["Hity na\u0161\xED mladosti", "Filmov\xE9 poklady", "Tane\u010Dn\xED ve\u010Dery"],
    educational: [
      "Zdrav\xE9 st\xE1rnut\xED",
      "Bezpe\u010Dnost na internetu",
      "Prvn\xED pomoc pro seniory"
    ],
    competitive: [
      "Kdo si pamatuje v\xEDc?",
      "Kv\xEDz pro pam\u011Btn\xEDky",
      "Rodinn\xE1 historie"
    ]
  }
};
var TOPIC_THEME_BY_GROUP_AND_LABEL = {
  kids: {
    Sez\u00F3nn\u00ED: "kid_seasonal",
    Zv\u00ED\u0159ata: "kid_animals",
    "Poh\xE1dky a kouzla": "kid_fairy_tales_magic",
    "Vesm\xEDr a dinosau\u0159i": "kid_space_dinosaurs",
    "Kamar\xE1di a legrace": "kid_fun_friends_fun",
    "Zv\xED\u0159ec\xED vtipy": "kid_fun_animal_jokes",
    "Moje t\u011Blo": "kid_edu_my_body",
    "Dopravn\xED zna\u010Dky": "kid_edu_traffic_signs",
    "Prvn\xED pomoc": "kid_edu_first_aid"
  },
  juniors: {
    "Gaming a technologie": "jr_gaming_tech",
    "P\u0159\xEDroda a v\u011Bda": "jr_nature_science",
    Popkultura: "jr_pop_culture",
    "Fake News a m\xFDty": "jr_fake_news_myths",
    "Soci\xE1ln\xED s\xEDt\u011B": "jr_fun_social_networks",
    "Vtipy a memes": "jr_fun_jokes_memes",
    "TikTok trendy": "jr_fun_tiktok_trends",
    "Finan\u010Dn\xED gramotnost": "jr_edu_financial_literacy",
    "Ekologie a klima": "jr_edu_ecology_climate",
    "Sexu\xE1ln\xED v\xFDchova": "jr_edu_sex_education",
    "Esport a sport": "jr_comp_esports_sports",
    "Logick\xE9 h\xE1danky": "jr_comp_logic_puzzles",
    "Mozkov\xE9 z\xE1vody": "jr_comp_brain_races"
  },
  adults: {
    V\u0161eobecn\u00E9: "ad_general",
    "Cestov\xE1n\xED a geografie": "ad_travel_geography",
    "Historie a kultura": "ad_history_culture",
    "V\u011Bda a technika": "ad_science_tech",
    "Bizarn\xED z\xE1kony": "ad_fun_bizarre_laws",
    "Neuv\u011B\u0159iteln\xE9 rekordy": "ad_fun_amazing_records",
    "Filmov\xE9 perly": "ad_fun_cinema_gems",
    "Zdrav\xED a prevence": "ad_edu_health_prevention",
    "Pr\xE1vo pro ka\u017Ed\xFD den": "ad_edu_law_everyday",
    Psychologie: "ad_edu_psychology",
    "Mozkov\xE9 z\xE1vody": "ad_comp_brain_races",
    "Ekonomick\xE9 kv\xEDzy": "ad_comp_economy_quiz",
    "Glob\xE1ln\xED v\xFDzvy": "ad_comp_global_challenges"
  },
  seniors: {
    "Retro (60. a\u017E 80. l\xE9ta)": "sr_retro_6080",
    "Zlat\xE9 \u010Desk\xE9 ru\u010Di\u010Dky": "sr_golden_czech_hands",
    "P\u0159\xEDroda a bylinky": "sr_nature_herbs",
    "Historie a m\xEDstopis": "sr_history_local",
    "Hity na\u0161\xED mladosti": "sr_fun_youth_hits",
    "Filmov\xE9 poklady": "sr_fun_cinema_treasures",
    "Tane\u010Dn\xED ve\u010Dery": "sr_fun_dance_evenings",
    "Zdrav\xE9 st\xE1rnut\xED": "sr_edu_healthy_aging",
    "Bezpe\u010Dnost na internetu": "sr_edu_online_safety",
    "Prvn\xED pomoc pro seniory": "sr_edu_first_aid_seniors",
    "Kdo si pamatuje v\xEDc?": "sr_comp_who_remembers",
    "Kv\xEDz pro pam\u011Btn\xEDky": "sr_comp_veterans_quiz",
    "Rodinn\xE1 historie": "sr_comp_family_history"
  }
};
function allThemeIdsForTargetGroup(targetGroup) {
  const map = TOPIC_THEME_BY_GROUP_AND_LABEL[targetGroup];
  const uniq = new Set(Object.values(map));
  return [...uniq];
}

// src/lib/themeWizardOptions.ts
function themeOptionsFromDefaults(targetGroup) {
  const map = TOPIC_THEME_BY_GROUP_AND_LABEL[targetGroup];
  return TOPICS[targetGroup].default.map((label) => ({
    value: map[label],
    label
  }));
}
var THEME_OPTIONS = {
  kids: themeOptionsFromDefaults("kids"),
  juniors: themeOptionsFromDefaults("juniors"),
  adults: themeOptionsFromDefaults("adults"),
  seniors: themeOptionsFromDefaults("seniors")
};
var GROUP_ORDER = ["kids", "juniors", "adults", "seniors"];
var ALL_QUIZ_THEMES = [
  ...new Set(
    GROUP_ORDER.flatMap((g) => allThemeIdsForTargetGroup(g))
  ),
  "random",
  "custom"
];
var LEGACY_THEME_MAP = {
  seasonal: "kid_seasonal",
  animals: "kid_animals",
  general: "ad_general",
  science: "ad_science_tech",
  pop_culture: "jr_pop_culture"
};
var THEME_LABEL_CS = {
  kid_seasonal: "Sez\xF3nn\xED",
  kid_animals: "Zv\xED\u0159ata",
  kid_fairy_tales_magic: "Poh\xE1dky a kouzla",
  kid_space_dinosaurs: "Vesm\xEDr a dinosau\u0159i",
  kid_fun_friends_fun: "Kamar\xE1di a legrace",
  kid_fun_animal_jokes: "Zv\xED\u0159ec\xED vtipy",
  kid_edu_my_body: "Moje t\u011Blo",
  kid_edu_traffic_signs: "Dopravn\xED zna\u010Dky",
  kid_edu_first_aid: "Prvn\xED pomoc",
  jr_gaming_tech: "Gaming a technologie",
  jr_nature_science: "P\u0159\xEDroda a v\u011Bda",
  jr_pop_culture: "Popkultura",
  jr_fake_news_myths: "Fake News a m\xFDty",
  jr_fun_social_networks: "Soci\xE1ln\xED s\xEDt\u011B",
  jr_fun_jokes_memes: "Vtipy a memes",
  jr_fun_tiktok_trends: "TikTok trendy",
  jr_edu_financial_literacy: "Finan\u010Dn\xED gramotnost",
  jr_edu_ecology_climate: "Ekologie a klima",
  jr_edu_sex_education: "Sexu\xE1ln\xED v\xFDchova",
  jr_comp_esports_sports: "Esport a sport",
  jr_comp_logic_puzzles: "Logick\xE9 h\xE1danky",
  jr_comp_brain_races: "Mozkov\xE9 z\xE1vody",
  ad_general: "V\u0161eobecn\xE9",
  ad_travel_geography: "Cestov\xE1n\xED a geografie",
  ad_history_culture: "Historie a kultura",
  ad_science_tech: "V\u011Bda a technika",
  ad_fun_bizarre_laws: "Bizarn\xED z\xE1kony",
  ad_fun_amazing_records: "Neuv\u011B\u0159iteln\xE9 rekordy",
  ad_fun_cinema_gems: "Filmov\xE9 perly",
  ad_edu_health_prevention: "Zdrav\xED a prevence",
  ad_edu_law_everyday: "Pr\xE1vo pro ka\u017Ed\xFD den",
  ad_edu_psychology: "Psychologie",
  ad_comp_brain_races: "Mozkov\xE9 z\xE1vody",
  ad_comp_economy_quiz: "Ekonomick\xE9 kv\xEDzy",
  ad_comp_global_challenges: "Glob\xE1ln\xED v\xFDzvy",
  sr_retro_6080: "Retro (60. a\u017E 80. l\xE9ta)",
  sr_golden_czech_hands: "Zlat\xE9 \u010Desk\xE9 ru\u010Di\u010Dky",
  sr_nature_herbs: "P\u0159\xEDroda a bylinky",
  sr_history_local: "Historie a m\xEDstopis",
  sr_fun_youth_hits: "Hity na\u0161\xED mladosti",
  sr_fun_cinema_treasures: "Filmov\xE9 poklady",
  sr_fun_dance_evenings: "Tane\u010Dn\xED ve\u010Dery",
  sr_edu_healthy_aging: "Zdrav\xE9 st\xE1rnut\xED",
  sr_edu_online_safety: "Bezpe\u010Dnost na internetu",
  sr_edu_first_aid_seniors: "Prvn\xED pomoc pro seniory",
  sr_comp_who_remembers: "Kdo si pamatuje v\xEDc?",
  sr_comp_veterans_quiz: "Kv\xEDz pro pam\u011Btn\xEDky",
  sr_comp_family_history: "Rodinn\xE1 historie",
  random: "P\u0159ekvap m\u011B!",
  custom: "Vlastn\xED t\xE9ma"
};
function normalizeIncomingThemeString(raw) {
  if (ALL_QUIZ_THEMES.includes(raw)) {
    return raw;
  }
  const legacy = LEGACY_THEME_MAP[raw];
  return legacy ?? null;
}
function compactThemeSummary(config2) {
  if (config2.theme === "random") {
    return "n\xE1hodn\xE9 t\xE9ma (viz detailn\xED instrukce v obohacen\xED promptu)";
  }
  if (config2.theme === "custom") {
    const t = config2.customThemeText.trim();
    return t.length > 0 ? t.slice(0, 120) : "vlastn\xED t\xE9ma (dopl\u0148 popis)";
  }
  return THEME_LABEL_CS[config2.theme];
}
var THEME_MEDIA_HINT_EN = {
  kid_seasonal: "spring easter children holiday nature",
  kid_animals: "cute animals wildlife forest",
  kid_fairy_tales_magic: "fairy tale castle storybook magic",
  kid_space_dinosaurs: "dinosaur planet space stars",
  kid_fun_friends_fun: "children friends playground cheerful",
  kid_fun_animal_jokes: "funny cute animals cartoon friendly",
  kid_edu_my_body: "human body health children simple diagram",
  kid_edu_traffic_signs: "road signs traffic safety education",
  kid_edu_first_aid: "first aid kit safety simple illustration",
  jr_gaming_tech: "video game controller esports technology",
  jr_nature_science: "science experiment nature discovery",
  jr_pop_culture: "cinema streaming music youth culture",
  jr_fake_news_myths: "newspaper magnifying glass fact check",
  jr_fun_social_networks: "smartphone social media youth",
  jr_fun_jokes_memes: "comic meme style youth culture",
  jr_fun_tiktok_trends: "youth dance colorful stage",
  jr_edu_financial_literacy: "coins savings budget education",
  jr_edu_ecology_climate: "earth climate nature youth",
  jr_edu_sex_education: "health education classroom abstract tasteful",
  jr_comp_esports_sports: "esports arena controller sports",
  jr_comp_logic_puzzles: "puzzle brain thinking logic",
  jr_comp_brain_races: "quiz competition brain",
  ad_general: "books knowledge library culture",
  ad_travel_geography: "world map travel landmark geography",
  ad_history_culture: "historical building museum culture",
  ad_science_tech: "science laboratory technology research",
  ad_fun_bizarre_laws: "courthouse gavel unusual law",
  ad_fun_amazing_records: "trophy records achievement",
  ad_fun_cinema_gems: "cinema film classic theater",
  ad_edu_health_prevention: "healthcare stethoscope wellness",
  ad_edu_law_everyday: "legal documents civic office",
  ad_edu_psychology: "psychology calm office abstract",
  ad_comp_brain_races: "quiz show competition adults",
  ad_comp_economy_quiz: "economy charts business",
  ad_comp_global_challenges: "globe sustainability challenges",
  sr_retro_6080: "vintage retro nostalgia czechoslovakia",
  sr_golden_czech_hands: "cooking kitchen garden traditional crafts",
  sr_nature_herbs: "herbs medicinal plants garden",
  sr_history_local: "czech town landscape regional history",
  sr_fun_youth_hits: "vintage radio music nostalgia",
  sr_fun_cinema_treasures: "classic cinema projector film",
  sr_fun_dance_evenings: "ballroom dance vintage evening",
  sr_edu_healthy_aging: "seniors walking park wellness",
  sr_edu_online_safety: "computer seniors safety education",
  sr_edu_first_aid_seniors: "first aid senior care gentle",
  sr_comp_who_remembers: "memory quiz seniors friendly",
  sr_comp_veterans_quiz: "family photo album nostalgia",
  sr_comp_family_history: "genealogy family tree heritage",
  random: "educational quiz diverse topics",
  custom: "general knowledge topic illustration"
};

// src/lib/categoryFallbacks.ts
var CATEGORY_FALLBACKS = {
  fun: {
    Zv\u00ED\u0159ata: [
      {
        text: "Kter\xE9 zv\xED\u0159e by bylo nejlep\u0161\xED tane\u010Dn\xEDk? \u{1F57A}",
        options: ["Medv\u011Bd", "Plch", "\u017D\xE1ba", "Hroch"],
        correctIndex: 2,
        explanation: "\u017D\xE1by sk\xE1\u010Dou a \u201Ep\u0159edv\xE1d\u011Bj\xED\u201C pohyb \u2014 v na\u0161em vt\xEDpku vyhr\xE1v\xE1 \u017Eab\xED styl. \u{1F438}",
        imageContextPrompt: "forest pond with lily pads soft light"
      },
      {
        text: "Kdo by vyhr\xE1l sout\u011B\u017E o nejhlasit\u011Bj\u0161\xED \u0159ev? \u{1F981}",
        options: ["My\u0161", "Lev", "Ko\u010Dka", "Kr\xE1l\xEDk"],
        correctIndex: 1,
        explanation: "Lev je proslul\xFD siln\xFDm \u0159evem \u2014 v z\xE1bavn\xE9m kv\xEDzu bereme klasiku savc\u016F.",
        imageContextPrompt: "african savanna grass sunset silhouette"
      },
      {
        text: "Kter\xE9 zv\xED\u0159e by si nejsp\xED\u0161 vzalo de\u0161tn\xEDk, kdyby pr\u0161elo? \u2614",
        options: ["Ryba", "Veverka", "Slim\xE1k", "Orel"],
        correctIndex: 2,
        explanation: "Slim\xE1k nerad vysych\xE1 \u2014 vtipn\u011B si p\u0159edstav\xEDme, \u017Ee by hledal \u201Ekryt\u201C. \u{1F40C}",
        imageContextPrompt: "garden after rain green leaves droplets"
      },
      {
        text: "Kdo je podle vtipu nejlep\u0161\xED kamar\xE1d do pe\u0159iny? \u{1F6CF}\uFE0F",
        options: ["\u017Dralok", "Medv\u011Bd", "Pes", "Krokod\xFDl"],
        correctIndex: 2,
        explanation: "Pes b\xFDv\xE1 mazl\xED\u010Dek \u2014 z\xE1bavn\xE1 ot\xE1zka hraje s p\u0159edstavou \u201Esp\xE1nku s kamar\xE1dem\u201C.",
        imageContextPrompt: "cozy bedroom soft blanket warm lamp"
      }
    ],
    Vesm\u00EDr: [
      {
        text: "Co by podle vtipu astronaut nejsp\xED\u0161 zapomn\u011Bl doma? \u{1F680}",
        options: ["Boty", "Kl\xED\u010De", "Helmu", "Knihu"],
        correctIndex: 1,
        explanation: "Zapomenout kl\xED\u010De je klasick\xFD gag \u2014 u astronauta je to \xFAsm\u011Bvn\xE9 nads\xE1zka.",
        imageContextPrompt: "night sky stars telescope silhouette"
      },
      {
        text: "Kter\xE1 planeta by byla nejlep\u0161\xED na piknik? \u{1F9FA}",
        options: ["Merkur", "Saturn se prstenci", "Mars", "Venu\u0161e"],
        correctIndex: 1,
        explanation: "Saturn m\xE1 \u201Ekoberec\u201C prstenc\u016F \u2014 p\u0159edstav\xEDme si piknik s v\xFDhledem (vtipn\u011B).",
        imageContextPrompt: "saturn rings artistic space illustration"
      },
      {
        text: "Co by m\u011Bl m\u011Bs\xEDc v batohu na v\xFDlet? \u{1F319}",
        options: ["Slune\u010Dn\xED br\xFDle", "K\xE1vu", "Spac\xE1k", "Lopatu"],
        correctIndex: 2,
        explanation: "M\u011Bs\xEDc \u201Esp\xED\u201C na obloze \u2014 spac\xE1k je roztomil\xE1 absurdita pro d\u011Bti.",
        imageContextPrompt: "full moon over quiet hills night"
      },
      {
        text: "Kdo je ve vesm\xEDru nejv\u011Bt\u0161\xED fanou\u0161ek hv\u011Bzd? \u2B50",
        options: ["Astronom", "Kucha\u0159", "\u0158idi\u010D", "Mal\xED\u0159"],
        correctIndex: 0,
        explanation: "Astronom pozoruje hv\u011Bzdy \u2014 jednoduch\xFD vtip se skute\u010Dn\xFDm \u0159emeslem.",
        imageContextPrompt: "observatory dome under starry sky"
      }
    ],
    Poh\u00E1dky: [
      {
        text: "Co by \u010Darod\u011Bj nejsp\xED\u0161 prom\u011Bnil v \u017E\xE1bu? \u{1F438}",
        options: ["Jablko", "Prince", "Ko\u0161\u0165\xE1t", "Hrad"],
        correctIndex: 1,
        explanation: "V poh\xE1dk\xE1ch b\xFDv\xE1 prom\u011Bna prince v \u017E\xE1bu \u2014 hrajeme na klasick\xFD motiv.",
        imageContextPrompt: "enchanted forest path misty trees"
      },
      {
        text: "Kter\xFD p\u0159edm\u011Bt nepat\u0159\xED do kouzeln\xE9 v\xFDbavy? \u2728",
        options: ["H\u016Flka", "Kouzeln\xE1 kniha", "Mobiln\xED telefon", "Lektvar"],
        correctIndex: 2,
        explanation: "Mobil je modern\xED \u2014 v poh\xE1dkov\xE9m sv\u011Bt\u011B p\u016Fsob\xED sm\u011B\u0161n\u011B a \u201Enepat\u0159\xED\u201C tam.",
        imageContextPrompt: "old spellbook candles wooden table"
      },
      {
        text: "Kdo hl\xEDd\xE1 poklad v dra\u010D\xED jeskyni? \u{1F409}",
        options: ["Ko\u010Dka", "Drak", "V\u010Dela", "\u017Delva"],
        correctIndex: 1,
        explanation: "Drak hl\xEDd\xE1 poklad \u2014 z\xE1kladn\xED poh\xE1dkov\xFD stereotyp pro z\xE1bavu.",
        imageContextPrompt: "cave entrance rocky mountain dusk"
      },
      {
        text: "Jak pozn\xE1\u0161, \u017Ee jsi v kouzeln\xE9 \u0159\xED\u0161i? \u{1F3F0}",
        options: [
          "L\xEDtaj\xED tu dorty",
          "Mluv\xED tu zv\xED\u0159ata",
          "V\u0161echno je \u0161ed\xE9",
          "Nen\xED tu hudba"
        ],
        correctIndex: 1,
        explanation: "Mluv\xEDc\xED zv\xED\u0159ata pat\u0159\xED k poh\xE1dk\xE1m \u2014 ostatn\xED volby jsou absurdn\xED.",
        imageContextPrompt: "fairytale castle on hill sunrise clouds"
      }
    ],
    Sez\u00F3nn\u00ED: [
      {
        text: "Co nejv\xEDc pat\u0159\xED k zimn\xED radosti? \u26C4",
        options: ["Koup\xE1n\xED v ledov\xE9 \u0159ece", "Sn\u011Bhul\xE1k", "\u017Dihadlo vosy", "\u017D\xE1ba"],
        correctIndex: 1,
        explanation: "Sn\u011Bhul\xE1k je symbol zimy \u2014 ostatn\xED volby jsou \xFAmysln\u011B mimo m\xEDsu.",
        imageContextPrompt: "snowy village rooftops soft snowfall"
      },
      {
        text: "Kter\xE9 ovoce \u201Ek\u0159i\u010D\xED\u201C l\xE9to? \u{1F349}",
        options: ["Jablko ze sklepa", "Meloun", "Zmrzl\xFD hr\xE1ch", "K\xE1men"],
        correctIndex: 1,
        explanation: "Meloun je letn\xED klasika \u2014 z\xE1bavn\xE1 ot\xE1zka na sez\xF3nn\xED n\xE1ladu.",
        imageContextPrompt: "picnic blanket summer park trees"
      },
      {
        text: "Co najde\u0161 na velikono\u010Dn\xEDm stole nej\u010Dast\u011Bji? \u{1F95A}",
        options: ["Klob\xE1su", "Ber\xE1nka a vaj\xED\u010Dka", "Pizza", "Pol\xE9vku"],
        correctIndex: 1,
        explanation: "Ber\xE1nek a vaj\xED\u010Dka jsou typick\xE9 \u2014 ostatn\xED jsou vtipn\xE9 odbo\u010Dky.",
        imageContextPrompt: "spring flowers branches pastel colors"
      },
      {
        text: "Kter\xE9 ro\u010Dn\xED obdob\xED m\xE1 nejlep\u0161\xED barvy list\xED? \u{1F342}",
        options: ["Zima", "Jaro", "Podzim", "L\xE9to"],
        correctIndex: 2,
        explanation: "Podzimn\xED list\xED je barevn\xE9 \u2014 jednoduch\xE1 sez\xF3nn\xED ot\xE1zka.",
        imageContextPrompt: "autumn forest path golden leaves"
      }
    ],
    Obecn\u00E9: [
      {
        text: "Kter\xFD sport by hr\xE1ly mravenci? \u{1F41C}",
        options: ["Pot\xE1p\u011Bn\xED", "\u0160ach", "Fotbal s l\xEDste\u010Dkem", "Ly\u017Eov\xE1n\xED"],
        correctIndex: 2,
        explanation: "Mravenci t\xE1hnou v\u011Bci \u2014 mini \u201Em\xED\u010D\u201C z l\xEDste\u010Dku je roztomil\xE1 absurdita.",
        imageContextPrompt: "meadow grass close up sunlight"
      },
      {
        text: "Co je nejlep\u0161\xED superpower na \xFAklid pokoje? \u{1F9F9}",
        options: ["Neviditelnost", "Teleport nepo\u0159\xE1dku pry\u010D", "\u010Cten\xED my\u0161lenek", "Let"],
        correctIndex: 1,
        explanation: "Teleport \u201Enepo\u0159\xE1dku\u201C je vtipn\xE1 fantazie \u2014 z\xE1bavn\xFD t\xF3n bez fakt\u016F.",
        imageContextPrompt: "tidy wooden desk organized shelves"
      },
      {
        text: "Kdo vyhraje sout\u011B\u017E v span\xED? \u{1F634}",
        options: ["Socha", "Ko\u010Dka", "Bzu\u010D\xEDc\xED v\u010Dela", "B\u011B\u017E\xEDc\xED k\u016F\u0148"],
        correctIndex: 1,
        explanation: "Ko\u010Dky prosluly \u0161lof\xEDky \u2014 jednoduch\xFD humor pro d\u011Bti.",
        imageContextPrompt: "sleeping cat sunny windowsill"
      },
      {
        text: "Jak\xFD dopravn\xED prost\u0159edek by pou\u017Eila \u017Eelva na sp\u011Bch? \u{1F422}",
        options: ["Raketu", "Skateboard", "Ni\u010D\xEDm, \u017Eelva nesp\u011Bch\xE1", "Ponorku"],
        correctIndex: 2,
        explanation: "\u017Delva symbolizuje klid \u2014 spr\xE1vn\xE1 odpov\u011B\u010F je humorn\xE1 pointa.",
        imageContextPrompt: "quiet country road bicycle lane trees"
      }
    ]
  },
  educational: {
    Zv\u00ED\u0159ata: [
      {
        text: "V\u011Bd\u011Bl/a jsi, \u017Ee savec, kter\xFD sn\xE1\u0161\xED vejce, je ptakopysk?",
        options: ["Ano, ptakopysk", "Ne, je to panda", "Ne, je to \u017Eralok", "Ne, je to had"],
        correctIndex: 0,
        explanation: "Ptakopysk je v\xFDjime\u010Dn\xFD savec, kter\xFD sn\xE1\u0161\xED vejce. V\u011Bd\u011Bl/a jsi, \u017Ee ml\xE1\u010Fata se l\xEDhnou z vajec a pak saj\xED ml\xE9ko jako ostatn\xED savci? Pat\u0159\xED mezi ptako\u0159itn\xED.",
        imageContextPrompt: "riverbank reeds calm water reflection"
      },
      {
        text: "Pro\u010D maj\xED n\u011Bkte\u0159\xED \u017Eivo\u010Dichov\xE9 pruhy nebo skvrny?",
        options: [
          "Aby byli vid\u011Bt z d\xE1lky",
          "Jako kamufl\xE1\u017E nebo varov\xE1n\xED",
          "Kv\u016Fli hudb\u011B",
          "Kv\u016Fli po\u010Das\xED"
        ],
        correctIndex: 1,
        explanation: "V\u011Bd\u011Bl/a jsi, \u017Ee pruhy a skvrny \u010Dasto pom\xE1haj\xED splynout s prost\u0159ed\xEDm nebo varovat pred\xE1tory? U ka\u017Ed\xE9ho druhu m\xE1 vzor jin\xFD v\xFDznam.",
        imageContextPrompt: "zebra pattern abstract texture neutral"
      },
      {
        text: "Kter\xE9 zv\xED\u0159e je typick\xFDm p\u0159\xEDkladem migrace na velk\xE9 vzd\xE1lenosti?",
        options: ["Medv\u011Bd v jeskyni", "Hn\u011Bd\xFD netop\xFDr", "Ryb\xE1k obecn\xFD (pt\xE1k)", "Pavouk dom\xE1c\xED"],
        correctIndex: 2,
        explanation: "Mnoho pt\xE1k\u016F l\xE9t\xE1 na zimu do tepl\xFDch oblast\xED. V\u011Bd\u011Bl/a jsi, \u017Ee migrace \u0161et\u0159\xED energii a zvy\u0161uje \u0161anci na p\u0159e\u017Eit\xED potomstva?",
        imageContextPrompt: "flock of birds sky migration silhouette"
      },
      {
        text: "Co znamen\xE1, \u017Ee je \u017Eivo\u010Dich \u201Eohro\u017Een\xFD druh\u201C?",
        options: [
          "\u017Dije jen v ZOO",
          "Je b\u011B\u017En\xFD v\u0161ude",
          "Hroz\xED mu vyhynut\xED ve voln\xE9 p\u0159\xEDrod\u011B",
          "Je nebezpe\u010Dn\xFD lidem"
        ],
        correctIndex: 2,
        explanation: "V\u011Bd\u011Bl/a jsi, \u017Ee ohro\u017Een\xFD druh pot\u0159ebuje ochranu prost\u0159ed\xED? \u010Casto jde o \xFAbytek biotop\u016F, lov nebo zm\u011Bny klimatu.",
        imageContextPrompt: "national park sign wooden trail nature"
      }
    ],
    Vesm\u00EDr: [
      {
        text: "V\u011Bd\u011Bl/a jsi, \u017Ee Zemi ob\xEDh\xE1 jeden p\u0159irozen\xFD satelit?",
        options: ["Mars", "M\u011Bs\xEDc", "Slunce", "Halleyova kometa"],
        correctIndex: 1,
        explanation: "M\u011Bs\xEDc ovliv\u0148uje p\u0159\xEDliv a odliv. V\u011Bd\u011Bl/a jsi, \u017Ee jeho f\xE1ze souvis\xED s t\xEDm, kolik jeho osv\u011Btlen\xE9 \u010D\xE1sti vid\xEDme ze Zem\u011B?",
        imageContextPrompt: "moon phases diagram simple educational"
      },
      {
        text: "Co je Slunce ve slune\u010Dn\xED soustav\u011B?",
        options: ["Planeta", "Hv\u011Bzda", "M\u011Bs\xEDc", "Kometka"],
        correctIndex: 1,
        explanation: "Slunce je hv\u011Bzda a zdroj energie pro \u017Eivot na Zemi. V\u011Bd\u011Bl/a jsi, \u017Ee planety ho ob\xEDhaj\xED d\xEDky gravitaci?",
        imageContextPrompt: "solar system artistic orrery soft colors"
      },
      {
        text: "Pro\u010D ve vesm\xEDru nesly\u0161\xED\u0161 v\xFDbuchy?",
        options: [
          "Proto\u017Ee je tma",
          "Proto\u017Ee zvuk pot\u0159ebuje l\xE1tku, kter\xE1 kmit\xE1",
          "Proto\u017Ee je zima",
          "Proto\u017Ee je tam v\xEDtr"
        ],
        correctIndex: 1,
        explanation: "V\u011Bd\u011Bl/a jsi, \u017Ee zvuk se \u0161\xED\u0159\xED kmit\xE1n\xEDm \u010D\xE1stic? Ve vakuu mezi hv\u011Bzdami t\xE9m\u011B\u0159 nic nekmit\xE1, tak\u017Ee zvuk nepostupuje.",
        imageContextPrompt: "silent space station window stars"
      },
      {
        text: "Co je to planeta?",
        options: [
          "Mal\xE1 hv\u011Bzda",
          "T\u011Bleso ob\xEDhaj\xEDc\xED hv\u011Bzdu, dostate\u010Dn\u011B velk\xE9 na kulovit\xFD tvar",
          "P\xE1s asteroid\u016F",
          "Mlhovina"
        ],
        correctIndex: 1,
        explanation: "Planeta ob\xEDh\xE1 hv\u011Bzdu a m\xE1 dostate\u010Dnou hmotnost na kulovit\xFD tvar. V\u011Bd\u011Bl/a jsi, \u017Ee slune\u010Dn\xED soustava m\xE1 osm planet?",
        imageContextPrompt: "planet earth from space clouds blue"
      }
    ],
    Poh\u00E1dky: [
      {
        text: "V\u011Bd\u011Bl/a jsi, \u017Ee poh\xE1dky \u010Dasto u\u010D\xED mor\xE1ln\xEDm volb\xE1m?",
        options: [
          "Ne, jsou jen o strachu",
          "Ano, ukazuj\xED d\u016Fsledek chov\xE1n\xED",
          "Ne, jsou jen o j\xEDdle",
          "Ne, jsou bez p\u0159\xEDb\u011Bhu"
        ],
        correctIndex: 1,
        explanation: "Poh\xE1dky zjednodu\u0161uj\xED sv\u011Bt, aby d\u011Bti pochopily souvislosti. V\u011Bd\u011Bl/a jsi, \u017Ee pom\xE1haj\xED pojmenovat emoce a odvahu?",
        imageContextPrompt: "open storybook pages warm light desk"
      },
      {
        text: "Co je typick\xE9 pro poh\xE1dkov\xE9ho hrdinu?",
        options: [
          "Vzd\xE1 se hned na za\u010D\xE1tku",
          "\u010Casto \u010Del\xED zkou\u0161ce a roste",
          "Nikdy nemluv\xED",
          "Nem\xE1 \u017E\xE1dn\xFD c\xEDl"
        ],
        correctIndex: 1,
        explanation: "V\u011Bd\u011Bl/a jsi, \u017Ee p\u0159\xEDb\u011Bhov\xE1 cesta hrdiny u\u010D\xED p\u0159ekon\xE1vat p\u0159ek\xE1\u017Eky? Proto maj\xED poh\xE1dky obl\xEDbenou strukturu \u201Ev\xFDzva\u2013pomoc\u2013n\xE1vrat\u201C.",
        imageContextPrompt: "mountain path sunrise journey silhouette"
      },
      {
        text: "Pro\u010D maj\xED poh\xE1dky \u010Dasto t\u0159i syny nebo t\u0159i \xFAkoly?",
        options: [
          "N\xE1hoda bez d\u016Fvodu",
          "Je to rytmus p\u0159\xEDb\u011Bhu zn\xE1m\xFD poslucha\u010D\u016Fm",
          "Kv\u016Fli matematice",
          "Kv\u016Fli po\u010Das\xED"
        ],
        correctIndex: 1,
        explanation: "V\u011Bd\u011Bl/a jsi, \u017Ee trojice je v lidov\xE9 slovesnosti stabiln\xED vzorec? Pom\xE1h\xE1 poslucha\u010Di sledovat nap\u011Bt\xED a pointu.",
        imageContextPrompt: "three stepping stones across stream forest"
      },
      {
        text: "Jak\xFD \xFA\u010Del m\u016F\u017Ee m\xEDt poh\xE1dkov\xE9 zlo?",
        options: [
          "U\u010Dit, co je nebezpe\u010Dn\xE9 nebo \u0161patn\xE9",
          "Nem\xE1 \u017E\xE1dn\xFD v\xFDznam",
          "Jen vyplnit \u010Das",
          "Zak\xE1zat span\xED"
        ],
        correctIndex: 0,
        explanation: "Poh\xE1dky \u010Dasto bezpe\u010Dn\u011B ukazuj\xED hranice. V\u011Bd\u011Bl/a jsi, \u017Ee d\u016Fle\u017Eit\xE9 je, aby d\xEDt\u011B m\u011Blo vedle p\u0159\xEDb\u011Bhu dosp\u011Blou oporu?",
        imageContextPrompt: "shadow puppet theater warm lamp"
      }
    ],
    Sez\u00F3nn\u00ED: [
      {
        text: "V\u011Bd\u011Bl/a jsi, pro\u010D na ja\u0159e \u010Dasto kvetou stromy?",
        options: [
          "Kv\u016Fli sn\u011Bhu",
          "Kv\u016Fli del\u0161\xEDmu sv\u011Btlu a teplej\u0161\xEDmu po\u010Das\xED",
          "Kv\u016Fli televizi",
          "Kv\u016Fli mo\u0159i"
        ],
        correctIndex: 1,
        explanation: "Rostliny reaguj\xED na sv\u011Btlo a teplotu. V\u011Bd\u011Bl/a jsi, \u017Ee jarn\xED kv\u011Bty p\u0159itahuj\xED opylova\u010De a pom\xE1haj\xED tvorb\u011B plod\u016F?",
        imageContextPrompt: "cherry blossoms branch blue sky"
      },
      {
        text: "Co je typick\xE9 pro zimn\xED p\u0159\xEDrodu v m\xEDrn\xE9m p\xE1smu?",
        options: [
          "V\u0161echno kvete najednou",
          "N\u011Bkter\xE1 zv\xED\u0159ata hibernuj\xED nebo m\u011Bn\xED potravu",
          "V\u0161echno zmiz\xED nav\u017Edy",
          "Stromy p\u0159estanou existovat"
        ],
        correctIndex: 1,
        explanation: "V\u011Bd\u011Bl/a jsi, \u017Ee hibernace \u0161et\u0159\xED energii? Zv\xED\u0159ata se p\u0159ipravuj\xED z\xE1sobami nebo sp\xE1nkem na obdob\xED nedostatku potravy.",
        imageContextPrompt: "snowy forest animal tracks winter"
      },
      {
        text: "Pro\u010D je l\xE9to vhodn\xE9 na r\u016Fst plodin?",
        options: [
          "Proto\u017Ee je krat\u0161\xED den",
          "Proto\u017Ee b\xFDv\xE1 v\xEDce tepla a sv\u011Btla",
          "Proto\u017Ee pr\u0161\xED m\xE9n\u011B v\u017Edy",
          "Proto\u017Ee je tma"
        ],
        correctIndex: 1,
        explanation: "V\u011Bd\u011Bl/a jsi, \u017Ee fotosynt\xE9za pot\u0159ebuje sv\u011Btlo? Teplo tak\xE9 ovliv\u0148uje metabolismus rostlin, proto farm\xE1\u0159i sleduj\xED sez\xF3nu.",
        imageContextPrompt: "wheat field golden hour countryside"
      },
      {
        text: "Co znamen\xE1 \u201Erovnodennost\u201C?",
        options: [
          "Nejdel\u0161\xED den v roce",
          "Den, kdy je den a noc zhruba stejn\u011B dlouh\xE9",
          "Za\u010D\xE1tek zimy",
          "Konec m\u011Bs\xEDce"
        ],
        correctIndex: 1,
        explanation: "V\u011Bd\u011Bl/a jsi, \u017Ee p\u0159i rovnodennosti je Slunce v ur\u010Dit\xE9 pozici vzhledem k rovn\xEDku? D\u011Bje se na ja\u0159e a na podzim.",
        imageContextPrompt: "equinox sky gradient horizon calm"
      }
    ],
    Obecn\u00E9: [
      {
        text: "V\xED\u0161, \u017Ee pitn\xE1 voda je pro t\u011Blo kl\xED\u010Dov\xE1 u\u017E od r\xE1na?",
        options: [
          "Ne, voda je jen pro rostliny",
          "Ano, pom\xE1h\xE1 hydrataci a soust\u0159ed\u011Bn\xED",
          "Ne, sta\u010D\xED jen sladk\xE9 n\xE1poje",
          "Ne, voda se nepije"
        ],
        correctIndex: 1,
        explanation: "V\u011Bd\u011Bl/a jsi, \u017Ee i m\xEDrn\xE9 odvodn\u011Bn\xED m\u016F\u017Ee zm\u011Bnit n\xE1ladu a v\xFDkon? Pravideln\xE1 voda je jednoduch\xFD zdrav\xFD n\xE1vyk.",
        imageContextPrompt: "glass of water morning light kitchen"
      },
      {
        text: "Pro\u010D je dobr\xE9 \u010D\xEDst ka\u017Ed\xFD den aspo\u0148 chvilku?",
        options: [
          "Aby se knihy nepr\xE1\u0161ily",
          "Rozv\xEDj\xED slovn\xED z\xE1sobu a p\u0159edstavivost",
          "Aby byl telefon rychlej\u0161\xED",
          "Aby pr\u0161elo"
        ],
        correctIndex: 1,
        explanation: "V\u011Bd\u011Bl/a jsi, \u017Ee \u010Dten\xED tr\xE9nuje porozum\u011Bn\xED textu a soust\u0159ed\u011Bn\xED? I kr\xE1tk\xFD \xFAsek denn\u011B d\u011Bl\xE1 velk\xFD rozd\xEDl.",
        imageContextPrompt: "child reading book cozy corner cushion"
      },
      {
        text: "Co znamen\xE1 recyklovat?",
        options: [
          "Vyhodit v\u0161e do jedn\xE9 popelnice",
          "Znovu vyu\u017E\xEDt materi\xE1ly, aby se m\xE9n\u011B pl\xFDtvalo",
          "Kupovat jen nov\xE9 v\u011Bci",
          "Skr\xFDvat odpad"
        ],
        correctIndex: 1,
        explanation: "V\u011Bd\u011Bl/a jsi, \u017Ee t\u0159\xEDd\u011Bn\xED pom\xE1h\xE1 zpracovat pap\xEDr, sklo nebo kov znovu? \u0160et\u0159\xED to suroviny i energii.",
        imageContextPrompt: "recycling bins colorful clean street"
      },
      {
        text: "Pro\u010D je sp\xE1nek d\u016Fle\u017Eit\xFD pro u\u010Den\xED?",
        options: [
          "Nen\xED d\u016Fle\u017Eit\xFD",
          "Mozek zpracov\xE1v\xE1 informace a dob\xEDj\xED energii",
          "Nahrazuje j\xEDdlo",
          "Zastav\xED r\u016Fst"
        ],
        correctIndex: 1,
        explanation: "V\u011Bd\u011Bl/a jsi, \u017Ee b\u011Bhem sp\xE1nku prob\xEDh\xE1 upev\u0148ov\xE1n\xED vzpom\xEDnek? Pravideln\xFD re\u017Eim pom\xE1h\xE1 pam\u011Bti i n\xE1lad\u011B.",
        imageContextPrompt: "bedroom moonlight soft pillow calm"
      }
    ]
  },
  knowledge: {
    Zv\u00ED\u0159ata: [
      {
        text: "Kter\xFD savec sn\xE1\u0161\xED vejce?",
        options: ["Panda", "Ptakopysk", "Netop\xFDr", "Vlk"],
        correctIndex: 1,
        explanation: "Ptakopysk je v\xFDjime\u010Dn\xFD savec, kter\xFD sn\xE1\u0161\xED vejce a pat\u0159\xED mezi ptako\u0159itn\xE9.",
        imageContextPrompt: "river otter like mammal habitat rocks"
      },
      {
        text: "Kolik nohou m\xE1 hmyz typicky?",
        options: ["\u010Cty\u0159i", "\u0160est", "Osm", "Dv\u011B"],
        correctIndex: 1,
        explanation: "Hmyz m\xE1 obvykle t\u0159i p\xE1ry nohou, tedy \u0161est.",
        imageContextPrompt: "meadow insect on leaf macro nature"
      },
      {
        text: "Kter\xE9 zv\xED\u0159e je pl\u017E?",
        options: ["Hmyz", "Slim\xE1k", "Ryba", "Pt\xE1k"],
        correctIndex: 1,
        explanation: "Slim\xE1k je m\u011Bkk\xFD\u0161 bez ulity (\u0161nek m\xE1 ulitu).",
        imageContextPrompt: "garden snail shell damp soil"
      },
      {
        text: "Kdo je pred\xE1tor v potravn\xEDm \u0159et\u011Bzci?",
        options: ["Rostlina", "Li\u0161ka", "List", "Houba jako v\xFDhradn\u011B producent"],
        correctIndex: 1,
        explanation: "Li\u0161ka lov\xED ko\u0159ist, pat\u0159\xED mezi pred\xE1tory.",
        imageContextPrompt: "forest clearing fox distant trees"
      }
    ],
    Vesm\u00EDr: [
      {
        text: "Kter\xE1 planeta je nejbli\u017E\u0161\xED Slunci?",
        options: ["Venu\u0161e", "Merkur", "Mars", "Zem\u011B"],
        correctIndex: 1,
        explanation: "Merkur je prvn\xED planeta od Slunce ve slune\u010Dn\xED soustav\u011B.",
        imageContextPrompt: "mercury planet surface illustration"
      },
      {
        text: "Co ob\xEDh\xE1 Zemi?",
        options: ["Slunce", "M\u011Bs\xEDc", "Mars", "Saturn"],
        correctIndex: 1,
        explanation: "M\u011Bs\xEDc je p\u0159irozen\xE1 dru\u017Eice Zem\u011B.",
        imageContextPrompt: "moon crater surface telescope view"
      },
      {
        text: "Jak se jmenuje na\u0161e galaxie?",
        options: ["Andromeda", "Ml\xE9\u010Dn\xE1 dr\xE1ha", "Troj\xFAheln\xEDk", "Velk\xFD v\u016Fz"],
        correctIndex: 1,
        explanation: "Slune\u010Dn\xED soustava je sou\u010D\xE1st\xED galaxie Ml\xE9\u010Dn\xE1 dr\xE1ha.",
        imageContextPrompt: "milky way band night sky stars"
      },
      {
        text: "Co je hv\u011Bzda Slunce pro Zemi?",
        options: ["M\u011Bs\xEDc", "Zdroj sv\u011Btla a energie", "Kometka", "Mlhovina"],
        correctIndex: 1,
        explanation: "Slunce je hv\u011Bzda, kter\xE1 dod\xE1v\xE1 Zemi sv\u011Btlo a teplo.",
        imageContextPrompt: "sun rays through clouds sky"
      }
    ],
    Poh\u00E1dky: [
      {
        text: "Kdo napsal knihu o Pinocchiovi?",
        options: ["Carlo Collodi", "Charles Dickens", "Hans Christian Andersen", "Grimmov\xE9"],
        correctIndex: 0,
        explanation: "Pinocchia proslavil ital Carlo Collodi.",
        imageContextPrompt: "wooden marionette workshop tools"
      },
      {
        text: "Ve kter\xE9 poh\xE1dce je Sn\u011Bhurka?",
        options: ["O \u0161\xEDpkov\xE9 R\u016F\u017Eence", "O Sn\u011Bhurce", "O Popelce", "O Jen\xED\u010Dkovi a Ma\u0159ence"],
        correctIndex: 1,
        explanation: "Sn\u011Bhurka je postava z klasick\xE9 poh\xE1dky brat\u0159\xED Grimm\u016F.",
        imageContextPrompt: "forest cottage seven small doors fairytale"
      },
      {
        text: "Kdo napsal Mal\xE9ho prince?",
        options: ["Antoine de Saint-Exup\xE9ry", "Jules Verne", "Mark Twain", "Agatha Christie"],
        correctIndex: 0,
        explanation: "Mal\xE9ho prince napsal Antoine de Saint-Exup\xE9ry.",
        imageContextPrompt: "desert horizon single star evening"
      },
      {
        text: "Kter\xE1 poh\xE1dka obsahuje kouzeln\xE9 fazolky a ob\u0159\xED stopu?",
        options: ["Jack a fazolov\xFD stonek", "Popelka", "\u010Cerven\xE1 Karkulka", "O \u0159ep\u011B"],
        correctIndex: 0,
        explanation: "P\u0159\xEDb\u011Bh Jacka a fazolov\xE9ho stonku pracuje s obrem a fazolkami.",
        imageContextPrompt: "giant beanstalk clouds castle above"
      }
    ],
    Sez\u00F3nn\u00ED: [
      {
        text: "Kter\xE9 ro\u010Dn\xED obdob\xED n\xE1sleduje po zim\u011B?",
        options: ["Podzim", "Jaro", "L\xE9to", "Zima znovu"],
        correctIndex: 1,
        explanation: "Po zim\u011B p\u0159ich\xE1z\xED jaro.",
        imageContextPrompt: "snow melting creek buds spring"
      },
      {
        text: "V kter\xE9m ro\u010Dn\xEDm obdob\xED b\xFDv\xE1 v \u010Cesku nejdel\u0161\xED den?",
        options: ["Zima", "Jaro", "L\xE9to", "Podzim"],
        correctIndex: 2,
        explanation: "Letn\xED slunovrat p\u0159in\xE1\u0161\xED nejdel\u0161\xED den v roce.",
        imageContextPrompt: "summer solstice field long shadows"
      },
      {
        text: "Jak se jmenuje sv\xE1tek v\xE1no\u010Dn\xEDch tradic v prosinci?",
        options: ["Velikonoce", "V\xE1noce", "Du\u0161i\u010Dky", "Masopust"],
        correctIndex: 1,
        explanation: "V\xE1noce se slav\xED v prosinci (24.\u201325. u mnoha rodin).",
        imageContextPrompt: "winter window candles evergreen branches"
      },
      {
        text: "Kter\xE9 ro\u010Dn\xED obdob\xED je typick\xE9 pro sklize\u0148 obil\xED v \u010Cesku?",
        options: ["Zima", "Jaro", "L\xE9to", "Podzim"],
        correctIndex: 2,
        explanation: "Hlavn\xED skliz\u0148ov\xE9 pr\xE1ce \u010Dasto vrchol\xED v l\xE9t\u011B podle plodiny.",
        imageContextPrompt: "harvest tractor golden field summer"
      }
    ],
    Obecn\u00E9: [
      {
        text: "Hlavn\xED m\u011Bsto \u010Cesk\xE9 republiky je:",
        options: ["Brno", "Praha", "Ostrava", "Plze\u0148"],
        correctIndex: 1,
        explanation: "Hlavn\xED m\u011Bsto \u010Ceska je Praha.",
        imageContextPrompt: "prague skyline silhouette river evening"
      },
      {
        text: "Kolik je 7 + 8?",
        options: ["14", "15", "16", "13"],
        correctIndex: 1,
        explanation: "Sou\u010Det 7 a 8 je 15.",
        imageContextPrompt: "school notebook numbers doodle calm"
      },
      {
        text: "Kter\xE1 kapalina je p\u0159i pokojov\xE9 teplot\u011B rtu\u0165?",
        options: ["Voda", "Olej", "Rtu\u0165", "P\xEDsek"],
        correctIndex: 2,
        explanation: "Rtu\u0165 je kov tekut\xFD za b\u011B\u017En\xE9 pokojov\xE9 teploty.",
        imageContextPrompt: "laboratory glassware neutral background"
      },
      {
        text: "Kter\xFD kontinent je nejv\u011Bt\u0161\xED?",
        options: ["Afrika", "Asie", "Evropa", "Antarktida"],
        correctIndex: 1,
        explanation: "Nejv\u011Bt\u0161\xED kontinent je Asie.",
        imageContextPrompt: "world map continents muted colors"
      }
    ]
  }
};
var THEME_TO_BUCKET = {
  kid_animals: "Zv\xED\u0159ata",
  kid_space_dinosaurs: "Vesm\xEDr",
  kid_fairy_tales_magic: "Poh\xE1dky",
  kid_seasonal: "Sez\xF3nn\xED",
  jr_nature_science: "Zv\xED\u0159ata",
  jr_gaming_tech: "Obecn\xE9",
  jr_pop_culture: "Obecn\xE9",
  jr_fake_news_myths: "Obecn\xE9",
  ad_general: "Obecn\xE9",
  ad_travel_geography: "Obecn\xE9",
  ad_history_culture: "Poh\xE1dky",
  ad_science_tech: "Vesm\xEDr",
  sr_retro_6080: "Sez\xF3nn\xED",
  sr_golden_czech_hands: "Obecn\xE9",
  sr_nature_herbs: "Zv\xED\u0159ata",
  sr_history_local: "Obecn\xE9"
};
function shuffleQuestionOptions(question) {
  const tagged = question.options.map((text, i) => ({
    text,
    correct: i === question.correctAnswerIndex
  }));
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tagged[i], tagged[j]] = [tagged[j], tagged[i]];
  }
  const correctAnswerIndex = tagged.findIndex((t) => t.correct);
  return {
    ...question,
    options: tagged.map((t) => t.text),
    correctAnswerIndex
  };
}
function pickThreeFromFour(item) {
  const opts = item.options;
  const c = item.correctIndex;
  const correctText = opts[c];
  const wrongIx = [0, 1, 2, 3].filter((i) => i !== c);
  const shuffledWrong = shuffleArray([...wrongIx]);
  const w1 = opts[shuffledWrong[0]];
  const w2 = opts[shuffledWrong[1]];
  const triple = shuffleArray([correctText, w1, w2]);
  const correctIndex = triple.indexOf(correctText);
  return { options: triple, correctIndex };
}
function itemToQuestion(item, index, optionCount) {
  if (optionCount === 3) {
    const { options, correctIndex } = pickThreeFromFour(item);
    const q2 = {
      id: `q${index + 1}`,
      questionText: item.text,
      options,
      correctAnswerIndex: correctIndex,
      explanation: item.explanation,
      imageContextPrompt: item.imageContextPrompt
    };
    return shuffleQuestionOptions(q2);
  }
  const q = {
    id: `q${index + 1}`,
    questionText: item.text,
    options: [...item.options],
    correctAnswerIndex: item.correctIndex,
    explanation: item.explanation,
    imageContextPrompt: item.imageContextPrompt
  };
  return shuffleQuestionOptions(q);
}
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function buildFallbackQuiz(config2, questionCount) {
  const cat = config2.category;
  if (cat !== "fun" && cat !== "educational" && cat !== "knowledge") {
    throw new Error("Fallback kv\xEDz je dostupn\xFD jen pro kategorie fun, educational a knowledge.");
  }
  const buckets = CATEGORY_FALLBACKS[cat];
  const bucketKey = config2.theme === "random" || config2.theme === "custom" ? "Obecn\xE9" : THEME_TO_BUCKET[config2.theme] ?? "Obecn\xE9";
  const primary = buckets[bucketKey] ?? buckets.Obecn\u00E9;
  const merged = bucketKey === "Obecn\xE9" ? [...primary] : [...primary, ...buckets.Obecn\u00E9];
  let pool = shuffleArray(merged);
  if (pool.length === 0) {
    throw new Error("Chyb\xED fallback ot\xE1zky pro zvolenou kategorii.");
  }
  const picked = [];
  for (let i = 0; i < questionCount; i++) {
    picked.push(pool[i % pool.length]);
  }
  const label = THEME_LABEL_CS[config2.theme];
  const title = config2.theme === "custom" && config2.customThemeText.trim() ? `${config2.customThemeText.trim().slice(0, 48)} (z\xE1lo\u017En\xED kv\xEDz)` : `${label} \u2014 z\xE1lo\u017En\xED kv\xEDz`;
  const optionCount = quizOptionCountForConfig(config2);
  const questions = picked.map(
    (item, i) => itemToQuestion(item, i, optionCount)
  );
  return { title, questions };
}

// src/lib/competitiveScoring.ts
function competitiveLimitRangeForGroup(group) {
  switch (group) {
    case "adults":
      return { min: 8, max: 10 };
    case "seniors":
      return { min: 20, max: 45 };
    case "juniors":
      return { min: 10, max: 15 };
    case "kids":
    default:
      return { min: 10, max: 12 };
  }
}
function defaultCompetitiveLimitForGroup(group) {
  switch (group) {
    case "adults":
      return 9;
    case "seniors":
      return 25;
    case "juniors":
      return 12;
    case "kids":
    default:
      return 12;
  }
}
function clampCompetitiveTimeLimitSeconds(raw, targetGroup = "juniors") {
  const { min, max } = competitiveLimitRangeForGroup(targetGroup);
  const def = defaultCompetitiveLimitForGroup(targetGroup);
  const n = raw === void 0 || !Number.isFinite(raw) ? def : Math.round(raw);
  return Math.min(max, Math.max(min, n));
}

// src/lib/quizLength.ts
var QUESTION_COUNT_BY_LENGTH = {
  short: 15,
  medium: 25,
  long: 35
};
function getQuestionCount(length) {
  return QUESTION_COUNT_BY_LENGTH[length];
}

// src/services/promptBuilder.ts
var WEB_INSPIRATION = {
  kids: "INSPIRACE OBSAHEM A T\xD3NEM (nevytv\xE1\u0159ej ot\xE1zky o t\u011Bchto webech jako takov\xE9; jen \xFArove\u0148 a styl): \u010CT D\xE9\u010Dko, Al\xEDk.cz, Rumvi a podobn\xE9 bezpe\u010Dn\xE9 d\u011Btsk\xE9 port\xE1ly. Hrav\xFD jasn\xFD jazyk, v\u011Bk zhruba 6 a\u017E 10 let.",
  juniors: "INSPIRACE: YouTube/TikTok (kulturn\u011B vhodn\xE9), hern\xED novinky, Kahoot, streamovac\xED sc\xE9na. Svi\u017En\xFD t\xF3n teenagera, ale bez nebezpe\u010Dn\xFDch v\xFDzev a vulg\xE1rn\xEDch mem\u016F.",
  adults: "INSPIRACE: zpravodajsk\xE9 a magaz\xEDnov\xE9 weby (nap\u0159. Novinky, iDNES), hobby port\xE1ly, hospodsk\xFD kv\xEDz, CSFD/Kinobox u popkultury. Dosp\u011Bl\xFD neutr\xE1ln\xED a\u017E m\xEDrn\u011B vt\xEDpk\xE1\u0159sk\xFD t\xF3n.",
  seniors: "INSPIRACE: \u010Cesk\xFD rozhlas (Plus, Dvojka), region\xE1ln\xED zpravodajstv\xED, t\xE9mata zahrady, zvyky, pam\u011Bti na ml\xE1d\xED. Klidn\xFD, respektuj\xEDc\xED t\xF3n bez modern\xEDho slangu."
};
function buildHandicapRulesBlock(handicaps) {
  const ids = handicaps.filter((h) => h !== "none");
  if (ids.length === 0) return "";
  const text = getAccessibilityPromptRules(ids);
  return text.trim().length > 0 ? text : "";
}
function buildQuestionFormatBlock(config2) {
  const { targetGroup, category } = config2;
  if (targetGroup === "kids") {
    if (category === "fun") {
      return `FORM\xC1T OT\xC1ZEK: Pou\u017E\xEDvej v\xFDhradn\u011B h\xE1danky ('Kdo jsem?'), logick\xE9 hry ('Co nepat\u0159\xED do party?') a vtipn\xE9 absurdn\xED situace (nap\u0159. zv\xED\u0159ata, kter\xE1 d\u011Blaj\xED lidsk\xE9 v\u011Bci).`;
    }
    if (category === "educational") {
      return `FORM\xC1T OT\xC1ZEK: Zam\u011B\u0159 se na objevov\xE1n\xED sv\u011Bta. Ot\xE1zky typu 'V\xED\u0161, \u017Ee...?'. Do pole 'explanation' napi\u0161 velmi zaj\xEDmav\xE9 a d\u011Btem srozumiteln\xE9 vysv\u011Btlen\xED.`;
    }
    if (category === "knowledge") {
      return `FORM\xC1T OT\xC1ZEK: Jednoduch\xE9 testov\xE1n\xED z\xE1kladn\xEDch znalost\xED (p\u0159\xEDroda, barvy, ro\u010Dn\xED obdob\xED, zv\xED\u0159ata). P\u0159\xEDm\xE9 a jasn\xE9 ot\xE1zky.`;
    }
  }
  if (targetGroup === "juniors") {
    if (category === "competitive") {
      return `FORM\xC1T OT\xC1ZEK: Extr\xE9mn\u011B dynamick\xFD Kahoot styl. Ot\xE1zky mus\xED b\xFDt \xFAdern\xE9, stru\u010Dn\xE9 a t\xFDkat se modern\xEDho sv\u011Bta (technologie, gaming, vir\xE1ln\xED trendy, z\xE1ludnosti ze \u0161koly). Nespr\xE1vn\xE9 odpov\u011Bdi mus\xED b\xFDt 'chyt\xE1ky', kter\xE9 otestuj\xED pozornost hr\xE1\u010De. Zvy\u0161 pocit \u010Dasov\xE9ho tlaku a sout\u011B\u017Eivosti.`;
    }
    if (category === "fun") {
      return `FORM\xC1T OT\xC1ZEK: Bizarn\xED fakta z internetu, popkultura, gaming a ot\xE1zky typu 'Pravda, nebo Fake News'.`;
    }
    if (category === "educational") {
      return `FORM\xC1T OT\xC1ZEK: Propojen\xED u\u010Diva 2. stupn\u011B Z\u0160 s re\xE1ln\xFDm sv\u011Btem. Nap\u0159. 'Co by se stalo, kdyby...' (testov\xE1n\xED logiky). Vysv\u011Btlen\xED mus\xED b\xFDt detailn\xED.`;
    }
    if (category === "knowledge") {
      return `FORM\xC1T OT\xC1ZEK: Klasick\xE9 kv\xEDzov\xE9 ot\xE1zky p\u0159im\u011B\u0159en\xE9 v\u011Bku, ale s modern\xEDm n\xE1dechem.`;
    }
  }
  if (targetGroup === "adults") {
    if (category === "competitive") {
      return `FORM\xC1T OT\xC1ZEK: Fin\xE1le drsn\xE9ho hospodsk\xE9ho kv\xEDzu. T\u011B\u017Ek\xE9, komplexn\xED ot\xE1zky, kde v\u0161echny 4 mo\u017Enosti vypadaj\xED velmi pravd\u011Bpodobn\u011B. Odpov\u011Bdi mohou b\xFDt zalo\u017Een\xE9 na drobn\xFDch detailech. O\u010Dek\xE1vej vysok\xFD stres a sout\u011B\u017Eivost mezi hr\xE1\u010Di. Do pole 'explanation' p\u0159idej u\u0161t\u011Bpa\u010Dn\xFD nebo m\xEDrn\u011B ironick\xFD koment\xE1\u0159 pro ty, co odpov\u011Bd\u011Bli \u0161patn\u011B.`;
    }
    if (category === "fun") {
      return `FORM\xC1T OT\xC1ZEK: Hospodsk\xFD kv\xEDz. Chyt\xE1ky, absurdn\xED fakta z historie a ot\xE1zky, kde prvn\xED instinkt je v\u011Bt\u0161inou \u0161patn\xFD.`;
    }
    if (category === "knowledge" || category === "educational") {
      return `FORM\xC1T OT\xC1ZEK: T\u011B\u017Ek\xE9 ot\xE1zky, hled\xE1n\xED souvislost\xED ('Spojova\u010Dka'), p\u0159esn\xE1 historick\xE1 nebo v\u011Bdeck\xE1 fakta.`;
    }
  }
  if (targetGroup === "seniors") {
    if (category === "competitive") {
      return `FORM\xC1T OT\xC1ZEK: Klidn\xFD sout\u011B\u017En\xED kv\xEDz ve stylu televizn\xED sout\u011B\u017Ee (bez n\xE1tlakov\xFDch v\xFDzev typu \u201ERychle!\u201C). V\u011Bcn\xE1 n\xE1ro\u010Dnost jako u dosp\u011Bl\xFDch, ale bez modern\xEDch m\xE9di\xED a bez mem\u016F. Ot\xE1zky d\u016Fstojn\xE9; d\xE9lku kola bere \u010Dasova\u010D v zad\xE1n\xED (del\u0161\xED ne\u017E u junior\u016F).`;
    }
    if (category === "knowledge") {
      return `FORM\xC1T OT\xC1ZEK: Respektuj\xEDc\xED v\u011Bdomostn\xED test ve stylu po\u0159adu AZ Kv\xEDz. Zam\u011B\u0159 se na 'krystalizovanou inteligenci': \u010Deskoslovensk\xE1 historie 20. stolet\xED, zem\u011Bpis, klasick\xE1 literatura a v\xFDznamn\xE9 osobnosti. Ot\xE1zky mus\xED b\xFDt d\u016Fstojn\xE9 a bez chyt\xE1k\u016F.`;
    }
    if (category === "fun") {
      return `FORM\xC1T OT\xC1ZEK: Nostalgie a spole\u010Dn\xE9 vzpom\xEDn\xE1n\xED. Vytv\xE1\u0159ej ot\xE1zky typu 'Stroj \u010Dasu' (ceny zbo\u017E\xED a ka\u017Edodenn\xED \u017Eivot v letech 1960 a\u017E 1980), dopl\u0148ov\xE1n\xED text\u016F zn\xE1m\xFDch lidov\xFDch nebo popul\xE1rn\xEDch p\xEDsn\xED z t\xE9 doby a dopl\u0148ov\xE1n\xED \u010Desk\xFDch p\u0159\xEDslov\xED.`;
    }
    if (category === "educational") {
      return `FORM\xC1T OT\xC1ZEK: Pojmi to jako jemn\xFD tr\xE9nink pam\u011Bti a objevov\xE1n\xED. T\xE9mata jako p\u0159\xEDroda, bylink\xE1\u0159stv\xED, tradi\u010Dn\xED recepty z babi\u010D\u010Diny kucha\u0159ky nebo star\xE1 \u0159emesla. Do pole 'explanation' napi\u0161 velmi laskav\xE9 a zaj\xEDmav\xE9 dopln\u011Bn\xED kontextu k dan\xE9 v\u011Bci.`;
    }
  }
  return "";
}
var IMAGE_CONTEXT_RULES_CS = `PRAVIDLO PRO OBR\xC1ZKY (KRITICK\xC9):
Pro ka\u017Edou ot\xE1zku vygeneruj do pole 'imageContextPrompt' textov\xFD popis obr\xE1zku (v angli\u010Dtin\u011B, max 5 a\u017E 8 slov). 
Tento obr\xE1zek MUS\xCD navodit atmosf\xE9ru ot\xE1zky, ale ABSOLUTN\u011A NESM\xCD obsahovat nebo nazna\u010Dovat spr\xE1vnou odpov\u011B\u010F!
P\u0159\xEDklad 1: Pokud je ot\xE1zka 'Kdo napsal Babi\u010Dku?', imageContextPrompt bude: 'old rustic spinning wheel in a wooden cottage' (NE portr\xE9t spisovatelky).
P\u0159\xEDklad 2: Pokud je ot\xE1zka 'Kter\xE9 zv\xED\u0159e m\xE1 pruhy?', imageContextPrompt bude: 'african savanna landscape at sunset' (NE zebra).
Obr\xE1zek mus\xED ilustrovat 'm\xEDsto' nebo 'n\xE1stroj' souvisej\xEDc\xED s t\xE9matem, nikdy ne samotn\xFD p\u0159edm\u011Bt ot\xE1zky.`;
var FACTUAL_ACCURACY_RULES_CS = `PRAVIDLA FAKTICK\xC9 P\u0158ESNOSTI (KRITICK\xC9):
- Generuj pouze tvrzen\xED, u kter\xFDch jsi si jist\xFD: b\u011B\u017En\u011B ov\u011B\u0159iteln\xE1 fakta (zn\xE1m\xE1 d\xEDla, osobnosti, hrub\xE9 souvislosti). Nevym\xFD\u0161lej konkr\xE9tn\xED roky, d\xEDl\u010D\xED epizody, vedlej\u0161\xED postavy ani detaily, pokud si nejsi jist\xFD.
- Pokud si nejsi jist\xFD p\u0159esn\xFDm \xFAdajem, zjednodu\u0161 ot\xE1zku na obecn\u011B platn\xFD a jednozna\u010Dn\xFD fakt, nebo ji p\u0159eformuluj. Rad\u011Bji obecn\u011Bji ne\u017E chybn\u011B konkr\xE9tn\u011B.
- Nespr\xE1vn\xE9 mo\u017Enosti (distraktory) mus\xED b\xFDt zjevn\u011B chybn\xE9 nebo jednozna\u010Dn\u011B odli\u0161n\xE9 od spr\xE1vn\xE9 odpov\u011Bdi; nepou\u017E\xEDvej dal\u0161\xED \u201Epravd\u011Bpodobn\xE9\u201C vymy\u0161len\xE9 varianty, kter\xE9 by mohly b\xFDt klamav\u011B spr\xE1vn\xE9.
- Do pole 'explanation' v\u017Edy stru\u010Dn\u011B dopl\u0148 kontext podporuj\xEDc\xED spr\xE1vnou odpov\u011B\u010F (nap\u0159. n\xE1zev d\xEDla, obdob\xED); nep\u0159id\xE1vej smy\u0161len\xE9 detaily ani nejist\xE1 tvrzen\xED.`;
var CUSTOM_THEME_FACTUAL_ADDON_CS = `DODATEK PRO VLASTN\xCD T\xC9MA: T\xE9ma je u\u017Eivatelsky zvolen\xE9 a m\u016F\u017Ee b\xFDt \xFAzk\xE9 nebo odborn\xE9 (nap\u0159. \xE9ra, \u017E\xE1nr, region\xE1ln\xED kultura, star\u0161\xED \u010Desk\xFD film). Dr\u017E se nejzn\xE1m\u011Bj\u0161\xEDch a nejdokumentovan\u011Bj\u0161\xEDch fakt\u016F z dan\xE9ho oboru. Vyhni se obskurn\xEDm titul\u016Fm a z\xE1ludnostem z okraje znalost\xED. U kinematografie, literatury a historie preferuj etablovan\xE9 klasiky a v\u0161eobecn\u011B sd\xEDlen\xE9 re\xE1lie.`;
function sanitizeCustomThemeForPrompt(raw) {
  return raw.trim().slice(0, 500).replace(/'/g, "\u2019").replace(/\s+/g, " ");
}
function buildThemeInstructionBlock(config2) {
  if (config2.theme === "random") {
    return `T\xC9MA: Zvol zcela n\xE1hodn\xE9, fascinuj\xEDc\xED a netradi\u010Dn\xED t\xE9ma, kter\xE9 bude perfektn\u011B sed\u011Bt pro c\xEDlovou skupinu. N\xE1zev kv\xEDzu mus\xED toto t\xE9ma vystihovat.`;
  }
  if (config2.theme === "custom") {
    const t = sanitizeCustomThemeForPrompt(config2.customThemeText);
    return `T\xC9MA: Kv\xEDz se mus\xED striktn\u011B a do hloubky t\xFDkat tohoto vlastn\xEDho t\xE9matu: '${t}'.

${CUSTOM_THEME_FACTUAL_ADDON_CS}`;
  }
  return `T\xC9MA: Zam\u011B\u0159 se na specifickou oblast: ${THEME_LABEL_CS[config2.theme]}.`;
}
function buildWebInspirationBlock(config2) {
  const base = WEB_INSPIRATION[config2.targetGroup];
  const h = new Set(config2.handicaps.filter((x) => x !== "none"));
  const extra = [base];
  if (h.has("dyslexia")) {
    extra.push(
      "Dopl\u0148uj\xEDc\xED styl: jazyk jako v p\u0159\xEDstupn\xFDch \u010Dl\xE1nc\xEDch pro \u0161irok\xE9 publikum, kr\xE1tk\xE9 odstavce my\u0161lenkov\u011B, jednoduch\xE1 souv\u011Bt\xED."
    );
  }
  return "=== INSPIRACE RE\xC1LN\xDDMI WEBY A M\xC9DII (jen t\xF3n a t\xE9mata) ===\n\n" + extra.join("\n\n");
}
function buildPersonaBlock(config2) {
  const { targetGroup, category } = config2;
  if (targetGroup === "kids" && category === "fun") {
    return `TVOJE ROLE: Z\xE1bavn\xFD moder\xE1tor d\u011Btsk\xE9ho po\u0159adu ve stylu \u010CT D\xE9\u010Dko nebo Al\xEDk.cz. STYL: Hrav\xFD humor, zv\xED\u0159\xE1tka, poh\xE1dky, absurdn\xED ale ne d\u011Bsiv\xE9 situace. Z\xC1KAZ: such\xE1 encyklopedick\xE1 fakta bez p\u0159\xEDb\u011Bhu. Mo\u017Enosti odpov\u011Bd\xED a\u0165 d\xE1vaj\xED smysl d\xEDt\u011Bti a bav\xED.`;
  }
  if (targetGroup === "kids" && category === "educational") {
    return `TVOJE ROLE: U\u010Ditel/ka 1. stupn\u011B Z\u0160, vl\xEDdn\u011B a trp\u011Bliv\u011B jako ve v\xFDukov\xFDch bloc\xEDch na D\xE9\u010Dku nebo Rumvi. STYL: Nau\u010Dn\xE9, ale v\u017Edy s jednoduch\xFDm p\u0159\xEDkladem nebo p\u0159irovn\xE1n\xEDm z d\u011Btsk\xE9ho sv\u011Bta. \u017D\xE1dn\xE9 odborn\xE9 term\xEDny bez vysv\u011Btlen\xED.`;
  }
  if (targetGroup === "kids" && category === "knowledge") {
    return `TVOJE ROLE: Tv\u016Frce d\u011Btsk\xE9ho v\u011Bdomostn\xEDho kv\xEDzu (6 a\u017E 10 let). STYL: Konkr\xE9tn\xED ot\xE1zky ze \u017Eivota zv\xED\u0159at, p\u0159\xEDrody, sv\xE1tk\u016F, sportu pro d\u011Bti. Obt\xED\u017Enost v\u017Edy \xFAm\u011Brn\xE1 v\u011Bku, \u017E\xE1dn\xE9 re\xE1lie z politiky \u010Di finan\u010Dn\xEDch produkt\u016F.`;
  }
  if (targetGroup === "juniors" && category === "competitive") {
    return `TVOJE ROLE: Tv\u016Frce rychl\xFDch viralov\xFDch v\xFDzev ve stylu Kahoot a Hern\xEDch kan\xE1l\u016F. STYL: \xDAdern\xE9 v\u011Bty, gaming, filmy, seri\xE1ly, sporty. Lehk\xE1 ironie je v po\u0159\xE1dku, obsah mus\xED z\u016Fstat slu\u0161n\xFD.`;
  }
  if (targetGroup === "juniors") {
    return `TVOJE ROLE: Moder\xE1tor kv\xEDzu pro teenagery (cca 12 a\u017E 16 let). STYL: Srozumiteln\xFD, \u017Eiv\xFD, m\u016F\u017Ee\u0161 ob\u010Das nar\xE1\u017Eet na \u0161kolu, sporty, technologie a popkulturu v m\xED\u0159e vhodn\xE9 pro ml\xE1de\u017E.`;
  }
  if (targetGroup === "adults" && (category === "fun" || category === "competitive")) {
    return `TVOJE ROLE: Moder\xE1tor hospodsk\xE9ho kv\xEDzu nebo sout\u011B\u017En\xEDho po\u0159adu. STYL: Chyt\xE1ky a zaj\xEDmav\xE1 fakta, m\xEDrn\xE1 ironie, propojen\xED historie a popkultury.`;
  }
  if (targetGroup === "seniors" && (category === "knowledge" || category === "educational")) {
    return `TVOJE ROLE: Moder\xE1tor v\u011Bdomostn\xED sout\u011B\u017Ee ve stylu klasick\xE9ho TV kv\xEDzu. STYL: Zdvo\u0159il\xFD, srozumiteln\xFD, \u010Dasto t\xE9ma \u010Desk\xFDch vlast\xED, p\u0159\xEDrody, kultury minul\xFDch dek\xE1d. Z\xC1KAZ: Modern\xED anglick\xFD slang a n\xE1hodn\xE9 anglicismy.`;
  }
  if (targetGroup === "seniors" && category === "competitive") {
    return `TVOJE ROLE: Moder\xE1tor klidn\xE9 televizn\xED sout\u011B\u017Ee pro seniory. STYL: D\u016Fstojn\xFD, bez sp\u011Bchu v textu ot\xE1zky, stejn\xE1 v\u011Bcn\xE1 n\xE1ro\u010Dnost jako u dosp\u011Bl\xFDch, ale bez odkaz\u016F na modern\xED technologie a sou\u010Dasnou popkulturu po roce 2000. \u017D\xE1dn\xE9 agresivn\xED slogany.`;
  }
  if (targetGroup === "seniors") {
    return `TVOJE ROLE: Moder\xE1tor pro seniory. STYL: Klidn\u011B, jasn\u011B, dost \u010Dasu v textu (del\u0161\xED v\u011Bty jsou v po\u0159\xE1dku, ale jedna my\u0161lenka najednou). Konkr\xE9tn\xED kontext m\xEDsto abstrakce.`;
  }
  return `TVOJE ROLE: Profesion\xE1ln\xED moder\xE1tor znalostn\xEDho kv\xEDzu v \u010De\u0161tin\u011B. P\u0159izp\u016Fsob t\xF3n a obt\xED\u017Enost: c\xEDlov\xE1 skupina = ${targetGroup}, zam\u011B\u0159en\xED kv\xEDzu = ${category}. Bu\u010F srozumiteln\xFD a fakticky p\u0159esn\xFD.`;
}
function buildPromptEnrichment(config2) {
  const parts = [
    "=== T\xD3N, PERSONA A \xDAROVE\u0147 ===\n\n" + buildPersonaBlock(config2)
  ];
  const questionFormatBlock = buildQuestionFormatBlock(config2);
  if (questionFormatBlock) {
    parts.push(
      "=== FORM\xC1T OT\xC1ZEK (STRUKTURA A TYP OTAZEK) ===\n\n" + questionFormatBlock
    );
  }
  parts.push(
    "=== PRAVIDLO PRO OBR\xC1ZKY ===\n\n" + IMAGE_CONTEXT_RULES_CS
  );
  parts.push(
    "=== FAKTICK\xC1 P\u0158ESNOST ===\n\n" + FACTUAL_ACCURACY_RULES_CS
  );
  parts.push(
    "=== T\xC9MA (OBSAHOV\xDD Z\xC1M\u011AR) ===\n\n" + buildThemeInstructionBlock(config2)
  );
  const handicapBlock = buildHandicapRulesBlock(config2.handicaps);
  if (handicapBlock) {
    parts.push("=== PRAVIDLA P\u0158\xCDSTUPNOSTI (OBSAH OTAZEK) ===\n\n" + handicapBlock);
  }
  parts.push(buildWebInspirationBlock(config2));
  return parts.join("\n\n");
}

// src/lib/quizValidation.ts
var EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u2600-\u26FF\u2700-\u27BF]/u;
function questionTextBlob(q) {
  return `${q.questionText} ${q.options.join(" ")}`;
}
function questionMatchesFun(q) {
  const blob = questionTextBlob(q);
  if (EMOJI_RE.test(blob)) return true;
  return /\b(kdo by|co by|nejlepší|nejlépe|směš|vtip|zábav|hádank|piknik|superpower|tanečník|řev|spánek|spaní|kouzeln)\b/i.test(
    q.questionText
  );
}
function questionMatchesEducational(q) {
  const ex = q.explanation;
  const qt = q.questionText;
  if (/Věděl|věděla|Víš\b|Víte\b|proč\b|Víte, že|Víš, že/i.test(qt)) return true;
  const sentences = ex.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 12);
  if (sentences.length >= 2) return true;
  if (/Věděl|věděla|protože|znamená|pomáhá|učí|říkáme|objev|pochopíš/i.test(ex))
    return true;
  return false;
}
function questionMatchesKnowledge(q) {
  if (EMOJI_RE.test(questionTextBlob(q))) return false;
  if (/\b(kdo by|co by|nejlepší taneční|vyhrálo soutěž|superpower|piknik\s+v\s+batohu|kouzeln)\b/i.test(
    q.questionText
  ))
    return false;
  const ex = q.explanation.trim();
  if (ex.length > 220) return false;
  if (/Věděl jsi|Věděla jsi|Víš, že|Věděl\/a jsi/i.test(ex)) return false;
  return true;
}
function questionMatchesCompetitive(q) {
  const t = q.questionText;
  if (/Rychle|Bonus|Bonusová|Timeout|Výzva|nejprve|nejrychleji|paměť|soutěž|Zamysl|Která odpověď/i.test(
    t
  ))
    return true;
  return t.length <= 100;
}
function questionMatchesCategory(q, category) {
  switch (category) {
    case "fun":
      return questionMatchesFun(q);
    case "educational":
      return questionMatchesEducational(q);
    case "knowledge":
      return questionMatchesKnowledge(q);
    case "competitive":
      return questionMatchesCompetitive(q);
    default:
      return true;
  }
}
function categoryMatchRatio(quiz, category) {
  if (quiz.questions.length === 0) return 0;
  const matched = quiz.questions.filter(
    (q) => questionMatchesCategory(q, category)
  ).length;
  return matched / quiz.questions.length;
}
var SENIORS_MODERN_RE = /\b(tiktok|instagram|iphone|smartphone|snapchat|wifi|wi-?fi|streamovat|netflix|meme|emoji\s*only)\b/i;
function validateQuizCategory(quiz, expectedCategory, targetGroup) {
  let score = categoryMatchRatio(quiz, expectedCategory);
  if (targetGroup === "seniors" && expectedCategory === "fun") {
    const bad = quiz.questions.some(
      (q) => SENIORS_MODERN_RE.test(`${q.questionText} ${q.explanation}`)
    );
    if (bad) score *= 0.65;
  }
  if (targetGroup === "seniors" && expectedCategory === "knowledge") {
    const emojiLeak = quiz.questions.some(
      (q) => EMOJI_RE.test(questionTextBlob(q))
    );
    if (emojiLeak) score *= 0.7;
  }
  return Math.min(1, Math.max(0, score));
}
function quizPassesCategoryValidation(quiz, category, targetGroup) {
  if (category !== "fun" && category !== "educational" && category !== "knowledge" && category !== "competitive") {
    return true;
  }
  return validateQuizCategory(quiz, category, targetGroup) >= 0.6;
}

// src/lib/generateQuizCore.ts
var CATEGORY_PROMPT_LABEL = {
  knowledge: "knowledge (V\u011Bdomostn\xED)",
  educational: "educational (V\xFDukov\xE9)",
  fun: "fun (Z\xE1bavn\xE9)",
  competitive: "competitive (Sout\u011B\u017En\xED)"
};
var TARGET_PROMPT_LABEL = {
  kids: "kids (D\u011Bti 6\u201312 let)",
  juniors: "juniors (Junio\u0159i 12\u201318 let)",
  adults: "adults (Dosp\u011Bl\xED)",
  seniors: "seniors (Senio\u0159i 65+)"
};
function buildSystemPrompt(config2) {
  const category = config2.category;
  const targetGroup = config2.targetGroup;
  const h = new Set(config2.handicaps.filter((x) => x !== "none"));
  let prompt = `Jsi odborn\xEDk na tvorbu kv\xEDz\u016F. Tvoje \xFAkolem je vygenerovat kv\xEDz podle p\u0159esn\xFDch pravidel.

KATEGORIE: ${CATEGORY_PROMPT_LABEL[category]}
C\xCDLOV\xC1 SKUPINA: ${TARGET_PROMPT_LABEL[targetGroup]}
${h.size ? `HANDICAPY (obsah ot\xE1zek): ${[...h].join(", ")}` : ""}

PRAVIDLA PRO KATEGORII:`;
  if (category === "fun") {
    prompt += `
- Ka\u017Ed\xE1 ot\xE1zka mus\xED b\xFDt vtipn\xE1, hrav\xE1; pou\u017Eij emotikony (nap\u0159. \u{1F389} \u{1F602} \u{1F57A} nebo jin\xE9 vhodn\xE9).
- \u0160patn\xE9 odpov\u011Bdi mohou b\xFDt sm\u011B\u0161n\xE9 nebo absurdn\xED, ne jen stroze chybn\xE9.
- P\u0159\xEDklad (d\u011Bti, t\xE9ma zv\xED\u0159ata):
  \u201EKter\xE9 zv\xED\u0159e by vyhr\xE1lo sout\u011B\u017E v nejhlasit\u011Bj\u0161\xEDm \u0159evu? \u{1F981} A) Lev B) My\u0161 C) \u017Dirafa D) Lenochod\u201C
- P\u0159\xEDklad (dosp\u011Bl\xED, technologie):
  \u201EPro\u010D program\xE1to\u0159i \u010Dasto vtipkuj\xED o \u201Adebugov\xE1n\xED\u2018 narozenin? A) Boj\xED se \u010D\xEDsel B) Rad\u0161i \u0159e\u0161\xED chyby v k\xF3du C) Nemaj\xED kolegy D) Slav\xED vznik repozit\xE1\u0159e\u201C`;
  }
  if (category === "educational") {
    prompt += `
- Ka\u017Ed\xE1 ot\xE1zka m\xE1 hr\xE1\u010De n\u011B\u010Demu nau\u010Dit. Vysv\u011Btlen\xED mus\xED b\xFDt pou\u010Dn\xE9 (2\u20133 v\u011Bty s konkr\xE9tn\xEDm faktem).
- \u010Casto pou\u017Eij vstup ve stylu \u201EV\u011Bd\u011Bl/a jsi, \u017Ee \u2026?\u201C nebo \u201EV\xED\u0161, \u017Ee \u2026?\u201C.
- P\u0159\xEDklad (senio\u0159i, bylinky):
  \u201EV\u011Bd\u011Bl/a jsi, kter\xE1 bylinka se tradi\u010Dn\u011B spojuje s uklidn\u011Bn\xEDm p\u0159ed sp\xE1nkem? A) M\xE1ta B) Levandule C) T\u0159ezalka D) \u0160alv\u011Bj\u201C
  Vysv\u011Btlen\xED: \u201ELevandule b\xFDv\xE1 spojov\xE1na s uklid\u0148uj\xEDc\xED v\u016Fn\xED; lidov\xE9 zvyky ji dlouho pou\u017E\xEDvaly p\u0159i ve\u010Dern\xEDm odpo\u010Dinku (\xFA\u010Dinky individu\xE1ln\xED).\u201C`;
  }
  if (category === "knowledge") {
    prompt += `
- Testuj skute\u010Dn\xE9 znalosti. Ot\xE1zky p\u0159\xEDm\xE9, faktick\xE9, bez vtip\u016F a nads\xE1zky (krom\u011B v\xFDslovn\xE9ho zad\xE1n\xED pro d\u011Bti u z\xE1bavy).
- Vysv\u011Btlen\xED: stru\u010Dn\u011B jedna a\u017E dv\u011B v\u011Bty se spr\xE1vn\xFDm faktem.
- P\u0159\xEDklad (junio\u0159i, historie):
  \u201EVe kter\xE9m roce za\u010Dala prvn\xED sv\u011Btov\xE1 v\xE1lka? A) 1912 B) 1914 C) 1916 D) 1918\u201C
  Vysv\u011Btlen\xED: \u201EPrvn\xED sv\u011Btov\xE1 v\xE1lka vypukla v roce 1914 po atent\xE1tu na n\xE1sledn\xEDka tr\u016Fnu Franti\u0161ka Ferdinanda d\u2019Este v Sarajevu.\u201C`;
  }
  if (category === "competitive") {
    prompt += `
- Tvrd\u0161\xED, stru\u010Dn\xE9 ot\xE1zky jako v televizn\xED nebo kv\xEDzov\xE9 sout\u011B\u017Ei.
- Pou\u017E\xEDvej v\xFDzvy a nap\u011Bt\xED (nap\u0159. \u201ERychle!\u201C, \u201EBonusov\xE1 ot\xE1zka!\u201C, \u201ECo nastane jako prvn\xED?\u201C) \u2014 u senior\u016F viz dodatek n\xED\u017Ee.
- Vysv\u011Btlen\xED m\u016F\u017Ee b\xFDt o n\u011Bco del\u0161\xED (3\u20134 v\u011Bty) a obsahovat zaj\xEDmavost.
- P\u0159\xEDklad (dosp\u011Bl\xED, chemie/dom\xE1cnost):
  \u201ERychle! Co typicky nastane hned po sm\xEDch\xE1n\xED jedl\xE9 sody s octem? A) Uvoln\xED se hodn\u011B tepla B) Rychle vznikne p\u011Bna CO\u2082 C) Zm\u011Bn\xED se barva na modrou D) Exploze jako z filmu\u201C
  Vysv\u011Btlen\xED: \u201ENejprve vznik\xE1 p\u011Bna kv\u016Fli uvoln\u011Bn\xED oxidu uhli\u010Dit\xE9ho (neutralizace). Zaj\xEDmavost: podobn\xFD princip vyu\u017E\xEDvaj\xED n\u011Bkter\xE9 hasic\xED p\u0159\xEDstroje.\u201C`;
  }
  if (category === "competitive" && targetGroup === "seniors") {
    prompt += `
- SENIO\u0158I + SOUT\u011A\u017D: nepou\u017E\xEDvej agresivn\xED \u201ERychle!\u201C ani n\xE1tlak; klidn\xE9 v\u011Bty (\u201EZamyslete se\u201C, \u201EKter\xE1 odpov\u011B\u010F je spr\xE1vn\xE1?\u201C). Stejn\xE1 v\u011Bcn\xE1 n\xE1ro\u010Dnost jako dosp\u011Bl\xED.`;
  }
  if (targetGroup === "kids") {
    prompt += `
- D\u011Bti 6\u201312 let: kr\xE1tk\xE9 v\u011Bty (max 8 slov v ot\xE1zce), jednoduch\xE1 slova; u z\xE1bavy hodn\u011B emotikon\u016F; \u017E\xE1dn\xE9 negace a chyt\xE1ky na z\xE1por.`;
  } else if (targetGroup === "juniors") {
    prompt += `
- Junio\u0159i 12\u201318 let: st\u0159edn\xED obt\xED\u017Enost, popkulturn\xED reference povoleny (kulturn\u011B vhodn\u011B).`;
  } else if (targetGroup === "adults") {
    prompt += `
- Dosp\u011Bl\xED: n\xE1ro\u010Dn\u011Bj\u0161\xED ot\xE1zky, del\u0161\xED souv\u011Bt\xED povolena, odborn\u011Bj\u0161\xED term\xEDny tam, kde d\xE1v\xE1 smysl.`;
  } else if (targetGroup === "seniors") {
    prompt += `
- Senio\u0159i 65+: stejn\xE1 obt\xED\u017Enost fakt\u016F jako dosp\u011Bl\xED, ale bez modern\xEDch odkaz\u016F (mobily, soci\xE1ln\xED s\xEDt\u011B, memy, streamov\xE1n\xED). T\xE9mata 1950\u20131990 v\xEDt\xE1na.`;
  }
  const handicapLines = [];
  if (h.has("cognitive_dementia")) {
    handicapLines.push(
      "Kognitivn\xED demence: max 10 slov na ot\xE1zku, \u017E\xE1dn\xE9 negace, p\u0159esn\u011B 3 odpov\u011Bdi v JSON, \u017E\xE1dn\xFD \u010Dasov\xFD tlak v textu."
    );
  }
  if (h.has("dyslexia")) {
    handicapLines.push(
      "Dyslexie: vyhni se slov\u016Fm s podobn\xFDmi tvary (b\xFDt/byt); \u017E\xE1dn\xE1 slova se 3+ souhl\xE1skami v \u0159ad\u011B; kr\xE1tk\xE9 v\u011Bty."
    );
  }
  if (h.has("visual_impairment")) {
    handicapLines.push(
      "Zrakov\xE9 posti\u017Een\xED: ot\xE1zky mus\xED d\xE1vat smysl bez obr\xE1zk\u016F; \u017E\xE1dn\xE9 \u201Epod\xEDvej se na obr\xE1zek\u201C."
    );
  }
  if (h.has("hearing_impairment")) {
    handicapLines.push(
      "Sluchov\xE9 posti\u017Een\xED: \u017E\xE1dn\xE9 ot\xE1zky o zvuc\xEDch; \u017E\xE1dn\xE9 \u201Eposlechni si\u201C."
    );
  }
  if (h.has("autism_spectrum")) {
    handicapLines.push(
      "PAS: doslovn\xFD jazyk, \u017E\xE1dn\xE9 metafory, jednozna\u010Dn\xE9 ot\xE1zky a odpov\u011Bdi."
    );
  }
  if (h.has("czech_learners")) {
    handicapLines.push(
      "Cizinci A1\u2013A2: p\u0159ev\xE1\u017En\u011B p\u0159\xEDtomn\xFD \u010Das, z\xE1kladn\xED slova, max 5 slov na ot\xE1zku."
    );
  }
  if (handicapLines.length) {
    prompt += `

P\u0158\xCDSTUPNOST:
- ${handicapLines.join("\n- ")}`;
  }
  prompt += `

Dodr\u017Euj p\u0159esn\u011B v\xFD\u0161e uveden\xE1 pravidla. Hr\xE1\u010Dsk\xFD text v \u010De\u0161tin\u011B; pole imageContextPrompt v\xFDhradn\u011B kr\xE1tce anglicky (atmosf\xE9ra bez spoileru). Generuj v\xFDstup jako JSON podle sch\xE9matu.`;
  return prompt;
}
var STRICT_RETRY_USER_SUFFIX = `

=== DODATE\u010CN\xDD POKUS (P\u0158\xCDSN\u011AJI) ===
P\u0159edchoz\xED v\xFDstup nesplnil automatickou kontrolu stylu kategorie. Nyn\xED striktn\u011B dodr\u017E KATEGORII a C\xCDLOVOU SKUPINU ze system instrukce v\u010Detn\u011B p\u0159\xEDklad\u016F. Ka\u017Ed\xE1 ot\xE1zka mus\xED stylisticky odpov\xEDdat zvolen\xE9mu re\u017Eimu (z\xE1bava = emotikony/vtip; v\u011Bdomostn\xED = st\u0159\xEDdm\u011B a fakticky; v\xFDukov\xE9 = pou\u010Dn\xE9 vysv\u011Btlen\xED; sout\u011B\u017En\xED = stru\u010Dn\xE1 v\xFDzva).`;
function buildUserPrompt(config2) {
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  const questionCount = getQuestionCount(config2.quizLength);
  const optionCount = quizOptionCountForConfig(config2);
  const maxIdx = optionCount - 1;
  const competitiveLimit = clampCompetitiveTimeLimitSeconds(
    config2.competitiveTimeLimitSeconds,
    config2.targetGroup
  );
  const competitiveJsonExtra = config2.category === "competitive" ? `

DODATEK JSON PRO SOUT\u011A\u017DN\xCD RE\u017DIM:
- U ka\u017Ed\xE9 ot\xE1zky v poli "questions" mus\xED b\xFDt \u010D\xEDslo "timeLimit" (sekundy na zodpov\u011Bzen\xED). Pou\u017Eij u v\u0161ech ot\xE1zek stejnou hodnotu: ${competitiveLimit}.
- "questionText" u ka\u017Ed\xE9 ot\xE1zky ne del\u0161\xED ne\u017E 100 znak\u016F; jednoduch\xE9 zn\u011Bn\xED bez slo\u017Eit\xFDch souv\u011Bt\xED.` : "";
  return `Dne\u0161n\xED datum (pro sez\xF3nn\xED t\xE9mata): ${today}.

${buildPromptEnrichment(config2)}
${competitiveJsonExtra}

=== \xDAKOL (USER) ===
Vytvo\u0159 jeden kv\xEDz v \u010De\u0161tin\u011B. V\xFDstup mus\xED p\u0159esn\u011B odpov\xEDdat JSON sch\xE9matu (\u017E\xE1dn\xFD text mimo JSON).

Po\u017Eadavky na obsah:
- P\u0159esn\u011B ${questionCount} ot\xE1zek v poli "questions". Ka\u017Ed\xE1 m\xE1 jin\xE9 zn\u011Bn\xED, \u017E\xE1dn\xE9 duplicity ani opakov\xE1n\xED stejn\xE9ho faktu.
- T\xE9ma obsahu: ${compactThemeSummary(config2)}
- Kategorie, c\xEDlov\xE1 skupina, styl a p\u0159\xEDklady: viz system instrukce. Dopl\u0148kov\xFD t\xF3n a form\xE1t: v sekc\xEDch v\xFD\u0161e (persona, form\xE1t ot\xE1zek, p\u0159\xEDstupnost).
- P\u0159\xEDstupnost: striktn\xED pravidla v sekci \u201EPRAVIDLA P\u0158\xCDSTUPNOSTI\u201C \u2014 dodr\u017E je v\u010Detn\u011B po\u010Dtu mo\u017Enost\xED v poli "options".
- Ka\u017Ed\xE1 ot\xE1zka m\xE1 p\u0159esn\u011B ${optionCount} \u0159et\u011Bzc\u016F v poli "options".
- "correctAnswerIndex" je v\u017Edy cel\xE9 \u010D\xEDslo od 0 do ${maxIdx} (index spr\xE1vn\xE9 mo\u017Enosti). Spr\xE1vn\xE1 odpov\u011B\u010F mus\xED b\xFDt n\xE1hodn\u011B rozlo\u017Eena mezi ot\xE1zkami (pou\u017E\xEDvej v\u0161echny platn\xE9 indexy, nepreferuj po\u0159\xE1d stejn\xFD).
- "id" u ot\xE1zek: q1, q2, \u2026 a\u017E q${questionCount} (povinn\xE9 pole v JSON).
- V textech ot\xE1zek a odpov\u011Bd\xED \u017E\xE1dn\xE9 URL ani odkazy, pouze b\u011B\u017En\xFD text v \u010De\u0161tin\u011B.
- Ka\u017Ed\xE1 ot\xE1zka MUS\xCD m\xEDt povinn\xE9 pole "imageContextPrompt" p\u0159esn\u011B podle sekce PRAVIDLO PRO OBR\xC1ZKY v\xFD\u0161e (anglicky, kr\xE1tk\xE1 fr\xE1ze pro vyhled\xE1n\xED ilustrace bez spoileru).
- JSON struktura ka\u017Ed\xE9 polo\u017Eky v "questions": id, questionText, options (${optionCount} \u0159et\u011Bzc\u016F), correctAnswerIndex, explanation, imageContextPrompt${config2.category === "competitive" ? ", timeLimit (cel\xE9 \u010D\xEDslo, sekundy)" : ""}.
- Striktn\u011B dodr\u017Euj sekci FAKTICK\xC1 P\u0158ESNOST v\xFD\u0161e i v system instrukci: spr\xE1vn\xE1 odpov\u011B\u010F i distraktory mus\xED b\xFDt logicky konzistentn\xED; \u017E\xE1dn\xE9 halucinovan\xE9 \u201Efakta\u201C.`;
}
function quizGenerationSamplingConfig(config2) {
  const byCategory = {
    knowledge: { temperature: 0.2, topP: 0.9 },
    educational: { temperature: 0.3, topP: 0.9 },
    fun: { temperature: 0.7, topP: 0.95 },
    competitive: { temperature: 0.5, topP: 0.9 }
  };
  let { temperature, topP } = byCategory[config2.category];
  if (config2.theme === "custom") {
    temperature = Math.min(temperature, 0.35);
    topP = Math.min(topP, 0.9);
  }
  return { temperature, topP };
}
function quizResponseJsonSchema(_questionCount, optionCount, category) {
  const required = [
    "id",
    "questionText",
    "options",
    "correctAnswerIndex",
    "explanation",
    "imageContextPrompt"
  ];
  if (category === "competitive") {
    required.push("timeLimit");
  }
  const qItem = {
    type: "object",
    properties: {
      id: { type: "string" },
      questionText: { type: "string" },
      options: {
        type: "array",
        minItems: optionCount,
        maxItems: optionCount,
        items: { type: "string" }
      },
      correctAnswerIndex: { type: "integer" },
      explanation: { type: "string" },
      imageContextPrompt: { type: "string" },
      timeLimit: { type: "integer" }
    },
    required
  };
  const quizShape = {
    type: "object",
    properties: {
      title: { type: "string" },
      questions: {
        type: "array",
        items: qItem
      }
    },
    required: ["title", "questions"]
  };
  const errorShape = {
    type: "object",
    properties: {
      error: { type: "string" }
    },
    required: ["error"]
  };
  return {
    anyOf: [errorShape, quizShape]
  };
}
function extractJsonObject(text) {
  const t = text.trim();
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t);
  if (fence) return fence[1].trim();
  return t;
}
function normalizeQuestion(q, index, optionCount) {
  if (!q || typeof q !== "object") return null;
  const o = q;
  const id = typeof o.id === "string" ? o.id : `q${index + 1}`;
  const questionText = typeof o.questionText === "string" ? o.questionText.trim() : "";
  const explanation = typeof o.explanation === "string" ? o.explanation.trim() : "";
  const options = o.options;
  if (!Array.isArray(options) || options.length !== optionCount) return null;
  if (!options.every((x) => typeof x === "string" && x.trim().length > 0))
    return null;
  const idx = o.correctAnswerIndex;
  const maxI = optionCount - 1;
  if (typeof idx !== "number" || idx < 0 || idx > maxI || !Number.isInteger(idx))
    return null;
  if (!questionText) return null;
  const imageRaw = typeof o.imageContextPrompt === "string" ? o.imageContextPrompt.trim() : typeof o.mediaSearchHint === "string" ? o.mediaSearchHint.trim() : "";
  if (!imageRaw) return null;
  const imageContextPrompt = imageRaw.slice(0, 200);
  let timeLimit;
  if (typeof o.timeLimit === "number" && Number.isInteger(o.timeLimit)) {
    if (o.timeLimit >= 5 && o.timeLimit <= 120) timeLimit = o.timeLimit;
  }
  const trimmed = options.map((s) => String(s).trim());
  return {
    id,
    questionText,
    options: trimmed,
    correctAnswerIndex: idx,
    explanation: explanation || "Spr\xE1vn\xE1 odpov\u011B\u010F odpov\xEDd\xE1 zad\xE1n\xED.",
    imageContextPrompt,
    ...timeLimit !== void 0 ? { timeLimit } : {}
  };
}
function shuffleQuestionOptions2(question) {
  const tagged = question.options.map((text, i) => ({
    text,
    correct: i === question.correctAnswerIndex
  }));
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tagged[i], tagged[j]] = [tagged[j], tagged[i]];
  }
  const correctAnswerIndex = tagged.findIndex((t) => t.correct);
  const opts = tagged.map((t) => t.text);
  return {
    ...question,
    options: opts,
    correctAnswerIndex
  };
}
function parseGeneratedQuiz(raw, expectedQuestionCount, optionCount) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Neplatn\xE1 odpov\u011B\u010F AI (nen\xED objekt).");
  }
  const o = raw;
  const title = typeof o.title === "string" ? o.title.trim() : "";
  const questionsRaw = o.questions;
  if (!Array.isArray(questionsRaw) || questionsRaw.length === 0) {
    throw new Error("Neplatn\xE1 odpov\u011B\u010F AI (chyb\xED ot\xE1zky).");
  }
  if (questionsRaw.length !== expectedQuestionCount) {
    throw new Error(
      `AI vr\xE1tila ${questionsRaw.length} ot\xE1zek, o\u010Dek\xE1v\xE1no p\u0159esn\u011B ${expectedQuestionCount}. Zkuste znovu nebo zvolte krat\u0161\xED kv\xEDz.`
    );
  }
  const questions = [];
  for (let i = 0; i < questionsRaw.length; i++) {
    const nq = normalizeQuestion(questionsRaw[i], i, optionCount);
    if (!nq) {
      throw new Error(`Neplatn\xE1 ot\xE1zka \u010D. ${i + 1} ve struktu\u0159e AI.`);
    }
    questions.push(
      shuffleQuestionOptions2({ ...nq, id: `q${i + 1}` })
    );
  }
  if (!title) {
    throw new Error("Neplatn\xE1 odpov\u011B\u010F AI (chyb\xED n\xE1zev kv\xEDzu).");
  }
  return { title, questions };
}
function applyCompetitiveTimeLimits(config2, quiz) {
  if (config2.category !== "competitive") return quiz;
  const lim = clampCompetitiveTimeLimitSeconds(
    config2.competitiveTimeLimitSeconds,
    config2.targetGroup
  );
  return {
    ...quiz,
    questions: quiz.questions.map((q) => ({ ...q, timeLimit: lim }))
  };
}
function textFromGeminiResponse(data) {
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const texts = parts.map((p) => p.text).filter((t) => typeof t === "string" && t.length > 0);
  if (texts.length === 0) {
    throw new Error("Pr\xE1zdn\xE1 odpov\u011B\u010F od Gemini (\u017E\xE1dn\xFD text).");
  }
  const jsonLike = texts.find((t) => t.trimStart().startsWith("{"));
  return jsonLike ?? texts[texts.length - 1];
}
function maxOutputTokensForQuiz(questionCount) {
  if (questionCount <= 15) return 16384;
  if (questionCount <= 25) return 32768;
  return 65536;
}
function buildGeminiSystemInstruction(config2) {
  const header = `Jsi faktick\xFD gener\xE1tor kv\xEDz\u016F. Tv\xE1 pravidla jsou absolutn\xED:

Odpov\xEDdej POUZE na z\xE1klad\u011B ov\u011B\u0159iteln\xFDch fakt\u016F.

Pokud o zadan\xE9m t\xE9matu nem\xE1\u0161 v tr\xE9novac\xEDch datech dostatek konkr\xE9tn\xEDch detail\u016F (jm\xE9na, data, m\xEDsta), odm\xEDtni ot\xE1zku vygenerovat a vra\u0165 JSON s error hl\xE1\u0161kou \u2014 jedin\xFD objekt s povinn\xFDm polem "error" (\u0159et\u011Bzec v \u010De\u0161tin\u011B), bez kv\xEDzu.

Nikdy si nevym\xFD\u0161lej fiktivn\xED jm\xE9na nebo ud\xE1losti, i kdyby to vypadalo uv\u011B\u0159iteln\u011B.

Kdy\u017E kv\xEDz vygeneruje\u0161, odpov\u011Bz v\xFDhradn\u011B strukturovan\xFDm JSON podle zadan\xE9ho sch\xE9matu. Ve\u0161ker\xFD obsah pro hr\xE1\u010De pi\u0161 v \u010De\u0161tin\u011B; pole imageContextPrompt je v\xFDjimka, pouze kr\xE1tk\xFD anglick\xFD popis bezpe\u010Dn\xE9 ilustrace (atmosf\xE9ra bez spoileru), nikdy \u010Desky.`;
  return [header, buildSystemPrompt(config2), FACTUAL_ACCURACY_RULES_CS].join(
    "\n\n"
  );
}
function geminiThinkingConfigFromEnv() {
  if (typeof process === "undefined") return {};
  const raw = process.env.GEMINI_THINKING_BUDGET?.trim();
  if (!raw) return {};
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return {};
  return { thinkingConfig: { thinkingBudget: n } };
}
async function generateQuizFromGemini(config2, opts) {
  const apiKey = opts.apiKey.trim();
  if (!apiKey) {
    throw new Error("Chyb\xED API kl\xED\u010D pro Gemini.");
  }
  const questionCount = getQuestionCount(config2.quizLength);
  const optionCount = quizOptionCountForConfig(config2);
  const model = opts.model?.trim() || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const baseSampling = quizGenerationSamplingConfig(config2);
  const strictSampling = {
    temperature: Math.max(0.12, baseSampling.temperature * 0.82),
    topP: Math.min(0.88, Math.max(0.5, baseSampling.topP - 0.05))
  };
  async function fetchAndParseQuiz(userText, sampling) {
    const body = {
      systemInstruction: {
        parts: [{ text: buildGeminiSystemInstruction(config2) }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userText }]
        }
      ],
      generationConfig: {
        temperature: sampling.temperature,
        topP: sampling.topP,
        maxOutputTokens: maxOutputTokensForQuiz(questionCount),
        responseMimeType: "application/json",
        responseJsonSchema: quizResponseJsonSchema(
          questionCount,
          optionCount,
          config2.category
        ),
        ...geminiThinkingConfigFromEnv()
      }
    };
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) {
      const msg = data.error?.message || res.statusText;
      throw new Error(`Gemini API (${res.status}): ${msg}`);
    }
    const finishReason = data.candidates?.[0]?.finishReason;
    if (finishReason === "SAFETY") {
      throw new Error(
        "Gemini zablokovala odpov\u011B\u010F (bezpe\u010Dnostn\xED filtry). Zkus upravit t\xE9ma nebo kategorii."
      );
    }
    if (finishReason === "MAX_TOKENS") {
      throw new Error(
        "Odpov\u011B\u010F modelu se u\u0159\xEDzla (p\u0159\xEDli\u0161 dlouh\xFD v\xFDstup). Zvolte krat\u0161\xED kv\xEDz nebo zkuste generov\xE1n\xED znovu."
      );
    }
    const rawText = textFromGeminiResponse(data);
    let parsed;
    try {
      parsed = JSON.parse(extractJsonObject(rawText));
    } catch {
      throw new Error("Gemini nevr\xE1tila platn\xFD JSON.");
    }
    if (parsed && typeof parsed === "object") {
      const err = parsed.error;
      if (typeof err === "string" && err.trim()) {
        throw new Error(err.trim());
      }
    }
    return parseGeneratedQuiz(parsed, questionCount, optionCount);
  }
  let quiz = await fetchAndParseQuiz(buildUserPrompt(config2), baseSampling);
  if (quizPassesCategoryValidation(quiz, config2.category, config2.targetGroup)) {
    return applyCompetitiveTimeLimits(config2, quiz);
  }
  try {
    quiz = await fetchAndParseQuiz(
      buildUserPrompt(config2) + STRICT_RETRY_USER_SUFFIX,
      strictSampling
    );
  } catch {
    return applyCompetitiveTimeLimits(
      config2,
      buildFallbackQuiz(config2, questionCount)
    );
  }
  if (quizPassesCategoryValidation(quiz, config2.category, config2.targetGroup)) {
    return applyCompetitiveTimeLimits(config2, quiz);
  }
  return applyCompetitiveTimeLimits(
    config2,
    buildFallbackQuiz(config2, questionCount)
  );
}

// src/lib/quizConfigValidation.ts
var TARGETS = ["kids", "juniors", "adults", "seniors"];
var HANDICAPS = [
  "none",
  "visual_impairment",
  "dyslexia",
  "cognitive_dementia",
  "hearing_impairment",
  "autism_spectrum",
  "czech_learners"
];
var LEGACY_HANDICAP_KEYS = /* @__PURE__ */ new Set([
  "motor_skills",
  "cognitive",
  "dementia"
]);
function normalizeHandicapsFromApi(strings) {
  const set = /* @__PURE__ */ new Set();
  for (const h of strings) {
    if (h === "none") continue;
    if (h === "motor_skills") continue;
    if (h === "cognitive" || h === "dementia") {
      set.add("cognitive_dementia");
      continue;
    }
    if (HANDICAPS.includes(h) && h !== "none") {
      set.add(h);
    }
  }
  return set.size === 0 ? ["none"] : [...set];
}
var CATEGORIES = [
  "knowledge",
  "educational",
  "fun",
  "competitive"
];
var LENGTHS = ["short", "medium", "long"];
function isString(v) {
  return typeof v === "string";
}
function parseQuizConfigurationBody(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("Neplatn\xE9 t\u011Blo po\u017Eadavku (o\u010Dek\xE1v\xE1m JSON objekt).");
  }
  const o = raw;
  const targetGroup = o.targetGroup;
  const category = o.category;
  const theme = o.theme;
  const quizLength = o.quizLength;
  if (!isString(targetGroup) || !TARGETS.includes(targetGroup)) {
    throw new Error("Neplatn\xE1 c\xEDlov\xE1 skupina.");
  }
  if (!isString(category) || !CATEGORIES.includes(category)) {
    throw new Error("Neplatn\xE1 kategorie.");
  }
  if (!isString(theme)) {
    throw new Error("Neplatn\xE9 t\xE9ma.");
  }
  const themeNorm = normalizeIncomingThemeString(theme);
  if (!themeNorm || !ALL_QUIZ_THEMES.includes(themeNorm)) {
    throw new Error("Neplatn\xE9 t\xE9ma.");
  }
  let customThemeText = "";
  if (Object.prototype.hasOwnProperty.call(o, "customThemeText")) {
    const ct = o.customThemeText;
    if (ct != null && !isString(ct)) {
      throw new Error("Neplatn\xFD text vlastn\xEDho t\xE9matu.");
    }
    if (isString(ct)) {
      customThemeText = ct.trim().slice(0, 500);
    }
  }
  if (themeNorm === "custom" && customThemeText.length < 3) {
    throw new Error("Vlastn\xED t\xE9ma mus\xED m\xEDt alespo\u0148 3 znaky.");
  }
  if (!isString(quizLength) || !LENGTHS.includes(quizLength)) {
    throw new Error("Neplatn\xE1 d\xE9lka kv\xEDzu.");
  }
  const handicapsRaw = o.handicaps;
  if (!Array.isArray(handicapsRaw)) {
    throw new Error("Neplatn\xE9 pole handicap\u016F.");
  }
  const strings = handicapsRaw.filter(isString);
  if (strings.length !== handicapsRaw.length) {
    throw new Error("Neplatn\xE1 hodnota v handicapech.");
  }
  const allowedInput = /* @__PURE__ */ new Set([
    ...HANDICAPS,
    ...LEGACY_HANDICAP_KEYS
  ]);
  for (const h of strings) {
    if (!allowedInput.has(h)) {
      throw new Error("Neplatn\xE1 hodnota v handicapech.");
    }
  }
  const handicaps = normalizeHandicapsFromApi(strings);
  const tg = targetGroup;
  let cat = category;
  if (tg === "kids" && cat === "competitive") {
    cat = "knowledge";
  }
  let competitiveTimeLimitSeconds;
  if (cat === "competitive" && Object.prototype.hasOwnProperty.call(o, "competitiveTimeLimitSeconds")) {
    const raw2 = o.competitiveTimeLimitSeconds;
    if (raw2 != null) {
      if (typeof raw2 !== "number" || !Number.isFinite(raw2)) {
        throw new Error("Neplatn\xFD \u010Dasov\xFD limit (o\u010Dek\xE1v\xE1m \u010D\xEDslo).");
      }
      const n = Math.round(raw2);
      if (n < 5 || n > 60) {
        throw new Error("\u010Casov\xFD limit mus\xED b\xFDt mezi 5 a 60 sekundami.");
      }
      competitiveTimeLimitSeconds = clampCompetitiveTimeLimitSeconds(n, tg);
    }
  }
  return {
    targetGroup: tg,
    handicaps,
    category: cat,
    theme: themeNorm,
    customThemeText,
    quizLength,
    ...competitiveTimeLimitSeconds !== void 0 ? { competitiveTimeLimitSeconds } : {}
  };
}

// src/services/mediaEnrichment.ts
var import_meta = {};
var COMMONS_API = "https://commons.wikimedia.org/w/api.php";
var THEME_FALLBACK_EN = THEME_MEDIA_HINT_EN;
var STOP_WORDS = /* @__PURE__ */ new Set([
  "jak",
  "co",
  "kdy",
  "kde",
  "kdo",
  "pro\u010D",
  "\u017Ee",
  "je",
  "jsou",
  "byl",
  "byla",
  "b\xFDt",
  "t\xEDm",
  "pro",
  "na",
  "v",
  "ve",
  "z",
  "ze",
  "do",
  "od",
  "po",
  "za",
  "o",
  "u",
  "i",
  "a",
  "nebo",
  "ani",
  "kter\xFD",
  "kter\xE1",
  "kter\xE9",
  "jak\xFD",
  "jak\xE1",
  "jak\xE9",
  "kolik",
  "mezi",
  "aby"
]);
function defaultClientMediaRuntime() {
  let enabled = true;
  try {
    const viteEnv = import_meta.env;
    if (viteEnv != null) {
      enabled = viteEnv.VITE_QUIZ_MEDIA !== "0";
    }
  } catch {
  }
  return {
    enabled,
    pexelsApiKey: void 0
  };
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function sanitizeMediaSearchHint(raw) {
  const t = raw.replace(/[^a-zA-Z0-9\s-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 100);
  if (t.length < 2) return null;
  return t;
}
function buildHeuristicMediaQuery(q, theme) {
  const normalized = q.questionText.replace(/[?!.:;,""""''()[\]{}«»]/g, " ").replace(/\s+/g, " ").trim();
  const words = normalized.split(" ").map((w74) => w74.trim()).filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()));
  const fromQuestion = words.slice(0, 8).join(" ");
  let query = fromQuestion.length > 0 ? fromQuestion : THEME_FALLBACK_EN[theme];
  if (query.length < 2) {
    query = THEME_FALLBACK_EN[theme];
  }
  return query.slice(0, 100);
}
function pickCommonsMedia(page) {
  const info = page.imageinfo?.[0];
  if (!info?.url || !info.mime) return null;
  const mime = info.mime.toLowerCase();
  const title = (page.title ?? "").replace(/^file:/i, "").trim();
  const alt = title.length > 0 ? `Ilustrace k ot\xE1zce: ${title.replace(/_/g, " ")}` : "Ilustrace z Wikimedia Commons";
  if (mime.startsWith("video/")) {
    return {
      kind: "video",
      url: info.url,
      alt,
      mime,
      sourceLabel: "Wikimedia Commons",
      sourceUrl: info.descriptionurl
    };
  }
  if (!mime.startsWith("image/")) return null;
  const displayUrl = info.thumburl || info.url;
  return {
    kind: "image",
    url: info.url,
    displayUrl,
    alt,
    sourceLabel: "Wikimedia Commons",
    sourceUrl: info.descriptionurl
  };
}
function parseCommonsBody(data) {
  const pages = data.query?.pages;
  if (!pages) return null;
  for (const p of Object.values(pages)) {
    if (!p?.title) continue;
    const lower = p.title.toLowerCase();
    if (lower.endsWith(".pdf") || lower.endsWith(".djvu") || lower.endsWith(".mid") || lower.endsWith(".oga")) {
      continue;
    }
    const media = pickCommonsMedia(p);
    if (media) return media;
  }
  return null;
}
async function fetchCommonsMedia(search) {
  const trimmed = search.trim();
  if (!trimmed) return null;
  const url = new URL(COMMONS_API);
  url.searchParams.set("action", "query");
  url.searchParams.set("format", "json");
  url.searchParams.set("origin", "*");
  url.searchParams.set("generator", "search");
  url.searchParams.set("gsrsearch", trimmed);
  url.searchParams.set("gsrnamespace", "6");
  url.searchParams.set("gsrlimit", "12");
  url.searchParams.set("prop", "imageinfo");
  url.searchParams.set("iiprop", "url|mime|thumburl|extmetadata");
  url.searchParams.set("iiurlwidth", "960");
  const res = await fetch(url.toString());
  if (res.status === 429) {
    await sleep(900);
    const res2 = await fetch(url.toString());
    if (!res2.ok) return null;
    return parseCommonsBody(await res2.json());
  }
  if (!res.ok) return null;
  return parseCommonsBody(await res.json());
}
async function fetchPexelsMedia(search, apiKey) {
  const key = apiKey.trim();
  if (!key || !search.trim()) return null;
  const u = new URL("https://api.pexels.com/v1/search");
  u.searchParams.set("query", search.slice(0, 80));
  u.searchParams.set("per_page", "1");
  u.searchParams.set("locale", "cs-CZ");
  const res = await fetch(u.toString(), {
    headers: { Authorization: key }
  });
  if (!res.ok) return null;
  const data = await res.json();
  const ph = data.photos?.[0];
  if (!ph) return null;
  const displayUrl = ph.src?.large ?? ph.src?.medium;
  if (!displayUrl) return null;
  const photographer = ph.photographer?.trim() ?? "nezn\xE1m\xFD autor";
  const alt = (ph.alt && ph.alt.trim().length > 0 ? ph.alt.trim() : `Fotografie k ot\xE1zce (${photographer})`) || "Fotografie z Pexels";
  return {
    kind: "image",
    url: displayUrl,
    displayUrl,
    alt,
    sourceLabel: `Pexels \xB7 ${photographer}`,
    sourceUrl: ph.url
  };
}
async function resolveMediaForQuestion(q, config2, runtime) {
  const preferPexelsFirst = Boolean(runtime.pexelsApiKey?.trim());
  const tryPexels = async (s) => fetchPexelsMedia(s, runtime.pexelsApiKey ?? "");
  const tryCommons = async (s) => fetchCommonsMedia(s);
  async function tryProviders(search) {
    if (preferPexelsFirst) {
      return await tryPexels(search) ?? await tryCommons(search);
    }
    return await tryCommons(search) ?? await tryPexels(search);
  }
  const primary = q.imageContextPrompt != null && q.imageContextPrompt.length > 0 ? sanitizeMediaSearchHint(q.imageContextPrompt) : null;
  const heuristic = buildHeuristicMediaQuery(q, config2.theme);
  const thematic = THEME_FALLBACK_EN[config2.theme];
  const attempts = [];
  const seen = /* @__PURE__ */ new Set();
  const add = (s) => {
    const k = s.toLowerCase().trim();
    if (k.length < 2 || seen.has(k)) return;
    seen.add(k);
    attempts.push(s);
  };
  if (primary) add(primary);
  add(heuristic);
  add(thematic);
  for (const search of attempts) {
    const media = await tryProviders(search);
    if (media) return media;
    await sleep(80);
  }
  return null;
}
async function enrichQuizWithMedia(quiz, config2, runtime) {
  const env = runtime ?? defaultClientMediaRuntime();
  if (!env.enabled) {
    return quiz;
  }
  if (config2.handicaps.includes("visual_impairment")) {
    return {
      ...quiz,
      questions: quiz.questions.map(({ media: _m, ...q }) => q)
    };
  }
  const questions = quiz.questions;
  const out = [...questions];
  const concurrency = 2;
  let next = 0;
  const worker = async () => {
    while (true) {
      const i = next++;
      if (i >= out.length) break;
      try {
        const media = await resolveMediaForQuestion(out[i], config2, env);
        if (media) {
          out[i] = { ...out[i], media };
        }
      } catch {
      }
      await sleep(100);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(concurrency, out.length) }, () => worker())
  );
  return { ...quiz, questions: out };
}

// server/generate-quiz.ts
var config = {
  maxDuration: 300
};
function parseRequestBody(req) {
  const b = req.body;
  if (b == null || typeof b === "string" && b.trim() === "") {
    return void 0;
  }
  if (typeof b === "string") {
    return JSON.parse(b);
  }
  if (Buffer.isBuffer(b)) {
    const s = b.toString("utf8").trim();
    return s ? JSON.parse(s) : void 0;
  }
  return b;
}
async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  try {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      res.status(204).end();
      return;
    }
    if (req.method !== "POST") {
      res.status(405).json({ error: "Metoda nen\xED povolena." });
      return;
    }
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      res.status(503).json({
        error: "Server nem\xE1 nastaven\xFD GEMINI_API_KEY. Na Vercelu: Project \u2192 Settings \u2192 Environment Variables \u2192 p\u0159idej GEMINI_API_KEY (ne VITE_*). Pot\xE9 Redeploy."
      });
      return;
    }
    let config2;
    try {
      const body = parseRequestBody(req);
      config2 = parseQuizConfigurationBody(body);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Neplatn\xFD JSON nebo struktura t\u011Bla.";
      res.status(400).json({ error: msg });
      return;
    }
    const model = process.env.GEMINI_MODEL?.trim();
    let quiz = await generateQuizFromGemini(config2, { apiKey, model });
    const mediaEnabled = process.env.QUIZ_MEDIA !== "0";
    const pexelsKey = process.env.PEXELS_API_KEY?.trim();
    quiz = await enrichQuizWithMedia(quiz, config2, {
      enabled: mediaEnabled,
      pexelsApiKey: pexelsKey || void 0
    });
    let payload;
    try {
      payload = JSON.stringify(quiz);
    } catch (serErr) {
      console.error("[api/generate-quiz] serialize", serErr);
      res.status(500).json({
        error: "Nepoda\u0159ilo se serializovat odpov\u011B\u010F kv\xEDzu.",
        hint: "Zkontrolujte log funkce na Vercelu."
      });
      return;
    }
    res.status(200).send(payload);
  } catch (e) {
    console.error("[api/generate-quiz]", e);
    const msg = e instanceof Error ? e.message : "Neo\u010Dek\xE1van\xE1 chyba serveru.";
    try {
      if (!res.headersSent) {
        res.status(500).json({
          error: msg,
          hint: "Zkontrolujte log funkce ve Vercelu (Deployments \u2192 zvolte build \u2192 Functions). Pokud je zde chyba o modulu (import), zkontrolujte build a z\xE1vislosti."
        });
      }
    } catch (sendErr) {
      console.error("[api/generate-quiz] send error body failed", sendErr);
    }
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  config
});
