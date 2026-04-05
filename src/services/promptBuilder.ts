import type { HandicapType, QuizConfiguration, TargetGroup } from '../types'

const HANDICAP_RULES: Partial<
  Record<Exclude<HandicapType, 'none'>, string>
> = {
  dyslexia:
    'PRAVIDLO PRO DYSLEXII: Používej výhradně běžná slova a krátké věty. Vyhni se cizím slovům, složitým souvětím, dvojitým záporům a zbytečně těžkému pravopisu u vymyšlených odpovědí.',
  visual_impairment:
    'PRAVIDLO PRO ZRAKOVÉ POSTIŽENÍ: Otázky nesmí spoléhat na to, co „vidíš na obrázku“, na barvy jako jediný rozdíl mezi odpověďmi ani na popis vizuálních detailů. Vše musí být srozumitelné pouze z textu (popř. hmat, logika, běžné znalosti).',
  cognitive_dementia:
    'PRAVIDLO PRO KOGNITIVNÍ OMEZENÍ A DEMENCI: Jedna jasná informace v otázce, žádné metafory, ironie ani skryté významy. Velmi prostá slova, konkrétní kontext (škola, domov, příroda). Pozitivní tón, krátké otázky bez abstraktních hádanek. Odpovědi musí být zjevně rozlišitelné.',
  hearing_impairment:
    'PRAVIDLO PRO NESLYŠÍCÍ: Používej přímý, doslovný jazyk bez metafor a rčení. Absolutně se vyhni otázkám na hudbu, zvuky, hlasy nebo audio vjemy.',
  autism_spectrum:
    'PRAVIDLO PRO AUTISMUS: Otázky musí být 100% logické a faktické. Nepoužívej sarkasmus, ironii ani emočně nejednoznačné situace. Odpovědi nesmí být chytáky založené na slovíčkaření.',
  czech_learners:
    'PRAVIDLO PRO CIZINCE: Používej jen základní a mezinárodně srozumitelnou slovní zásobu (A2/B1). Zcela se vyhni lokální české popkultuře, českým hercům, večerníčkům a lokálním specifikům.',
}

const WEB_INSPIRATION: Record<TargetGroup, string> = {
  kids:
    'INSPIRACE OBSAHEM A TÓNEM (nevytvářej otázky o těchto webech jako takové; jen úroveň a styl): ČT Déčko, Alík.cz, Rumvi a podobné bezpečné dětské portály. Hravý jasný jazyk, věk zhruba 6 až 10 let.',
  juniors:
    'INSPIRACE: YouTube/TikTok (kulturně vhodné), herní novinky, Kahoot, streamovací scéna. Svižný tón teenagera, ale bez nebezpečných výzev a vulgárních memů.',
  adults:
    'INSPIRACE: zpravodajské a magazínové weby (např. Novinky, iDNES), hobby portály, hospodský kvíz, CSFD/Kinobox u popkultury. Dospělý neutrální až mírně vtípkářský tón.',
  seniors:
    'INSPIRACE: Český rozhlas (Plus, Dvojka), regionální zpravodajství, témata zahrady, zvyky, paměti na mládí. Klidný, respektující tón bez moderního slangu.',
}

function buildHandicapRulesBlock(handicaps: HandicapType[]): string {
  const lines = handicaps
    .filter((h): h is Exclude<HandicapType, 'none'> => h !== 'none')
    .map((h) => HANDICAP_RULES[h])
    .filter((x): x is string => Boolean(x))
  return lines.join('\n\n')
}

/**
 * Konkrétní formáty otázek podle cílové skupiny a kategorie (mapování z průvodce).
 * `competitive` má vlastní pravidla u juniorů a dospělých; u dětí jako zábavné; u seniorů v UI není, v promptu se bere jako vědomostní (fallback).
 */
