/**
 * Sdílená logika generování kvízu (prompt, schéma, volání Gemini, parsování).
 * Bez import.meta, vhodné pro Node (Vercel Function) i potenciální klienta.
 */
import type {
  GeneratedQuiz,
  QuizCategory,
  QuizConfiguration,
  QuizQuestion,
  QuizOptionsTuple,
  TargetGroup,
} from '../types'
import { quizOptionCountForConfig } from '@/lib/accessibility/handicapRules'
import { buildFallbackQuiz } from './categoryFallbacks'
import { clampCompetitiveTimeLimitSeconds } from './competitiveScoring'
import { compactThemeSummary } from './themeWizardOptions'
import { getQuestionCount } from './quizLength'
import {
  buildPromptEnrichment,
  FACTUAL_ACCURACY_RULES_CS,
} from '../services/promptBuilder'
import { quizPassesCategoryValidation } from './quizValidation'

export { categoryMatchRatio, validateQuizCategory, quizPassesCategoryValidation } from './quizValidation'

const CATEGORY_PROMPT_LABEL: Record<QuizCategory, string> = {
  knowledge: 'knowledge (Vědomostní)',
  educational: 'educational (Výukové)',
  fun: 'fun (Zábavné)',
  competitive: 'competitive (Soutěžní)',
}

const TARGET_PROMPT_LABEL: Record<TargetGroup, string> = {
  kids: 'kids (Děti 6–12 let)',
  juniors: 'juniors (Junioři 12–18 let)',
  adults: 'adults (Dospělí)',
  seniors: 'seniors (Senioři 65+)',
}

/**
 * System instrukce: role, pravidla kategorie/cílové skupiny, příklady, handicapy.
 */
