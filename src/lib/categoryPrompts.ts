import type { QuizCategory, TargetGroup } from '../types'

/**
 * Jádro instrukcí pro kategorii (stejné 4 typy pro všechny věkové skupiny).
 */
export function getBaseCategoryPrompt(category: string): string {
  const cat = category as QuizCategory
  switch (cat) {
    case 'fun':
      return `KATEGORIE „ZÁBAVNÉ“ (FUN) — ZÁKLAD:
- Otázky mají být hravé a vtipné; styl přizpůsob věkové skupině (viz níže).
- Špatné odpovědi smí být směšné nebo absurdní tam, kde to dává smysl, ale bezpečné.
- Vyhni se zbytečně suchým encyklopedickým otázkám bez nápadu.`

    case 'educational':
      return `KATEGORIE „VÝUKOVÉ“ (EDUCATIONAL) — ZÁKLAD:
- Každá otázka má hráče něčemu přiblížit (fakt, souvislost nebo praktický tip).
- Do pole „explanation“ piš poučné vysvětlení s konkrétním faktem (ne prázdné fráze).
- Často můžeš použít vstup „Věděl/a jsi, že…?“ nebo „Víš, že…?“ v otázce nebo hned ve vysvětlení.`

    case 'knowledge':
      return `KATEGORIE „VĚDOMOSTNÍ“ (KNOWLEDGE) — ZÁKLAD:
- Testuj skutečné znalosti: faktické otázky bez zbytečného humoru a nadsázky (úroveň podle skupiny níže).
- V textu otázek a odpovědí nepoužívej emotikony, pokud skupina výslovně nepožaduje opak.
- Vysvětlení věcné a stručné podle skupiny; distraktory logicky konzistentní.`

    case 'competitive':
      return `KATEGORIE „SOUTĚŽNÍ“ (COMPETITIVE) — ZÁKLAD:
- Hráč má na každou otázku omezený čas v sekundách; do JSON u každé otázky přidej pole "timeLimit" (celé číslo), stejnou hodnotu u všech otázek podle zadání v hlavním promptu (DODATEK JSON).
- "questionText" zůstaň stručný podle skupiny (u juniorů a dospělých max. cca 100 znaků, jedna jasná myšlenka).
- Možnosti odpovědí stručné, aby šly rychle přečíst.
- Vysvětlení po odpovědi krátké a věcné.`

    default:
      return ''
  }
}

const KIDS_AUDIENCE = `
PRAVIDLA PRO DĚTI (cca 6–12 let) — HIERARCHIE: NEJJEDNODUŠŠÍ ÚROVEŇ:
- Otázka: maximálně 8 slov (počítej slova v češtině). Jedna krátká věta nebo jednoduchá otázka.
- Používej jednoduchá běžná slova; upřednostni krátká slova (ideálně do 2 slabik), vyhni se cizím termínům.
- U zábavné a výukové kategorie přidej hodně emotikonů do otázky nebo možností (např. 🐶 🦊 🐼 🌟). U vědomostní kategorie emotikony v otázce ani v odpovědích nepoužívej.
- V textu otázky nepoužívej negace ani „chytáky“ založené na záporu (vyhni se „ne“, „žádný“, „bez …“, dvojitým záporům v jedné otázce).
- Odpovědi ať nejsou slovíčkaření — správná možnost ať je pro dítě rozumná.`

const JUNIORS_AUDIENCE = `
PRAVIDLA PRO JUNIORY / MLÁDEŽ (cca 12–18 let) — STŘEDNÍ OBTÍŽNOST:
- Toto je výchozí střední náročnost v projektu.
- Popkulturní reference, technologie, škola, sporty a moderní média jsou v pořádku (kulturně vhodně, bez nebezpečných výzev).
- Styl může být svižnější a blízký kvízům typu Kahoot.`

const ADULTS_AUDIENCE = `
PRAVIDLA PRO DOSPĚLÉ (18–65 let) — TĚŽŠÍ NEŽ PRO JUNIORY:
- Otázky jsou NÁROČNĚJŠÍ než pro juniory: více souvislostí, přesnější rozlišení pojmů.
- Používej odbornější termíny tam, kde to dává smysl (bez zbytečné žargonové mlhy).
- U vědomostních a výukových otázek můžeš použít delší souvětí (orientačně 15–20 slov u hlavní věty otázky), pokud zůstane jedna jasná otázka.
- Nezjednodušuj na úroveň teenagerů — očekávej běžné znalosti dospělého publika.
- Příklad rozdílu: junior „Která planeta je největší?“ vs. dospělí „Která planeta sluneční soustavy má největší rovníkový průměr?“.`

