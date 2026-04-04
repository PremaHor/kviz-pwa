import type { GeneratedQuiz, QuizConfiguration } from '@/types'
import { enrichQuizWithMedia } from '@/services/mediaEnrichment'

/** Popisy témat jen pro text ukázkové otázky v mocku (nezdvojovat export z jádra). */
const THEME_LABEL_MOCK: Record<QuizConfiguration['theme'], string> = {
  seasonal: 'Sezónní (roční období, svátky, tradice v daném roce)',
  animals: 'Zvířata a příroda',
  general: 'Všeobecné znalosti',
  science: 'Věda a technika',
  pop_culture: 'Popkultura, film, hudba, seriály',
}

const MOCK_THEME_MEDIA_HINT: Record<QuizConfiguration['theme'], string> = {
  seasonal: 'spring easter eggs flowers',
  animals: 'red deer forest wildlife',
  general: 'public library books reading',
  science: 'chemistry beakers laboratory',
  pop_culture: 'vinyl record microphone music',
}

function generateQuizMock(config: QuizConfiguration): GeneratedQuiz {
  const themeTitle: Record<QuizConfiguration['theme'], string> = {
    seasonal: 'Sezónní kvíz',
    animals: 'Zvířata v přírodě',
    general: 'Všeobecný kvíz',
    science: 'Věda kolem nás',
    pop_culture: 'Popkultura',
  }
  return {
    title: `${themeTitle[config.theme]} (ukázka — API neběží)`,
    questions: [
      {
        id: 'q1',
        questionText:
          'Toto je ukázková otázka. Spusť `npm run dev` (Vercel + Vite) nebo nasaď na Vercel s GEMINI_API_KEY.',
        options: ['Rozumím', 'Ne', 'Možná', 'Nevím'],
        correctAnswerIndex: 0,
        mediaSearchHint: 'laptop computer programming',
        explanation:
          'Plné kvízy generuje server `/api/generate-quiz`. Lokálně použij příkaz z README; na Vercelu nastav GEMINI_API_KEY v Environment Variables.',
      },
      {
        id: 'q2',
        questionText: 'Které téma jsi zvolil v průvodci?',
        options: [
          THEME_LABEL_MOCK[config.theme],
          'Jiné téma',
          'Náhodné',
          'Žádné',
        ],
        correctAnswerIndex: 0,
        mediaSearchHint: MOCK_THEME_MEDIA_HINT[config.theme],
        explanation: `V konfiguraci je téma: ${THEME_LABEL_MOCK[config.theme]}.`,
      },
    ],
  }
}

async function fetchQuizFromApi(
  config: QuizConfiguration
): Promise<GeneratedQuiz> {
  const res = await fetch('/api/generate-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  })

  const text = await res.text()
  let data: unknown
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    throw new Error('Neplatná odpověď serveru (není JSON).')
  }

  if (!res.ok) {
    const err =
      data && typeof data === 'object' && 'error' in data
        ? String((data as { error: unknown }).error)
        : res.statusText
    throw new Error(err || `Chyba serveru (${res.status}).`)
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
  config: QuizConfiguration
): Promise<GeneratedQuiz> {
  if (useOfflineMockFallback()) {
    console.warn(
      '[kvíz] VITE_DEV_MOCK=1 — používám lokální ukázkový kvíz bez API.'
    )
    await new Promise((r) => setTimeout(r, 600))
    const quiz = generateQuizMock(config)
    return enrichQuizWithMedia(quiz, config)
  }

  try {
    return await fetchQuizFromApi(config)
  } catch (e) {
    if (import.meta.env.DEV) {
      const msg = e instanceof Error ? e.message : String(e)
      console.warn(
        '[kvíz] /api/generate-quiz nedostupné, používám ukázkový kvíz. Tip: `npm run dev` spouští Vercel dev server.',
        msg
      )
      await new Promise((r) => setTimeout(r, 600))
      const quiz = generateQuizMock(config)
      return enrichQuizWithMedia(quiz, config)
    }
    throw e
  }
}