export function buildSystemPrompt(config: QuizConfiguration): string {
  const category = config.category
  const targetGroup = config.targetGroup
  const h = new Set(config.handicaps.filter((x) => x !== 'none'))

  let prompt = `Jsi odborník na tvorbu kvízů. Tvoje úkolem je vygenerovat kvíz podle přesných pravidel.

KATEGORIE: ${CATEGORY_PROMPT_LABEL[category]}
CÍLOVÁ SKUPINA: ${TARGET_PROMPT_LABEL[targetGroup]}
${h.size ? `HANDICAPY (obsah otázek): ${[...h].join(', ')}` : ''}

PRAVIDLA PRO KATEGORII:`

  if (category === 'fun') {
    prompt += `
- Každá otázka musí být vtipná, hravá; použij emotikony (např. 🎉 😂 🕺 nebo jiné vhodné).
- Špatné odpovědi mohou být směšné nebo absurdní, ne jen stroze chybné.
- Příklad (děti, téma zvířata):
  „Které zvíře by vyhrálo soutěž v nejhlasitějším řevu? 🦁 A) Lev B) Myš C) Žirafa D) Lenochod“
- Příklad (dospělí, technologie):
  „Proč programátoři často vtipkují o ‚debugování‘ narozenin? A) Bojí se čísel B) Radši řeší chyby v kódu C) Nemají kolegy D) Slaví vznik repozitáře“`
  }

  if (category === 'educational') {
    prompt += `
- Každá otázka má hráče něčemu naučit. Vysvětlení musí být poučné (2–3 věty s konkrétním faktem).
- Často použij vstup ve stylu „Věděl/a jsi, že …?“ nebo „Víš, že …?“.
- Příklad (senioři, bylinky):
  „Věděl/a jsi, která bylinka se tradičně spojuje s uklidněním před spánkem? A) Máta B) Levandule C) Třezalka D) Šalvěj“
  Vysvětlení: „Levandule bývá spojována s uklidňující vůní; lidové zvyky ji dlouho používaly při večerním odpočinku (účinky individuální).“`
  }

  if (category === 'knowledge') {
    prompt += `
- Testuj skutečné znalosti. Otázky přímé, faktické, bez vtipů a nadsázky (kromě výslovného zadání pro děti u zábavy).
- Vysvětlení: stručně jedna až dvě věty se správným faktem.
- Příklad (junioři, historie):
  „Ve kterém roce začala první světová válka? A) 1912 B) 1914 C) 1916 D) 1918“
  Vysvětlení: „První světová válka vypukla v roce 1914 po atentátu na následníka trůnu Františka Ferdinanda d’Este v Sarajevu.“`
  }

  if (category === 'competitive') {
    prompt += `
- Tvrdší, stručné otázky jako v televizní nebo kvízové soutěži.
- Používej výzvy a napětí (např. „Rychle!“, „Bonusová otázka!“, „Co nastane jako první?“) — u seniorů viz dodatek níže.
- Vysvětlení může být o něco delší (3–4 věty) a obsahovat zajímavost.
- Příklad (dospělí, chemie/domácnost):
  „Rychle! Co typicky nastane hned po smíchání jedlé sody s octem? A) Uvolní se hodně tepla B) Rychle vznikne pěna CO₂ C) Změní se barva na modrou D) Exploze jako z filmu“
  Vysvětlení: „Nejprve vzniká pěna kvůli uvolnění oxidu uhličitého (neutralizace). Zajímavost: podobný princip využívají některé hasicí přístroje.“`
  }

  if (category === 'competitive' && targetGroup === 'seniors') {
    prompt += `
- SENIOŘI + SOUTĚŽ: nepoužívej agresivní „Rychle!“ ani nátlak; klidné věty („Zamyslete se“, „Která odpověď je správná?“). Stejná věcná náročnost jako dospělí.`
  }

  if (targetGroup === 'kids') {
    prompt += `\n- Děti 6–12 let: krátké věty (max 8 slov v otázce), jednoduchá slova; u zábavy hodně emotikonů; žádné negace a chytáky na zápor.`
  } else if (targetGroup === 'juniors') {
    prompt += `\n- Junioři 12–18 let: střední obtížnost, popkulturní reference povoleny (kulturně vhodně).`
  } else if (targetGroup === 'adults') {
    prompt += `\n- Dospělí: náročnější otázky, delší souvětí povolena, odbornější termíny tam, kde dává smysl.`
  } else if (targetGroup === 'seniors') {
    prompt += `\n- Senioři 65+: stejná obtížnost faktů jako dospělí, ale bez moderních odkazů (mobily, sociální sítě, memy, streamování). Témata 1950–1990 vítána.`
  }

  const handicapLines: string[] = []
  if (h.has('cognitive_dementia')) {
    handicapLines.push(
      'Kognitivní demence: max 10 slov na otázku, žádné negace, přesně 3 odpovědi v JSON, žádný časový tlak v textu.'
    )
  }
  if (h.has('dyslexia')) {
    handicapLines.push(
      'Dyslexie: vyhni se slovům s podobnými tvary (být/byt); žádná slova se 3+ souhláskami v řadě; krátké věty.'
    )
  }
  if (h.has('visual_impairment')) {
    handicapLines.push(
      'Zrakové postižení: otázky musí dávat smysl bez obrázků; žádné „podívej se na obrázek“.'
    )
  }
  if (h.has('hearing_impairment')) {
    handicapLines.push(
      'Sluchové postižení: žádné otázky o zvucích; žádné „poslechni si“.'
    )
  }
  if (h.has('autism_spectrum')) {
    handicapLines.push(
      'PAS: doslovný jazyk, žádné metafory, jednoznačné otázky a odpovědi.'
    )
  }
  if (h.has('czech_learners')) {
    handicapLines.push(
      'Cizinci A1–A2: převážně přítomný čas, základní slova, max 5 slov na otázku.'
    )
  }
  if (handicapLines.length) {
    prompt += `\n\nPŘÍSTUPNOST:\n- ${handicapLines.join('\n- ')}`
  }

  prompt += `\n\nDodržuj přesně výše uvedená pravidla. Hráčský text v češtině; pole imageContextPrompt výhradně krátce anglicky (atmosféra bez spoileru). Generuj výstup jako JSON podle schématu.`

  return prompt
}