function buildQuestionFormatBlock(config: QuizConfiguration): string {
  const { targetGroup, category } = config

  if (targetGroup === 'kids') {
    if (category === 'fun' || category === 'competitive') {
      return `FORMÁT OTÁZEK: Používej výhradně hádanky ('Kdo jsem?'), logické hry ('Co nepatří do party?') a vtipné absurdní situace (např. zvířata, která dělají lidské věci).`
    }
    if (category === 'educational') {
      return `FORMÁT OTÁZEK: Zaměř se na objevování světa. Otázky typu 'Víš, že...?'. Do pole 'explanation' napiš velmi zajímavé a dětem srozumitelné vysvětlení.`
    }
    if (category === 'knowledge') {
      return `FORMÁT OTÁZEK: Jednoduché testování základních znalostí (příroda, barvy, roční období, zvířata). Přímé a jasné otázky.`
    }
  }

  if (targetGroup === 'juniors') {
    if (category === 'competitive') {
      return `FORMÁT OTÁZEK: Extrémně dynamický Kahoot styl. Otázky musí být úderné, stručné a týkat se moderního světa (technologie, gaming, virální trendy, záludnosti ze školy). Nesprávné odpovědi musí být 'chytáky', které otestují pozornost hráče. Zvyš pocit časového tlaku a soutěživosti.`
    }
    if (category === 'fun') {
      return `FORMÁT OTÁZEK: Bizarní fakta z internetu, popkultura, gaming a otázky typu 'Pravda, nebo Fake News'.`
    }
    if (category === 'educational') {
      return `FORMÁT OTÁZEK: Propojení učiva 2. stupně ZŠ s reálným světem. Např. 'Co by se stalo, kdyby...' (testování logiky). Vysvětlení musí být detailní.`
    }
    if (category === 'knowledge') {
      return `FORMÁT OTÁZEK: Klasické kvízové otázky přiměřené věku, ale s moderním nádechem.`
    }
  }

  if (targetGroup === 'adults') {
    if (category === 'competitive') {
      return `FORMÁT OTÁZEK: Finále drsného hospodského kvízu. Těžké, komplexní otázky, kde všechny 4 možnosti vypadají velmi pravděpodobně. Odpovědi mohou být založené na drobných detailech. Očekávej vysoký stres a soutěživost mezi hráči. Do pole 'explanation' přidej uštěpačný nebo mírně ironický komentář pro ty, co odpověděli špatně.`
    }
    if (category === 'fun') {
      return `FORMÁT OTÁZEK: Hospodský kvíz. Chytáky, absurdní fakta z historie a otázky, kde první instinkt je většinou špatný.`
    }
    if (category === 'knowledge' || category === 'educational') {
      return `FORMÁT OTÁZEK: Těžké otázky, hledání souvislostí ('Spojovačka'), přesná historická nebo vědecká fakta.`
    }
  }

  if (targetGroup === 'seniors') {
    if (category === 'knowledge' || category === 'competitive') {
      return `FORMÁT OTÁZEK: Respektující vědomostní test ve stylu pořadu AZ Kvíz. Zaměř se na 'krystalizovanou inteligenci': československá historie 20. století, zeměpis, klasická literatura a významné osobnosti. Otázky musí být důstojné a bez chytáků.`
    }
    if (category === 'fun') {
      return `FORMÁT OTÁZEK: Nostalgie a společné vzpomínání. Vytvářej otázky typu 'Stroj času' (ceny zboží a každodenní život v letech 1960 až 1980), doplňování textů známých lidových nebo populárních písní z té doby a doplňování českých přísloví.`
    }
    if (category === 'educational') {
      return `FORMÁT OTÁZEK: Pojmi to jako jemný trénink paměti a objevování. Témata jako příroda, bylinkářství, tradiční recepty z babiččiny kuchařky nebo stará řemesla. Do pole 'explanation' napiš velmi laskavé a zajímavé doplnění kontextu k dané věci.`
    }
  }

  return ''
}

/** Přesné znění pro user prompt: pravidla bezpečných ilustrací bez spoilerů. */
export const IMAGE_CONTEXT_RULES_CS = `PRAVIDLO PRO OBRÁZKY (KRITICKÉ):
Pro každou otázku vygeneruj do pole 'imageContextPrompt' textový popis obrázku (v angličtině, max 5 až 8 slov). 
Tento obrázek MUSÍ navodit atmosféru otázky, ale ABSOLUTNĚ NESMÍ obsahovat nebo naznačovat správnou odpověď!
Příklad 1: Pokud je otázka 'Kdo napsal Babičku?', imageContextPrompt bude: 'old rustic spinning wheel in a wooden cottage' (NE portrét spisovatelky).
Příklad 2: Pokud je otázka 'Které zvíře má pruhy?', imageContextPrompt bude: 'african savanna landscape at sunset' (NE zebra).
Obrázek musí ilustrovat 'místo' nebo 'nástroj' související s tématem, nikdy ne samotný předmět otázky.`

/** Globální pravidla proti halucinacím u faktických kvízů (bez RAG). */
export const FACTUAL_ACCURACY_RULES_CS = `PRAVIDLA FAKTICKÉ PŘESNOSTI (KRITICKÉ):
- Generuj pouze tvrzení, u kterých jsi si jistý: běžně ověřitelná fakta (známá díla, osobnosti, hrubé souvislosti). Nevymýšlej konkrétní roky, dílčí epizody, vedlejší postavy ani detaily, pokud si nejsi jistý.
- Pokud si nejsi jistý přesným údajem, zjednoduš otázku na obecně platný a jednoznačný fakt, nebo ji přeformuluj. Raději obecněji než chybně konkrétně.
- Nesprávné možnosti (distraktory) musí být zjevně chybné nebo jednoznačně odlišné od správné odpovědi; nepoužívej další „pravděpodobné“ vymyšlené varianty, které by mohly být klamavě správné.
- Do pole 'explanation' vždy stručně doplň kontext podporující správnou odpověď (např. název díla, období); nepřidávej smyšlené detaily ani nejistá tvrzení.`

