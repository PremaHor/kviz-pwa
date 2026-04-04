/**
 * Sdílená logika generování kvízu (prompt, schéma, volání Gemini, parsování).
 * Bez import.meta — vhodné pro Node (Vercel Function) i potenciální klienta.
 */
import type { GeneratedQuiz, QuizConfiguration, QuizQuestion } from '../types'
import { getQuestionCount } from './quizLength'
import { buildPromptEnrichment } from '../services/promptBuilder'

const THEME_CS: Record<QuizConfiguration['theme'], string> = {
  seasonal: 'Sezónní (roční období, svátky, tradice v daném roce)',
  animals: 'Zvířata a příroda',
  general: 'Všeobecné znalosti',
  science: 'Věda a technika',
  pop_culture: 'Popkultura, film, hudba, seriály',
}

const CATEGORY_CS: Record<QuizConfiguration['category'], string> = {
  knowledge: 'Vědomostní — ověření faktů a znalostí',
  educational: 'Výukové — vysvětlení pojmů, naučný tón',
  fun: 'Zábavné — lehký tón, zajímavosti',
  competitive: 'Soutěžní — jasné znění, vhodné pro rychlé rozhodování',
}

const TARGET_CS: Record<QuizConfiguration['targetGroup'], string> = {
  kids: 'Děti (cca 6–10 let) — jednoduchá slova, konkrétní příklady',
  juniors: 'Junioři / mladší teenageři — střední obtížnost',
  adults: 'Dospělí — běžná obtížnost',
  seniors: 'Senioři — srozumitelné věty, klidné tempo, konkrétní kontext',
}

function accessibilityHints(handicaps: QuizConfiguration['handicaps']): string {
  const parts: string[] = []
  const h = new Set(handicaps.filter((x) => x !== 'none'))
  if (h.has('visual_impairment')) {
    parts.push(
      'Zrakové postižení: neodkazuj na „co vidíš“, barvy jako jediný rozdíl ani na obrázky; vše musí být srozumitelné pouze z textu.'
    )
  }
  if (h.has('dyslexia')) {
    parts.push(
      'Dyslexie: krátké věty, jednoduchá souvětí, běžná slova, vyhni se složitému pravopisu u nesmyslných slov.'
    )
  }
  if (h.has('motor_skills')) {
    parts.push('Motorika: krátké texty u možností odpovědí.')
  }
  if (h.has('cognitive')) {
    parts.push(
      'Kognitivní zátěž: jedna jasná informace v otázce, nepřekombinované znění, jednoznačné odpovědi.'
    )
  }
  if (h.has('dementia')) {
    parts.push(
      'Demence: velmi prostá slova, konkrétní a pozitivní tón, žádné abstraktní hádanky, krátké otázky.'
    )
  }
  if (parts.length === 0) {
    return 'Bez speciálních požadavků na přístupnost (standardní text).'
  }
  return parts.join('\n')
}

export function buildUserPrompt(config: QuizConfiguration): string {
  const today = new Date().toISOString().slice(0, 10)
  const questionCount = getQuestionCount(config.quizLength)
  return `Dnešní datum (pro sezónní témata): ${today}.

${buildPromptEnrichment(config)}

Vytvoř jeden kvíz v češtině. Výstup musí přesně odpovídat JSON schématu (žádný text mimo JSON).

Požadavky na obsah:
- Přesně ${questionCount} otázek v poli "questions" — každá má jiné znění, žádné duplicity ani opakování stejného faktu.
- Téma obsahu: ${THEME_CS[config.theme]}
- Styl: ${CATEGORY_CS[config.category]}
- Cílová skupina: ${TARGET_CS[config.targetGroup]}
- Přístupnost:
${accessibilityHints(config.handicaps)}
- Každá otázka má přesně 4 řetězce v "options".
- "correctAnswerIndex" je 0, 1, 2 nebo 3 — index správné možnosti.
- "id" u otázek: q1, q2, … až q${questionCount}.
- V textech otázek a odpovědí žádné URL ani odkazy — pouze běžný text v češtině.
- U každé otázky musí být "mediaSearchHint": 2 až 8 anglických slov popisujících hlavní vizuální motiv pro ilustraci (konkrétní věc, místo, živočich, předmět nebo známá osoba z kontextu otázky). Pouze písmena anglické abecedy, čísla a mezery — žádná čeština, žádná celá věta, žádné uvozové věty. Musí úzce souviset s obsahem otázky (typicky klíčové slovo ze správné odpovědi nebo z jejího znění). Příklady: "red squirrel", "Charles Bridge Prague", "volleyball net beach".
- Odpovědi ať jsou fakticky správné a v souladu s tématem.`
}