const STRICT_RETRY_USER_SUFFIX = `

=== DODATEČNÝ POKUS (PŘÍSNĚJI) ===
Předchozí výstup nesplnil automatickou kontrolu stylu kategorie. Nyní striktně dodrž KATEGORII a CÍLOVOU SKUPINU ze system instrukce včetně příkladů. Každá otázka musí stylisticky odpovídat zvolenému režimu (zábava = emotikony/vtip; vědomostní = střídmě a fakticky; výukové = poučné vysvětlení; soutěžní = stručná výzva).`

export function buildUserPrompt(config: QuizConfiguration): string {
  const today = new Date().toISOString().slice(0, 10)
  const questionCount = getQuestionCount(config.quizLength)
  const optionCount = quizOptionCountForConfig(config)
  const maxIdx = optionCount - 1
  const competitiveLimit = clampCompetitiveTimeLimitSeconds(
    config.competitiveTimeLimitSeconds,
    config.targetGroup
  )
  const competitiveJsonExtra =
    config.category === 'competitive'
      ? `

DODATEK JSON PRO SOUTĚŽNÍ REŽIM:
- U každé otázky v poli "questions" musí být číslo "timeLimit" (sekundy na zodpovězení). Použij u všech otázek stejnou hodnotu: ${competitiveLimit}.
- "questionText" u každé otázky ne delší než 100 znaků; jednoduché znění bez složitých souvětí.`
      : ''
  return `Dnešní datum (pro sezónní témata): ${today}.

${buildPromptEnrichment(config)}
${competitiveJsonExtra}

=== ÚKOL (USER) ===
Vytvoř jeden kvíz v češtině. Výstup musí přesně odpovídat JSON schématu (žádný text mimo JSON).

Požadavky na obsah:
- Přesně ${questionCount} otázek v poli "questions". Každá má jiné znění, žádné duplicity ani opakování stejného faktu.
- Téma obsahu: ${compactThemeSummary(config)}
- Kategorie, cílová skupina, styl a příklady: viz system instrukce. Doplňkový tón a formát: v sekcích výše (persona, formát otázek, přístupnost).
- Přístupnost: striktní pravidla v sekci „PRAVIDLA PŘÍSTUPNOSTI“ — dodrž je včetně počtu možností v poli "options".
- Každá otázka má přesně ${optionCount} řetězců v poli "options".
- "correctAnswerIndex" je vždy celé číslo od 0 do ${maxIdx} (index správné možnosti). Správná odpověď musí být náhodně rozložena mezi otázkami (používej všechny platné indexy, nepreferuj pořád stejný).
- "id" u otázek: q1, q2, … až q${questionCount} (povinné pole v JSON).
- V textech otázek a odpovědí žádné URL ani odkazy, pouze běžný text v češtině.
- Každá otázka MUSÍ mít povinné pole "imageContextPrompt" přesně podle sekce PRAVIDLO PRO OBRÁZKY výše (anglicky, krátká fráze pro vyhledání ilustrace bez spoileru).
- JSON struktura každé položky v "questions": id, questionText, options (${optionCount} řetězců), correctAnswerIndex, explanation, imageContextPrompt${
    config.category === 'competitive' ? ', timeLimit (celé číslo, sekundy)' : ''
  }.
- Striktně dodržuj sekci FAKTICKÁ PŘESNOST výše i v system instrukci: správná odpověď i distraktory musí být logicky konzistentní; žádné halucinované „fakta“.`
}

/** Teplota a top_p podle kategorie (Gemini 2.5 Flash); vlastní téma mírně snižuje teplotu. */
export function quizGenerationSamplingConfig(config: QuizConfiguration): {
  temperature: number
  topP: number
} {
  const byCategory: Record<
    QuizCategory,
    { temperature: number; topP: number }
  > = {
    knowledge: { temperature: 0.2, topP: 0.9 },
    educational: { temperature: 0.3, topP: 0.9 },
    fun: { temperature: 0.7, topP: 0.95 },
    competitive: { temperature: 0.5, topP: 0.9 },
  }
  let { temperature, topP } = byCategory[config.category]
  if (config.theme === 'custom') {
    temperature = Math.min(temperature, 0.35)
    topP = Math.min(topP, 0.9)
  }
  return { temperature, topP }
}

