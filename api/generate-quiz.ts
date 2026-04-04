import type { VercelRequest, VercelResponse } from '@vercel/node'
import { generateQuizFromGemini } from '../src/lib/generateQuizCore'
import { parseQuizConfigurationBody } from '../src/lib/quizConfigValidation'
import { enrichQuizWithMedia } from '../src/services/mediaEnrichment'

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Metoda není povolena.' })
    return
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (!apiKey) {
    res.status(500).json({
      error:
        'Chybí GEMINI_API_KEY na serveru. V nastavení Vercelu přidej proměnnou prostředí (bez prefixu VITE_).',
    })
    return
  }

  let config: ReturnType<typeof parseQuizConfigurationBody>
  try {
    const body =
      typeof req.body === 'string'
        ? (JSON.parse(req.body) as unknown)
        : req.body
    config = parseQuizConfigurationBody(body)
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : 'Neplatný JSON nebo struktura těla.'
    res.status(400).json({ error: msg })
    return
  }

  try {
    const model = process.env.GEMINI_MODEL?.trim()
    let quiz = await generateQuizFromGemini(config, { apiKey, model })

    const mediaEnabled = process.env.QUIZ_MEDIA !== '0'
    const pexelsKey = process.env.PEXELS_API_KEY?.trim()
    quiz = await enrichQuizWithMedia(quiz, config, {
      enabled: mediaEnabled,
      pexelsApiKey: pexelsKey || undefined,
    })

    res.status(200).json(quiz)
  } catch (e) {
    const msg =
      e instanceof Error ? e.message : 'Generování kvízu se nezdařilo.'
    res.status(502).json({ error: msg })
  }
}