export function quizResponseJsonSchema(
  questionCount: number
): Record<string, unknown> {
  const qItem = {
    type: 'object',
    properties: {
      id: { type: 'string', description: 'Identifikátor otázky, např. q1' },
      questionText: { type: 'string' },
      options: {
        type: 'array',
        items: { type: 'string' },
        minItems: 4,
        maxItems: 4,
      },
      correctAnswerIndex: {
        type: 'integer',
        minimum: 0,
        maximum: 3,
      },
      explanation: { type: 'string' },
      mediaSearchHint: {
        type: 'string',
        description:
          '2-8 English words: concrete visual subject for image search only, ASCII letters/digits/spaces, tied to question topic.',
      },
    },
    required: [
      'id',
      'questionText',
      'options',
      'correctAnswerIndex',
      'explanation',
      'mediaSearchHint',
    ],
  }
  return {
    type: 'object',
    properties: {
      title: { type: 'string' },
      questions: {
        type: 'array',
        items: qItem,
        minItems: questionCount,
        maxItems: questionCount,
      },
    },
    required: ['title', 'questions'],
  }
}

function extractJsonObject(text: string): string {
  const t = text.trim()
  const fence = /^```(?:json)?\s*([\s\S]*?)```$/m.exec(t)
  if (fence) return fence[1].trim()
  return t
}

function normalizeQuestion(q: unknown, index: number): QuizQuestion | null {
  if (!q || typeof q !== 'object') return null
  const o = q as Record<string, unknown>
  const id = typeof o.id === 'string' ? o.id : `q${index + 1}`
  const questionText =
    typeof o.questionText === 'string' ? o.questionText.trim() : ''
  const explanation =
    typeof o.explanation === 'string' ? o.explanation.trim() : ''
  const options = o.options
  if (!Array.isArray(options) || options.length !== 4) return null
  if (!options.every((x) => typeof x === 'string' && x.trim().length > 0))
    return null
  const idx = o.correctAnswerIndex
  if (typeof idx !== 'number' || idx < 0 || idx > 3 || !Number.isInteger(idx))
    return null
  if (!questionText) return null
  const hintRaw =
    typeof o.mediaSearchHint === 'string' ? o.mediaSearchHint.trim() : ''
  const mediaSearchHint =
    hintRaw.length > 0 ? hintRaw.slice(0, 120) : undefined
  return {
    id,
    questionText,
    options: options.map((s) => String(s).trim()) as [
      string,
      string,
      string,
      string,
    ],
    correctAnswerIndex: idx,
    explanation: explanation || 'Správná odpověď odpovídá zadání.',
    ...(mediaSearchHint ? { mediaSearchHint } : {}),
  }
}

export function parseGeneratedQuiz(
  raw: unknown,
  expectedQuestionCount: number
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
    const nq = normalizeQuestion(questionsRaw[i], i)
    if (!nq) {
      throw new Error(`Neplatná otázka č. ${i + 1} ve struktuře AI.`)
    }
    questions.push({ ...nq, id: `q${i + 1}` })
  }
  if (!title) {
    throw new Error('Neplatná odpověď AI (chybí název kvízu).')
  }
  return { title, questions }
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

/**
 * Volitelné thinking — jen když je `GEMINI_THINKING_BUDGET` číslo (např. 0).
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
  const model = (opts.model?.trim() || 'gemini-2.5-flash')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`

  const body = {
    systemInstruction: {
      parts: [
        {
          text: 'Jsi generátor vzdělávacích kvízů. Odpovídáš výhradně strukturovaným JSON podle zadaného schématu a pokynů uživatele. Veškerý obsah pro hráče piš v češtině; pole mediaSearchHint je výjimka — pouze krátká anglická fráze pro vyhledání ilustrace, nikdy česky.',
        },
      ],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: buildUserPrompt(config) }],
      },
    ],
    generationConfig: {
      temperature: 0.65,
      maxOutputTokens: maxOutputTokensForQuiz(questionCount),
      responseMimeType: 'application/json',
      responseJsonSchema: quizResponseJsonSchema(questionCount),
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

  return parseGeneratedQuiz(parsed, questionCount)
}