/** @deprecated Použij `quizGenerationSamplingConfig`. */
export function quizGenerationTemperature(config: QuizConfiguration): number {
  return quizGenerationSamplingConfig(config).temperature
}

/**
 * Minimální JSON Schema pro Gemini, bez min/max délky polí a bez minimum/maximum u čísel.
 * Přesný počet otázek a počet možností (3 nebo 4) validuje `parseGeneratedQuiz` (jinak API 400:
 * „schema produces a constraint that has too many states“).
 */
export function quizResponseJsonSchema(
  _questionCount: number,
  optionCount: 3 | 4,
  category: QuizConfiguration['category']
): Record<string, unknown> {
  const required: string[] = [
    'id',
    'questionText',
    'options',
    'correctAnswerIndex',
    'explanation',
    'imageContextPrompt',
  ]
  if (category === 'competitive') {
    required.push('timeLimit')
  }
  const qItem = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      questionText: { type: 'string' },
      options: {
        type: 'array',
        minItems: optionCount,
        maxItems: optionCount,
        items: { type: 'string' },
      },
      correctAnswerIndex: { type: 'integer' },
      explanation: { type: 'string' },
      imageContextPrompt: { type: 'string' },
      timeLimit: { type: 'integer' },
    },
    required,
  }
  const quizShape = {
    type: 'object',
    properties: {
      title: { type: 'string' },
      questions: {
        type: 'array',
        items: qItem,
      },
    },
    required: ['title', 'questions'],
  } as const
  const errorShape = {
    type: 'object',
    properties: {
      error: { type: 'string' },
    },
    required: ['error'],
  } as const
  return {
    anyOf: [errorShape, quizShape],
  }
}

function extractJsonObject(text: string): string {
  const t = text.trim()
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t)
  if (fence) return fence[1].trim()
  return t
}

function normalizeQuestion(
  q: unknown,
  index: number,
  optionCount: 3 | 4
): QuizQuestion | null {
  if (!q || typeof q !== 'object') return null
  const o = q as Record<string, unknown>
  const id = typeof o.id === 'string' ? o.id : `q${index + 1}`
  const questionText =
    typeof o.questionText === 'string' ? o.questionText.trim() : ''
  const explanation =
    typeof o.explanation === 'string' ? o.explanation.trim() : ''
  const options = o.options
  if (!Array.isArray(options) || options.length !== optionCount) return null
  if (!options.every((x) => typeof x === 'string' && x.trim().length > 0))
    return null
  const idx = o.correctAnswerIndex
  const maxI = optionCount - 1
  if (
    typeof idx !== 'number' ||
    idx < 0 ||
    idx > maxI ||
    !Number.isInteger(idx)
  )
    return null
  if (!questionText) return null
  const imageRaw =
    typeof o.imageContextPrompt === 'string'
      ? o.imageContextPrompt.trim()
      : typeof o.mediaSearchHint === 'string'
        ? o.mediaSearchHint.trim()
        : ''
  if (!imageRaw) return null
  const imageContextPrompt = imageRaw.slice(0, 200)
  let timeLimit: number | undefined
  if (typeof o.timeLimit === 'number' && Number.isInteger(o.timeLimit)) {
    if (o.timeLimit >= 5 && o.timeLimit <= 120) timeLimit = o.timeLimit
  }
  const trimmed = options.map((s) => String(s).trim()) as QuizOptionsTuple
  return {
    id,
    questionText,
    options: trimmed,
    correctAnswerIndex: idx,
    explanation: explanation || 'Správná odpověď odpovídá zadání.',
    imageContextPrompt,
    ...(timeLimit !== undefined ? { timeLimit } : {}),
  }
}

/** Náhodně zamíchá pořadí možností, aby model neměl bias na „vždy A“ (index 0). */
function shuffleQuestionOptions(question: QuizQuestion): QuizQuestion {
  const tagged = question.options.map((text, i) => ({
    text,
    correct: i === question.correctAnswerIndex,
  }))
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tagged[i], tagged[j]] = [tagged[j], tagged[i]]
  }
  const correctAnswerIndex = tagged.findIndex((t) => t.correct)
  const opts = tagged.map((t) => t.text) as QuizOptionsTuple
  return {
    ...question,
    options: opts,
    correctAnswerIndex,
  }
}

