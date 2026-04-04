import type { GeneratedQuiz, QuizConfiguration, QuizQuestion, QuizMedia } from '../types'

const COMMONS_API = 'https://commons.wikimedia.org/w/api.php'

const THEME_FALLBACK_EN: Record<QuizConfiguration['theme'], string> = {
  seasonal: 'season holiday nature',
  animals: 'wild animals nature',
  general: 'landmark culture',
  science: 'science laboratory nature',
  pop_culture: 'cinema music concert',
}

/** Krátké české/slovní spojky — ořez dotazu bez AI. */
const STOP_WORDS = new Set([
  'jak',
  'co',
  'kdy',
  'kde',
  'kdo',
  'proč',
  'že',
  'je',
  'jsou',
  'byl',
  'byla',
  'být',
  'tím',
  'pro',
  'na',
  'v',
  've',
  'z',
  'ze',
  'do',
  'od',
  'po',
  'za',
  'o',
  'u',
  'i',
  'a',
  'nebo',
  'ani',
  'který',
  'která',
  'které',
  'jaký',
  'jaká',
  'jaké',
  'kolik',
  'mezi',
  'aby',
])

export type MediaEnrichmentRuntime = {
  /** `false` = žádné dotazy Commons/Pexels */
  enabled: boolean
  /** Volitelný Pexels klíč (na klientovi zůstává prázdné — Pexels jen na serveru). */
  pexelsApiKey?: string
}

