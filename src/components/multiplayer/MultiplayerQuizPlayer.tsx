import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  getAccessibilityFlags,
  type AccessibilityFlags,
} from '@/lib/accessibilityUi'
import { useQuizStore } from '@/store/useQuizStore'

function optionIdlePalette(
  flags: AccessibilityFlags
): readonly [string, string, string, string] {
  if (flags.visual) {
    return [
      'border-amber-400/90 bg-neutral-950 hover:bg-neutral-900 focus-visible:ring-amber-400',
      'border-amber-400/90 bg-neutral-950 hover:bg-neutral-900 focus-visible:ring-amber-400',
      'border-amber-400/90 bg-neutral-950 hover:bg-neutral-900 focus-visible:ring-amber-400',
      'border-amber-400/90 bg-neutral-950 hover:bg-neutral-900 focus-visible:ring-amber-400',
    ]
  }
  if (flags.cognitivePastel) {
    return [
      'border-sky-400/60 bg-sky-950/50 text-white hover:bg-sky-900/60 focus-visible:ring-sky-400',
      'border-rose-400/60 bg-rose-950/50 text-white hover:bg-rose-900/60 focus-visible:ring-rose-400',
      'border-amber-400/60 bg-amber-950/50 text-white hover:bg-amber-900/60 focus-visible:ring-amber-400',
      'border-violet-400/60 bg-violet-950/50 text-white hover:bg-violet-900/60 focus-visible:ring-violet-400',
    ]
  }
  return [
    'border-rose-400/90 bg-rose-700 hover:bg-rose-600 focus-visible:ring-rose-300',
    'border-sky-400/90 bg-sky-700 hover:bg-sky-600 focus-visible:ring-sky-300',
    'border-amber-400/90 bg-amber-700 hover:bg-amber-600 focus-visible:ring-amber-300',
    'border-violet-400/90 bg-violet-700 hover:bg-violet-600 focus-visible:ring-violet-300',
  ]
}

function navBtn(variant: 'back' | 'cancel'): string {
  const base =
    'inline-flex items-center gap-2 rounded-xl px-4 py-3 text-lg font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950'
  if (variant === 'back') {
    return `${base} border-2 border-slate-500 bg-slate-800 hover:bg-slate-700 disabled:pointer-events-none disabled:opacity-35 focus-visible:ring-slate-400`
  }
  return `${base} border-2 border-rose-500/80 bg-rose-950/80 hover:bg-rose-900/90 focus-visible:ring-rose-400`
}