export function parseGeneratedQuiz(
  raw: unknown,
  expectedQuestionCount: number,
  optionCount: 3 | 4
): GeneratedQuiz {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Neplatná odpověď AI (není objekt).')
  }
  const o = raw as Record<string, unknown>
  const title = typeof o.title === 'string' ? o.title.trim() : ''
  const questionsRaw = o.questions
  if (!Array.isArray(questionsRaw) || questionsRaw.length === 0) {
    throw new Error('Neplatná odpověď AI (chybí otázky).')
  }
  if (questionsRaw.length !== expectedQuestionCount) {
    throw new Error(
      `AI vrátila ${questionsRaw.length} otázek, očekáváno přesně ${expectedQuestionCount}. Zkuste znovu nebo zvolte kratší kvíz.`
    )
  }
  const questions: QuizQuestion[] = []
  for (let i = 0; i < questionsRaw.length; i++) {
    const nq = normalizeQuestion(questionsRaw[i], i, optionCount)
    if (!nq) {
      throw new Error(`Neplatná otázka č. ${i + 1} ve struktuře AI.`)
    }
    questions.push(
      shuffleQuestionOptions({ ...nq, id: `q${i + 1}` })
    )
  }
  if (!title) {
    throw new Error('Neplatná odpověď AI (chybí název kvízu).')
  }
  return { title, questions }
}

function applyCompetitiveTimeLimits(
  config: QuizConfiguration,
  quiz: GeneratedQuiz
): GeneratedQuiz {
  if (config.category !== 'competitive') return quiz
  const lim = clampCompetitiveTimeLimitSeconds(
    config.competitiveTimeLimitSeconds,
    config.targetGroup
  )
  return {
    ...quiz,
    questions: quiz.questions.map((q) => ({ ...q, timeLimit: lim })),
  }
}

type GeminiGenerateResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
    finishReason?: string
  }>
  error?: { message?: string; code?: number; status?: string }
}

function textFromGeminiResponse(data: GeminiGenerateResponse): string {
  const parts = data.candidates?.[0]?.content?.parts ?? []
  const texts = parts
    .map((p) => p.text)
    .filter((t): t is string => typeof t === 'string' && t.length > 0)
  if (texts.length === 0) {
    throw new Error('Prázdná odpověď od Gemini (žádný text).')
  }
  const jsonLike = texts.find((t) => t.trimStart().startsWith('{'))
  return jsonLike ?? texts[texts.length - 1]
}

export function maxOutputTokensForQuiz(questionCount: number): number {
  if (questionCount <= 15) return 16_384
  if (questionCount <= 25) return 32_768
  return 65_536
}

export interface GeminiCallOpts {
  apiKey: string
  model?: string
}

function buildGeminiSystemInstruction(config: QuizConfiguration): string {
  const header = `Jsi faktický generátor kvízů. Tvá pravidla jsou absolutní:

Odpovídej POUZE na základě ověřitelných faktů.

Pokud o zadaném tématu nemáš v trénovacích datech dostatek konkrétních detailů (jména, data, místa), odmítni otázku vygenerovat a vrať JSON s error hláškou — jediný objekt s povinným polem "error" (řetězec v češtině), bez kvízu.

Nikdy si nevymýšlej fiktivní jména nebo události, i kdyby to vypadalo uvěřitelně.

Když kvíz vygeneruješ, odpověz výhradně strukturovaným JSON podle zadaného schématu. Veškerý obsah pro hráče piš v češtině; pole imageContextPrompt je výjimka, pouze krátký anglický popis bezpečné ilustrace (atmosféra bez spoileru), nikdy česky.`

  return [header, buildSystemPrompt(config), FACTUAL_ACCURACY_RULES_CS].join(
    '\n\n'
  )
}