function defaultClientMediaRuntime(): MediaEnrichmentRuntime {
  let enabled = true
  try {
    const viteEnv = (
      import.meta as ImportMeta & { env?: { VITE_QUIZ_MEDIA?: string } }
    ).env
    if (viteEnv != null) {
      enabled = viteEnv.VITE_QUIZ_MEDIA !== '0'
    }
  } catch {
    /* Node / nevite bundlování — média zapnuta */
  }
  return {
    enabled,
    pexelsApiKey: undefined,
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

function sanitizeMediaSearchHint(raw: string): string | null {
  const t = raw
    .replace(/[^a-zA-Z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100)
  if (t.length < 2) return null
  return t
}

/** Záložní dotaz bez hintu od modelu: český text otázky + správná možnost. */
function buildHeuristicMediaQuery(
  q: QuizQuestion,
  theme: QuizConfiguration['theme']
): string {
  const normalized = q.questionText
    .replace(/[?!.:;,""""''()[\]{}«»]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const words = normalized
    .split(' ')
    .map((w74) => w74.trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()))

  const fromQuestion = words.slice(0, 6).join(' ')

  const correct = String(q.options[q.correctAnswerIndex] ?? '')
    .replace(/[?!.:;,]/g, ' ')
    .trim()
  const correctWords = correct
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()))
  const fromCorrect = correctWords.slice(0, 4).join(' ')

  const merged = [fromQuestion, fromCorrect].filter(Boolean).join(' ').trim()
  const uniqueWords = [...new Set(merged.split(/\s+/).filter(Boolean))]
  let query =
    uniqueWords.length > 0 ? uniqueWords.join(' ') : THEME_FALLBACK_EN[theme]

  if (query.length < 2) {
    query = THEME_FALLBACK_EN[theme]
  }

  return query.slice(0, 100)
}

type CommonsPage = {
  title?: string
  imageinfo?: Array<{
    url?: string
    thumburl?: string
    mime?: string
    descriptionurl?: string
  }>
}

type CommonsQueryResponse = {
  query?: { pages?: Record<string, CommonsPage> }
}

function pickCommonsMedia(page: CommonsPage): QuizMedia | null {
  const info = page.imageinfo?.[0]
  if (!info?.url || !info.mime) return null
  const mime = info.mime.toLowerCase()
  const title = (page.title ?? '').replace(/^file:/i, '').trim()
  const alt =
    title.length > 0
      ? `Ilustrace k otázce: ${title.replace(/_/g, ' ')}`
      : 'Ilustrace z Wikimedia Commons'

  if (mime.startsWith('video/')) {
    return {
      kind: 'video',
      url: info.url,
      alt,
      mime,
      sourceLabel: 'Wikimedia Commons',
      sourceUrl: info.descriptionurl,
    }
  }

  if (!mime.startsWith('image/')) return null

  const displayUrl = info.thumburl || info.url
  return {
    kind: 'image',
    url: info.url,
    displayUrl,
    alt,
    sourceLabel: 'Wikimedia Commons',
    sourceUrl: info.descriptionurl,
  }
}

function parseCommonsBody(data: unknown): QuizMedia | null {
  const pages = (data as CommonsQueryResponse).query?.pages
  if (!pages) return null
  for (const p of Object.values(pages)) {
    if (!p?.title) continue
    const lower = p.title.toLowerCase()
    if (
      lower.endsWith('.pdf') ||
      lower.endsWith('.djvu') ||
      lower.endsWith('.mid') ||
      lower.endsWith('.oga')
    ) {
      continue
    }
    const media = pickCommonsMedia(p)
    if (media) return media
  }
  return null
}

async function fetchCommonsMedia(search: string): Promise<QuizMedia | null> {
  const trimmed = search.trim()
  if (!trimmed) return null

  const url = new URL(COMMONS_API)
  url.searchParams.set('action', 'query')
  url.searchParams.set('format', 'json')
  url.searchParams.set('origin', '*')
  url.searchParams.set('generator', 'search')
  url.searchParams.set('gsrsearch', trimmed)
  url.searchParams.set('gsrnamespace', '6')
  url.searchParams.set('gsrlimit', '12')
  url.searchParams.set('prop', 'imageinfo')
  url.searchParams.set('iiprop', 'url|mime|thumburl|extmetadata')
  url.searchParams.set('iiurlwidth', '960')

  const res = await fetch(url.toString())
  if (res.status === 429) {
    await sleep(900)
    const res2 = await fetch(url.toString())
    if (!res2.ok) return null
    return parseCommonsBody(await res2.json())
  }
  if (!res.ok) return null
  return parseCommonsBody(await res.json())
}

type PexelsResponse = {
  photos?: Array<{
    alt?: string
    src?: { large?: string; medium?: string }
    photographer?: string
    photographer_url?: string
    url?: string
  }>
}

async function fetchPexelsMedia(
  search: string,
  apiKey: string
): Promise<QuizMedia | null> {
  const key = apiKey.trim()
  if (!key || !search.trim()) return null

  const u = new URL('https://api.pexels.com/v1/search')
  u.searchParams.set('query', search.slice(0, 80))
  u.searchParams.set('per_page', '1')
  u.searchParams.set('locale', 'cs-CZ')

  const res = await fetch(u.toString(), {
    headers: { Authorization: key },
  })
  if (!res.ok) return null
  const data = (await res.json()) as PexelsResponse
  const ph = data.photos?.[0]
  if (!ph) return null
  const displayUrl = ph.src?.large ?? ph.src?.medium
  if (!displayUrl) return null
  const photographer = ph.photographer?.trim() ?? 'neznámý autor'
  const alt =
    (ph.alt && ph.alt.trim().length > 0
      ? ph.alt.trim()
      : `Fotografie k otázce (${photographer})`) || 'Fotografie z Pexels'

  return {
    kind: 'image',
    url: displayUrl,
    displayUrl,
    alt,
    sourceLabel: `Pexels · ${photographer}`,
    sourceUrl: ph.url,
  }
}

async function resolveMediaForQuestion(
  q: QuizQuestion,
  config: QuizConfiguration,
  runtime: MediaEnrichmentRuntime
): Promise<QuizMedia | null> {
  const preferPexelsFirst = Boolean(runtime.pexelsApiKey?.trim())

  const tryPexels = async (s: string) =>
    fetchPexelsMedia(s, runtime.pexelsApiKey ?? '')
  const tryCommons = async (s: string) => fetchCommonsMedia(s)

  async function tryProviders(search: string): Promise<QuizMedia | null> {
    if (preferPexelsFirst) {
      return (
        (await tryPexels(search)) ?? (await tryCommons(search))
      )
    }
    return (
      (await tryCommons(search)) ?? (await tryPexels(search))
    )
  }

  const hint =
    q.mediaSearchHint != null && q.mediaSearchHint.length > 0
      ? sanitizeMediaSearchHint(q.mediaSearchHint)
      : null
  const heuristic = buildHeuristicMediaQuery(q, config.theme)
  const thematic = THEME_FALLBACK_EN[config.theme]

  const attempts: string[] = []
  const seen = new Set<string>()
  const add = (s: string) => {
    const k = s.toLowerCase().trim()
    if (k.length < 2 || seen.has(k)) return
    seen.add(k)
    attempts.push(s)
  }

  if (hint) add(hint)
  add(heuristic)
  add(thematic)

  for (const search of attempts) {
    const media = await tryProviders(search)
    if (media) return media
    await sleep(80)
  }

  return null
}

/**
 * Doplní otázky o obrázek nebo video bez druhého volání LLM.
 * Vyhledávání vede `mediaSearchHint` z Gemini (EN), jinak heuristika z českého textu.
 * Primárně Wikimedia Commons; volitelně Pexels (`pexelsApiKey` v runtime).
 * Na serveru: `QUIZ_MEDIA=0` v env → předej `{ enabled: false }`.
 */
export async function enrichQuizWithMedia(
  quiz: GeneratedQuiz,
  config: QuizConfiguration,
  runtime?: MediaEnrichmentRuntime
): Promise<GeneratedQuiz> {
  const env = runtime ?? defaultClientMediaRuntime()
  if (!env.enabled) {
    return quiz
  }

  const questions = quiz.questions
  const out: QuizQuestion[] = [...questions]
  const concurrency = 2
  let next = 0

  const worker = async () => {
    while (true) {
      const i = next++
      if (i >= out.length) break
      try {
        const media = await resolveMediaForQuestion(out[i], config, env)
        if (media) {
          out[i] = { ...out[i], media }
        }
      } catch {
        /* tiché selhání — otázka zůstane bez média */
      }
      await sleep(100)
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, out.length) }, () => worker())
  )

  return { ...quiz, questions: out }
}
