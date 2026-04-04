import type { HandicapType, QuizConfiguration, TargetGroup } from '../types'

const HANDICAP_RULES: Partial<
  Record<Exclude<HandicapType, 'none'>, string>
> = {
  dyslexia:
    'PRAVIDLO PRO DYSLEXII: Používej výhradně běžná slova a krátké věty. Vyhni se cizím slovům, složitým souvětím, dvojitým záporům a zbytečně těžkému pravopisu u vymyšlených odpovědí.',
  visual_impairment:
    'PRAVIDLO PRO ZRAKOVÉ POSTIŽENÍ: Otázky nesmí spoléhat na to, co „vidíš na obrázku“, na barvy jako jediný rozdíl mezi odpověďmi ani na popis vizuálních detailů. Vše musí být srozumitelné pouze z textu (popř. zvuky, hmat, logika, běžné znalosti).',
  cognitive:
    'PRAVIDLO PRO KOGNITIVNÍ OMEZENÍ: Jedna jasná informace v otázce, žádné metafory, ironie ani skryté významy. Odpovědi musí být zjevně rozlišitelné.',
  motor_skills:
    'PRAVIDLO PRO OMEZENOU MOTORIKU: Možnosti odpovědí piš krátce (pár slov), bez zbytečně dlouhých souvětí.',
  dementia:
    'PRAVIDLO PRO DEMENCI / TĚŽŠÍ PAMĚŤOVÉ OBTÍŽE: Velmi prostá slova, konkrétní kontext (škola, domov, příroda). Pozitivní tón, krátké otázky bez abstraktních hádanek.',
}

const WEB_INSPIRATION: Record<TargetGroup, string> = {
  kids:
    'INSPIRACE OBSAHEM A TÓNEM (nevytvářej otázky o těchto webech jako takové; jen úroveň a styl): ČT Déčko, Alík.cz, Rumvi a podobné bezpečné dětské portály — hravý jasný jazyk, věk 6–10 let.',
  juniors:
    'INSPIRACE: YouTube/TikTok (kulturně vhodné), herní novinky, Kahoot, streamovací scéna — svižný tón teenagera, ale bez nebezpečných výzev a vulgárních memů.',
  adults:
    'INSPIRACE: zpravodajské a magazínové weby (např. Novinky, iDNES), hobby portály, hospodský kvíz, CSFD/Kinobox u popkultury — dospělý neutrální až mírně vtípkářský tón.',
  seniors:
    'INSPIRACE: Český rozhlas (Plus, Dvojka), regionální zpravodajství, témata zahrady, zvyky, paměti na mládí — klidný, respektující tón bez moderního slangu.',
}

function buildHandicapRulesBlock(handicaps: HandicapType[]): string {
  const lines = handicaps
    .filter((h): h is Exclude<HandicapType, 'none'> => h !== 'none')
    .map((h) => HANDICAP_RULES[h])
    .filter((x): x is string => Boolean(x))
  return lines.join('\n\n')
}

function buildWebInspirationBlock(config: QuizConfiguration): string {
  const base = WEB_INSPIRATION[config.targetGroup]
  const h = new Set(config.handicaps.filter((x) => x !== 'none'))
  const extra: string[] = [base]
  if (h.has('dyslexia')) {
    extra.push(
      'Doplňující styl: jazyk jako v přístupných článcích pro široké publikum — krátké odstavce myšlenkově, jednoduchá souvětí.'
    )
  }
  return '=== INSPIRACE REÁLNÝMI WEBY A MÉDII (jen tón a témata) ===\n\n' + extra.join('\n\n')
}

function buildPersonaBlock(config: QuizConfiguration): string {
  const { targetGroup, category } = config

  if (targetGroup === 'kids' && category === 'fun') {
    return `TVOJE ROLE: Zábavný moderátor dětského pořadu ve stylu ČT Déčko nebo Alík.cz. STYL: Hravý humor, zvířátka, pohádky, absurdní ale ne děsivé situace. ZÁKAZ: suchá encyklopedická fakta bez příběhu. Možnosti odpovědí ať dávají smysl dítěti a baví.`
  }

  if (targetGroup === 'kids' && category === 'educational') {
    return `TVOJE ROLE: Učitel/ka 1. stupně ZŠ — vlídně a trpělivě jako ve výukových blocích na Déčku nebo Rumvi. STYL: Naučné, ale vždy s jednoduchým příkladem nebo přirovnáním z dětského světa. Žádné odborné termíny bez vysvětlení.`
  }

  if (targetGroup === 'kids' && category === 'knowledge') {
    return `TVOJE ROLE: Tvůrce dětského vědomostního kvízu (6–10 let). STYL: Konkrétní otázky ze života zvířat, přírody, svátků, sportu pro děti. Obtížnost vždy úměrná věku — žádné reálie z politiky či finančních produktů.`
  }

  if (targetGroup === 'juniors' && category === 'competitive') {
    return `TVOJE ROLE: Tvůrce rychlých viralových výzev ve stylu Kahoot a Herních kanálů. STYL: Úderné věty, gaming, filmy, seriály, sporty — lehká ironie je v pořádku, obsah musí zůstat slušný.`
  }

  if (targetGroup === 'juniors') {
    return `TVOJE ROLE: Moderátor kvízu pro teenagery (cca 12–16 let). STYL: Srozumitelný, živý, můžeš občas narážet na školu, sporty, technologie a popkulturu v míře vhodné pro mládež.`
  }

  if (targetGroup === 'adults' && (category === 'fun' || category === 'competitive')) {
    return `TVOJE ROLE: Moderátor hospodského kvízu nebo soutěžního pořadu. STYL: Chytáky a zajímavá fakta, mírná ironie, propojení historie a popkultury.`
  }

  if (targetGroup === 'seniors' && (category === 'knowledge' || category === 'educational')) {
    return `TVOJE ROLE: Moderátor vědomostní soutěže ve stylu klasického TV kvízu. STYL: Zdvořilý, srozumitelný, často téma českých vlastí, přírody, kultury minulých dekád. ZÁKAZ: Moderní anglický slang a náhodné anglicismy.`
  }

  if (targetGroup === 'seniors') {
    return `TVOJE ROLE: Moderátor pro seniory. STYL: Klidně, jasně, dost času v textu (delší věty jsou v pořádku, ale jedna myšlenka najednou). Konkrétní kontext místo abstrakce.`
  }

  return `TVOJE ROLE: Profesionální moderátor znalostního kvízu v češtině. Přizpůsob tón a obtížnost: cílová skupina = ${targetGroup}, zaměření kvízu = ${category}. Buď srozumitelný a fakticky přesný.`
}

/**
 * Blok textu pro system/user prompt — persona, přístupnost, inspirace weby.
 */
export function buildPromptEnrichment(config: QuizConfiguration): string {
  const parts: string[] = [
    '=== TÓN, PERSONA A ÚROVEŇ ===\n\n' + buildPersonaBlock(config),
  ]

  const handicapBlock = buildHandicapRulesBlock(config.handicaps)
  if (handicapBlock) {
    parts.push('=== PRAVIDLA PŘÍSTUPNOSTI (OBSAH OTAZEK) ===\n\n' + handicapBlock)
  }

  parts.push(buildWebInspirationBlock(config))

  return parts.join('\n\n')
}