/**
 * Volitelné thinking, jen když je `GEMINI_THINKING_BUDGET` číslo (např. 0).
 * Výchozí je vynechat, protože u modelů bez „thinking“ API jinak vrací 400.
 */
function geminiThinkingConfigFromEnv():
  | { thinkingConfig: { thinkingBudget: number } }
  | Record<string, never> {
  if (typeof process === 'undefined') return {}
  const raw = process.env.GEMINI_THINKING_BUDGET?.trim()
  if (!raw) return {}
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n)) return {}
  return { thinkingConfig: { thinkingBudget: n } }
}

/**
 * Volá Gemini a vrátí naparsovaný kvíz **bez** obohacení o média.
 */
export async function generateQuizFromGemini(
  config: QuizConfiguration,
  opts: GeminiCallOpts
): Promise<GeneratedQuiz> {
  const apiKey = opts.apiKey.trim()
  if (!apiKey) {
    throw new Error('Chybí API klíč pro Gemini.')
  }

  const questionCount = getQuestionCount(config.quizLength)
  const optionCount = quizOptionCountForConfig(config)
  const model = (opts.model?.trim() || 'gemini-2.5-flash')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`

  const baseSampling = quizGenerationSamplingConfig(config)
  const strictSampling = {
    temperature: Math.max(0.12, baseSampling.temperature * 0.82),
    topP: Math.min(0.88, Math.max(0.5, baseSampling.topP - 0.05)),
  }

  async function fetchAndParseQuiz(
    userText: string,
    sampling: { temperature: number; topP: number }
  ): Promise<GeneratedQuiz> {
    const body = {
      systemInstruction: {
        parts: [{ text: buildGeminiSystemInstruction(config) }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userText }],
        },
      ],
      generationConfig: {
        temperature: sampling.temperature,
        topP: sampling.topP,
        maxOutputTokens: maxOutputTokensForQuiz(questionCount),
        responseMimeType: 'application/json',
        responseJsonSchema: quizResponseJsonSchema(
          questionCount,
          optionCount,
          config.category
        ),
        ...geminiThinkingConfigFromEnv(),
      },
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(body),
    })

    const data = (await res.json()) as GeminiGenerateResponse

    if (!res.ok) {
      const msg = data.error?.message || res.statusText
      throw new Error(`Gemini API (${res.status}): ${msg}`)
    }

    const finishReason = data.candidates?.[0]?.finishReason
    if (finishReason === 'SAFETY') {
      throw new Error(
        'Gemini zablokovala odpověď (bezpečnostní filtry). Zkus upravit téma nebo kategorii.'
      )
    }
    if (finishReason === 'MAX_TOKENS') {
      throw new Error(
        'Odpověď modelu se uřízla (příliš dlouhý výstup). Zvolte kratší kvíz nebo zkuste generování znovu.'
      )
    }

    const rawText = textFromGeminiResponse(data)
    let parsed: unknown
    try {
      parsed = JSON.parse(extractJsonObject(rawText))
    } catch {
      throw new Error('Gemini nevrátila platný JSON.')
    }

    if (parsed && typeof parsed === 'object') {
      const err = (parsed as Record<string, unknown>).error
      if (typeof err === 'string' && err.trim()) {
        throw new Error(err.trim())
      }
    }

    return parseGeneratedQuiz(parsed, questionCount, optionCount)
  }

  let quiz = await fetchAndParseQuiz(buildUserPrompt(config), baseSampling)

  if (
    quizPassesCategoryValidation(quiz, config.category, config.targetGroup)
  ) {
    return applyCompetitiveTimeLimits(config, quiz)
  }

  try {
    quiz = await fetchAndParseQuiz(
      buildUserPrompt(config) + STRICT_RETRY_USER_SUFFIX,
      strictSampling
    )
  } catch {
    return applyCompetitiveTimeLimits(
      config,
      buildFallbackQuiz(config, questionCount)
    )
  }

  if (
    quizPassesCategoryValidation(quiz, config.category, config.targetGroup)
  ) {
    return applyCompetitiveTimeLimits(config, quiz)
  }

  return applyCompetitiveTimeLimits(
    config,
    buildFallbackQuiz(config, questionCount)
  )
}