const SENIORS_AUDIENCE = `
PRAVIDLA PRO SENIORY (65+) — STEJNÁ OBTÍŽNOST JAKO DOSPĚLÍ, JINÝ KONTEXT:
- Obtížnost faktů a souvislostí je STEJNÁ jako u dospělých — nezjednodušuj obsah kvůli věku.
- ZÁKAZ témat a odkazů na: internet, chytré telefony, sociální sítě, memy, streamovací služby, „virály“, moderní hry; filmy a seriály primárně po roce 2000 vynech, pokud nejde o notorietu všeobecné kultury.
- Vítaná témata: historie (zejm. česká a evropská do cca 1990), klasická literatura, zeměpis, příroda, tradiční řemesla, každodenní život minulých dekád.
- Příklady nevhodných otázek: „Co je TikTok?“, „Kdo vyhrál Eurovision 2024?“, „Jaký je nejnovější iPhone?“.
- Formulace klidné, srozumitelné; jedna hlavní myšlenka větou (u soutěžního režimu viz dodatek — bez nátlakových sloganů).`

const COMPETITIVE_JUNIORS = `
SOUTĚŽNÍ REŽIM — JUNIOŘI:
- Styl: Kahoot / rychlý kvíz. Můžeš občas použít nálady jako „Rychle!“ nebo označit 1–2 otázky v celém kvízu jako „Bonus!“ (stále ve stejném JSON formátu, bonus jen slovy v textu otázky).
- Časový limit v JSON nastav podle uživatelského zadání (typicky 10–12 s).
- Obtížnost střední; distraktory mohou být „chytáky“ na pozornost.`

const COMPETITIVE_ADULTS = `
SOUTĚŽNÍ REŽIM — DOSPĚLÍ:
- Styl: tvrdší hospodský / expertní kvíz. Můžeš použít formulace jako „Expertní otázka!“ nebo „Timeout!“.
- Čas kratší než u juniorů — limit v JSON podle zadání (typicky 8–10 s).
- Otázky náročnější, všechny čtyři možnosti mohou působit velmi pravděpodobně; menší tolerance „náhodné“ správné odpovědi — hráč musí opravdu vědět nebo rychle usoudit.
- Časový bonus (myšlenkově) má vyšší váhu než u juniorů — hráč odměň rychlou přesnou odpověď (stále fakticky přesné otázky).`

const COMPETITIVE_SENIORS = `
SOUTĚŽNÍ REŽIM — SENIOŘI:
- Klidný, důstojný tón — nepoužívej nátlakové slogany typu „Rychle!“.
- Stejná věcná obtížnost jako u dospělých, ale bez moderních témat (viz pravidla pro seniory výše).
- Časový limit v JSON podle zadání (typicky 20–30 s nebo déle — uživatel může zvolit delší kolo).
- Bez zdůrazňování časového bonusu v textu otázky; žádné „Bonusové body za rychlost!“ v znění otázky.`

function audienceRulesForGroup(targetGroup: TargetGroup): string {
  switch (targetGroup) {
    case 'kids':
      return KIDS_AUDIENCE
    case 'juniors':
      return JUNIORS_AUDIENCE
    case 'adults':
      return ADULTS_AUDIENCE
    case 'seniors':
      return SENIORS_AUDIENCE
    default:
      return ''
  }
}

function competitiveAddonForGroup(targetGroup: TargetGroup): string {
  switch (targetGroup) {
    case 'juniors':
      return COMPETITIVE_JUNIORS
    case 'adults':
      return COMPETITIVE_ADULTS
    case 'seniors':
      return COMPETITIVE_SENIORS
    default:
      return ''
  }
}

/**
 * Kompletní blok pro Gemini: základ kategorie + obtížnost/styl skupiny + případně soutěžní dodatek.
 */
export function getCategoryPrompt(category: string, targetGroup: string): string {
  const cat = category as QuizCategory
  const group = targetGroup as TargetGroup

  const base = getBaseCategoryPrompt(category)
  const audience = audienceRulesForGroup(group)
  const competitive =
    cat === 'competitive' ? competitiveAddonForGroup(group) : ''

  return [base, audience, competitive].filter((s) => s.trim().length > 0).join('\n\n')
}
