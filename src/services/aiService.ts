import type { GeneratedQuiz, QuizConfiguration } from '@/types'
import { quizOptionCountForConfig } from '@/lib/accessibility/handicapRules'
import { enrichQuizWithMedia } from '@/services/mediaEnrichment'
import { THEME_LABEL_CS, THEME_MEDIA_HINT_EN } from '@/lib/themeWizardOptions'

const THEME_LABEL_MOCK = THEME_LABEL_CS
const MOCK_THEME_MEDIA_HINT = THEME_MEDIA_HINT_EN

function mockQuizTitle(config: QuizConfiguration): string {
  if (config.theme === 'random') {
    return 'Překvap mě! (ukázka, API neběží)'
  }
  if (config.theme === 'custom') {
    const t = config.customThemeText.trim().slice(0, 36)
    return t
      ? `${t}${config.customThemeText.trim().length > 36 ? '…' : ''} (ukázka)`
      : 'Vlastní téma (ukázka)'
  }
  return `${THEME_LABEL_CS[config.theme]} (ukázka, API neběží)`
}

function generateQuizMock(config: QuizConfiguration): GeneratedQuiz {
  const optN = quizOptionCountForConfig(config)
  const opts1 =
    optN === 3
      ? (['Rozumím', 'Ne', 'Možná'] as const)
      : (['Rozumím', 'Ne', 'Možná', 'Nevím'] as const)
  const opts2 =
    optN === 3
      ? ([THEME_LABEL_MOCK[config.theme], 'Jiné téma', 'Náhodné'] as const)
      : ([
          THEME_LABEL_MOCK[config.theme],
          'Jiné téma',
          'Náhodné',
          'Žádné',
        ] as const)
  return {
    title: mockQuizTitle(config),
    questions: [
      {
        id: 'q1',
        questionText:
          'Toto je ukázková otázka. Spusť `npm run dev` (Vercel + Vite) nebo nasaď na Vercel s GEMINI_API_KEY.',
        options: [...opts1],
        correctAnswerIndex: 0,
        imageContextPrompt: 'cozy study desk with warm lamp',
        explanation:
          'Plné kvízy generuje server `/api/generate-quiz`. Lokálně použij příkaz z README; na Vercelu nastav GEMINI_API_KEY v Environment Variables.',
      },
      {
        id: 'q2',
        questionText: 'Které téma jsi zvolil v průvodci?',
        options: [...opts2],
        correctAnswerIndex: 0,
        imageContextPrompt: MOCK_THEME_MEDIA_HINT[config.theme],
        explanation: `V konfiguraci je téma: ${
          config.theme === 'custom'
            ? config.customThemeText.trim() || 'vlastní (prázdné)'
            : THEME_LABEL_MOCK[config.theme]
        }.`,
      },
    ],
  }
}

/** Vykoukne čitelný text z API `{ error, hint? }` i vnořených struktur. */
function errorTextFromUnknown(value: unknown, fallback: string): string {
  if (typeof value === 'string') {
    const t = value.trim()
    return t.length > 0 ? t : fallback
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const o = value as Record<string, unknown>
    if (typeof o.message === 'string' && o.message.trim()) {
      return o.message.trim()
    }
    if ('error' in o && o.error !== undefined) {
      const nested = errorTextFromUnknown(o.error, '')
      if (nested) return nested
    }
    try {
      const s = JSON.stringify(value)
      return s.length > 400 ? `${s.slice(0, 400)}…` : s
    } catch {
      return fallback
    }
  }
  if (value == null || value === '') return fallback
  return String(value)
}

function humanizeApiError(
  data: unknown,
  status: number
): string {
  if (!data || typeof data !== 'object') {
    return `Chyba serveru (${status}).`
  }
  const o = data as Record<string, unknown>
  const main = errorTextFromUnknown(o.error, '')
  const hint = errorTextFromUnknown(o.hint, '')
  const parts = [main, hint].filter(
    (p, i, a) => p.length > 0 && a.indexOf(p) === i
  )
  return parts.length > 0 ? parts.join('. ') : `Chyba serveru (${status}).`
}

