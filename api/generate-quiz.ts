import type { VercelRequest, VercelResponse } from '@vercel/node'
import { generateQuizFromGemini } from '../src/lib/generateQuizCore'
import { parseQuizConfigurationBody } from '../src/lib/quizConfigValidation'
import { enrichQuizWithMedia } from '../src/services/mediaEnrichment'

function parseRequestBody(req: VercelRequest): unknown {
  const b = req.body
  if (b == null || (typeof b === 'string' && b.trim() === '')) {
    return undefined
  }
  if (typeof b === 'string') {
    return JSON.parse(b) as unknown
  }
  if (Buffer.isBuffer(b)) {
    const s = b.toString('utf8').trim()
    return s ? (JSON.parse(s) as unknown) : undefined
  }
  return b
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
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
      // 503 = konfigurace nasazení, ne „pád“ aplikační logiky
      res.status(503).json({
        error:
          'Server nemá nastavený GEMINI_API_KEY. Na Vercelu: Project → Settings → Environment Variables → přidej GEMINI_API_KEY (ne VITE_*). Poté Redeploy.',
      })
      return
    }

    let config: ReturnType<typeof parseQuizConfigurationBody>
    try {
      const body = parseRequestBody(req)
      config = parseQuizConfigurationBody(body)
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : 'Neplatný JSON nebo struktura těla.'
      res.status(400).json({ error: msg })
      return
    }

    const model = process.env.GEMINI_MODEL?.trim()
    let quiz = await generateQuizFromGemini(config, { apiKey, model })

    const mediaEnabled = process.env.QUIZ_MEDIA !== '0'
    const pexelsKey = process.env.PEXELS_API_KEY?.trim()
    quiz = await enrichQuizWithMedia(quiz, config, {
      enabled: mediaEnabled,
      pexelsApiKey: pexelsKey || undefined,
    })

    let payload: string
    try {
      payload = JSON.stringify(quiz)
    } catch (serErr) {
      console.error('[api/generate-quiz] serialize', serErr)
      res.status(500).json({
        error: 'Nepodařilo se serializovat odpověď kvízu.',
        hint: 'Zkontrolujte log funkce na Vercelu.',
      })
      return
    }
    res.status(200).send(payload)
  } catch (e) {
    console.error('[api/generate-quiz]', e)
    const msg =
      e instanceof Error ? e.message : 'Neočekávaná chyba serveru.'
    try {
      if (!res.headersSent) {
        res.status(500).json({
          error: msg,
          hint:
            'Zkontrolujte log funkce ve Vercelu (Deployments → zvolte build → Functions).',
        })
      }
    } catch (sendErr) {
      console.error('[api/generate-quiz] send error body failed', sendErr)
    }
  }
}