export function MultiplayerQuizPlayer() {
  const quiz = useQuizStore((s) => s.quiz)
  const config = useQuizStore((s) => s.config)
  const multiplayer = useQuizStore((s) => s.multiplayer)
  const submitMockAnswer = useQuizStore((s) => s.submitMockAnswer)
  const nextMockQuestion = useQuizStore((s) => s.nextMockQuestion)
  const setStep = useQuizStore((s) => s.setStep)
  const cancelQuiz = useQuizStore((s) => s.cancelQuiz)

  const flags = useMemo(() => getAccessibilityFlags(config), [config])
  const palette = useMemo(() => optionIdlePalette(flags), [flags])

  const [uiPhase, setUiPhase] = useState<'question' | 'waiting' | 'scores'>(
    'question'
  )
  const waitingTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const qIndex = multiplayer.currentQuestionIndex
  const question = quiz?.questions[qIndex]
  const total = quiz?.questions.length ?? 0

  useEffect(() => {
    if (multiplayer.status === 'playing') {
      setUiPhase('question')
    }
  }, [multiplayer.status, qIndex])

  useEffect(() => {
    if (multiplayer.status === 'results') {
      setStep('results')
    }
  }, [multiplayer.status, setStep])

  useEffect(() => {
    return () => {
      if (waitingTimer.current) clearTimeout(waitingTimer.current)
    }
  }, [])

  const handlePick = useCallback(
    (answerIndex: number) => {
      if (!quiz || !question || multiplayer.status !== 'playing') return
      if (uiPhase !== 'question') return
      const pid = multiplayer.currentPlayerId
      if (!pid || multiplayer.roundAnswers[pid] !== undefined) return

      submitMockAnswer(qIndex, answerIndex)
      setUiPhase('waiting')
      waitingTimer.current = setTimeout(() => {
        setUiPhase('scores')
        waitingTimer.current = null
      }, 450)
    },
    [
      quiz,
      question,
      multiplayer.status,
      multiplayer.currentPlayerId,
      multiplayer.roundAnswers,
      qIndex,
      submitMockAnswer,
      uiPhase,
    ]
  )

  const handleNext = useCallback(() => {
    nextMockQuestion()
  }, [nextMockQuestion])

  useEffect(() => {
    if (uiPhase !== 'scores' || multiplayer.status !== 'waiting') return
    if (multiplayer.isHost) return
    const t = setTimeout(() => handleNext(), 2000)
    return () => clearTimeout(t)
  }, [uiPhase, multiplayer.status, multiplayer.isHost, handleNext])

  const sortedPlayers = useMemo(
    () =>
      [...multiplayer.players].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name)),
    [multiplayer.players]
  )

  if (!quiz || !question) {
    return (
      <div
        className="flex min-h-[100dvh] w-full items-center justify-center bg-gray-950 px-6 text-slate-200"
        role="alert"
      >
        Žádný kvíz k zobrazení.
      </div>
    )
  }

  const isLast = qIndex >= total - 1

  if (multiplayer.status === 'results') {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center bg-gray-950 text-slate-400">
        Načítání výsledků…
      </div>
    )
  }

  return (
    <div
      className={`flex min-h-[100dvh] w-full flex-col bg-gray-950 text-white ${flags.dyslexia ? 'font-dyslexia leading-[1.8]' : ''}`}
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-4 md:px-10 md:py-5">
        <div className="w-24" aria-hidden />
        <p className="text-lg font-bold text-amber-200/95 md:text-xl">
          Otázka {qIndex + 1} z {total}
          <span className="ml-2 text-sm font-normal text-slate-400">(multiplayer)</span>
        </p>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (window.confirm('Opravdu ukončit kvíz?')) cancelQuiz()
          }}
          className={navBtn('cancel')}
        >
          <X className="h-6 w-6 shrink-0" aria-hidden />
          Zrušit
        </motion.button>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-8 md:px-12">
        <p className="mb-2 text-center text-sm text-slate-500">{quiz.title}</p>

        <AnimatePresence mode="wait">
          {uiPhase === 'question' && multiplayer.status === 'playing' ? (
            <motion.article
              key={`q-${question.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full max-w-3xl flex-col"
            >
              <h2 className="text-center text-3xl font-extrabold leading-tight md:text-4xl">
                {question.questionText}
              </h2>
              <div
                className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-4 self-center md:grid-cols-2"
                role="group"
                aria-label="Možnosti odpovědi"
              >
                {question.options.map((opt, i) => {
                  const idle = palette[i] ?? palette[0]
                  return (
                    <motion.button
                      key={i}
                      type="button"
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handlePick(i)}
                      className={`w-full rounded-2xl border-2 px-5 py-6 text-left text-xl font-bold text-white shadow-lg transition-colors focus:outline-none focus-visible:ring-4 md:py-8 md:text-2xl ${idle}`}
                    >
                      <span className="mr-2 font-black text-white/90">
                        {String.fromCharCode(65 + i)}.
                      </span>
                      {opt}
                    </motion.button>
                  )
                })}
              </div>
            </motion.article>
          ) : null}

          {uiPhase === 'waiting' ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-[40vh] flex-col items-center justify-center gap-3"
            >
              <p className="text-xl font-semibold text-slate-200">
                Čekám na ostatní hráče…
              </p>
              <p className="text-sm text-slate-500">Mock: simulace na jednom zařízení</p>
            </motion.div>
          ) : null}

          {uiPhase === 'scores' && multiplayer.status === 'waiting' ? (
            <motion.div
              key="scores"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md space-y-6"
            >
              <h3 className="text-center text-xl font-bold text-white">Pořadí</h3>
              <ol className="space-y-2 rounded-2xl border border-slate-600 bg-slate-900/60 p-4">
                {sortedPlayers.map((p, rank) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between rounded-lg bg-slate-800/80 px-3 py-2.5"
                  >
                    <span className="text-slate-300">
                      {rank + 1}. {p.name}
                      {p.id === multiplayer.currentPlayerId ? (
                        <span className="ml-2 text-xs text-indigo-300">(vy)</span>
                      ) : null}
                    </span>
                    <span className="font-mono font-bold text-amber-200">{p.score}</span>
                  </li>
                ))}
              </ol>
              {multiplayer.isHost ? (
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNext}
                  className="w-full rounded-2xl bg-indigo-500 py-4 text-lg font-bold text-white hover:bg-indigo-400"
                >
                  {isLast ? 'Zobrazit výsledky' : 'Další otázka'}
                </motion.button>
              ) : (
                <p className="text-center text-sm text-slate-400">
                  Počkejte na hostitele ({isLast ? 'výsledky' : 'další otázka'}).
                </p>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  )
}