const CUSTOM_THEME_FACTUAL_ADDON_CS = `DODATEK PRO VLASTNÍ TÉMA: Téma je uživatelsky zvolené a může být úzké nebo odborné (např. éra, žánr, regionální kultura, starší český film). Drž se nejznámějších a nejdokumentovanějších faktů z daného oboru. Vyhni se obskurním titulům a záludnostem z okraje znalostí. U kinematografie, literatury a historie preferuj etablované klasiky a všeobecně sdílené reálie.`

function sanitizeCustomThemeForPrompt(raw: string): string {
  return raw
    .trim()
    .slice(0, 500)
    .replace(/'/g, '’')
    .replace(/\s+/g, ' ')
}

export function buildThemeInstructionBlock(config: QuizConfiguration): string {
  if (config.theme === 'random') {
    return `TÉMA: Zvol zcela náhodné, fascinující a netradiční téma, které bude perfektně sedět pro cílovou skupinu. Název kvízu musí toto téma vystihovat.`
  }
  if (config.theme === 'custom') {
    const t = sanitizeCustomThemeForPrompt(config.customThemeText)
    return `TÉMA: Kvíz se musí striktně a do hloubky týkat tohoto vlastního tématu: '${t}'.

${CUSTOM_THEME_FACTUAL_ADDON_CS}`
  }
  return `TÉMA: Zaměř se na specifickou oblast: ${config.theme}.`
}

function buildWebInspirationBlock(config: QuizConfiguration): string {
  const base = WEB_INSPIRATION[config.targetGroup]
  const h = new Set(config.handicaps.filter((x) => x !== 'none'))
  const extra: string[] = [base]
  if (h.has('dyslexia')) {
    extra.push(
      'Doplňující styl: jazyk jako v přístupných článcích pro široké publikum, krátké odstavce myšlenkově, jednoduchá souvětí.'
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
    return `TVOJE ROLE: Učitel/ka 1. stupně ZŠ, vlídně a trpělivě jako ve výukových blocích na Déčku nebo Rumvi. STYL: Naučné, ale vždy s jednoduchým příkladem nebo přirovnáním z dětského světa. Žádné odborné termíny bez vysvětlení.`
  }

  if (targetGroup === 'kids' && category === 'knowledge') {
    return `TVOJE ROLE: Tvůrce dětského vědomostního kvízu (6 až 10 let). STYL: Konkrétní otázky ze života zvířat, přírody, svátků, sportu pro děti. Obtížnost vždy úměrná věku, žádné reálie z politiky či finančních produktů.`
  }

  if (targetGroup === 'juniors' && category === 'competitive') {
    return `TVOJE ROLE: Tvůrce rychlých viralových výzev ve stylu Kahoot a Herních kanálů. STYL: Úderné věty, gaming, filmy, seriály, sporty. Lehká ironie je v pořádku, obsah musí zůstat slušný.`
  }

  if (targetGroup === 'juniors') {
    return `TVOJE ROLE: Moderátor kvízu pro teenagery (cca 12 až 16 let). STYL: Srozumitelný, živý, můžeš občas narážet na školu, sporty, technologie a popkulturu v míře vhodné pro mládež.`
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
 * Blok textu pro system/user prompt: persona, přístupnost, inspirace weby.
 */
export function buildPromptEnrichment(config: QuizConfiguration): string {
  const parts: string[] = [
    '=== TÓN, PERSONA A ÚROVEŇ ===\n\n' + buildPersonaBlock(config),
  ]

  const questionFormatBlock = buildQuestionFormatBlock(config)
  if (questionFormatBlock) {
    parts.push(
      '=== FORMÁT OTÁZEK (STRUKTURA A TYP OTAZEK) ===\n\n' + questionFormatBlock
    )
  }

  parts.push(
    '=== PRAVIDLO PRO OBRÁZKY ===\n\n' + IMAGE_CONTEXT_RULES_CS
  )

  parts.push(
    '=== FAKTICKÁ PŘESNOST ===\n\n' + FACTUAL_ACCURACY_RULES_CS
  )

  parts.push(
    '=== TÉMA (OBSAHOVÝ ZÁMĚR) ===\n\n' + buildThemeInstructionBlock(config)
  )

  const handicapBlock = buildHandicapRulesBlock(config.handicaps)
  if (handicapBlock) {
    parts.push('=== PRAVIDLA PŘÍSTUPNOSTI (OBSAH OTAZEK) ===\n\n' + handicapBlock)
  }

  parts.push(buildWebInspirationBlock(config))

  return parts.join('\n\n')
}