function cancellableDelay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }
    const t = window.setTimeout(resolve, ms)
    const onAbort = () => {
      window.clearTimeout(t)
      reject(new DOMException('Aborted', 'AbortError'))
    }
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

function parseJsonResponse(text: string, status: number): unknown {
  const trimmed = text.replace(/^\uFEFF/, '').trim()
  if (!trimmed) {
    if (status >= 400) {
      throw new Error(
        `Server odpověděl ${status} s prázdným tělem. Zkontroluj log funkce na Vercelu (GEMINI_API_KEY, timeout).`
      )
    }
    throw new Error('Server vrátil prázdnou odpověď.')
  }

  const looksHtml =
    trimmed.startsWith('<!') ||
    trimmed.startsWith('<html') ||
    trimmed.toLowerCase().includes('<!doctype html')

  if (looksHtml) {
    throw new Error(
      'Server vrátil HTML místo JSON. Často to znamená, že požadavek na /api/generate-quiz nedorazil do serverové funkce (SPA fallback, starý service worker nebo špatné nasazení). Zkuste tvrdé obnovení stránky (Ctrl+Shift+R) nebo v prohlížeči zrušit „aplikaci“ a vyčistit data webu. Na Vercelu ověřte, že existuje funkce api/generate-quiz a že je nastavený GEMINI_API_KEY.'
    )
  }

  try {
    return JSON.parse(trimmed) as unknown
  } catch {
    throw new Error(
      `Odpověď není platný JSON (HTTP ${status}). Začátek: ${trimmed.slice(0, 120).replace(/\s+/g, ' ')}…`
    )
  }
}

async function fetchQuizFromApi(
  config: QuizConfiguration,
  signal?: AbortSignal
): Promise<GeneratedQuiz> {
  const res = await fetch('/api/generate-quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(config),
    cache: 'no-store',
    signal,
  })

  const text = await res.text()
  const data = parseJsonResponse(text, res.status)

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        'Server vrátil 404 u /api/generate-quiz. Funkce není na tomto nasazení dostupná. Ověř na Vercelu záložku Functions a že v repozitáři je api/generate-quiz.js (přegeneruje se při npm run build).'
      )
    }
    throw new Error(humanizeApiError(data, res.status))
  }

  if (
    !data ||
    typeof data !== 'object' ||
    !Array.isArray((data as GeneratedQuiz).questions)
  ) {
    throw new Error('Server nevrátil platný kvíz.')
  }

  return data as GeneratedQuiz
}

function useOfflineMockFallback(): boolean {
  return import.meta.env.VITE_DEV_MOCK === '1'
}

/**
 * Vygeneruje kvíz přes serverové API (Gemini + volitelné média). Klíče jsou jen na serveru.
 * Offline ukázka: nastav `VITE_DEV_MOCK=1` při `vite` bez backendu.
 */
export async function generateQuiz(
  config: QuizConfiguration,
  signal?: AbortSignal
): Promise<GeneratedQuiz> {
  if (useOfflineMockFallback()) {
    console.warn(
      '[kvíz] VITE_DEV_MOCK=1: používám lokální ukázkový kvíz bez API.'
    )
    await cancellableDelay(600, signal)
    const quiz = generateQuizMock(config)
    return enrichQuizWithMedia(quiz, config, undefined, signal)
  }

  try {
    return await fetchQuizFromApi(config, signal)
  } catch (e) {
    const aborted =
      (e instanceof DOMException && e.name === 'AbortError') ||
      (e instanceof Error && e.name === 'AbortError')
    if (aborted) throw e
    if (import.meta.env.DEV) {
      const msg = e instanceof Error ? e.message : String(e)
      console.warn(
        '[kvíz] /api/generate-quiz nedostupné, používám ukázkový kvíz. Tip: `npm run dev` spouští Vercel dev server.',
        msg
      )
      await cancellableDelay(600, signal)
      const quiz = generateQuizMock(config)
      return enrichQuizWithMedia(quiz, config, undefined, signal)
    }
    throw e
  }
}
