import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAccessibilityFlags } from '@/lib/accessibilityUi'
import { useQuizStore } from '@/store/useQuizStore'

type QuestionSlot = { selected: number | null; revealed: boolean }

const OPTION_IDLE_CLASSES: [string, string, string, string] = [
  'border-rose-400/90 bg-rose-700 hover:bg-rose-600 focus-visible:ring-rose-300',
  'border-sky-400/90 bg-sky-700 hover:bg-sky-600 focus-visible:ring-sky-300',
  'border-amber-400/90 bg-amber-700 hover:bg-amber-600 focus-visible:ring-amber-300',
  'border-violet-400/90 bg-violet-700 hover:bg-violet-600 focus-visible:ring-violet-300',
]

const OPTION_STAGGER = 0.15

function navButtonClass(variant: 'back' | 'cancel'): string {
  const base =
    'inline-flex items-center gap-2 rounded-xl px-4 py-3 text-lg font-semibold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950'
  if (variant === 'back') {
    return `${base} border-2 border-slate-500 bg-slate-800 hover:bg-slate-700 disabled:pointer-events-none disabled:opacity-35 focus-visible:ring-slate-400`
  }
  return `${base} border-2 border-rose-500/80 bg-rose-950/80 hover:bg-rose-900/90 focus-visible:ring-rose-400`
}

export function QuizPlayer() {
  const quiz = useQuizStore((s) => s.quiz)
  const config = useQuizStore((s) => s.config)
  const setStep = useQuizStore((s) => s.setStep)
  const setQuizScore = useQuizStore((s) => s.setQuizScore)
  const cancelQuiz = useQuizStore((s) => s.cancelQuiz)

  const flags = useMemo(() => getAccessibilityFlags(config), [config])

  const [index, setIndex] = useState(0)
  const [perQuestion, setPerQuestion] = useState<QuestionSlot[]>(() =>
    quiz
      ? quiz.questions.map(() => ({ selected: null, revealed: false }))
      : []
  )

  useEffect(() => {
    if (!quiz) return
    setPerQuestion(quiz.questions.map(() => ({ selected: null, revealed: false })))
    setIndex(0)
  }, [quiz])

  const question = quiz?.questions[index]
  const total = quiz?.questions.length ?? 0
  const isLast = index >= total - 1
  const slot = perQuestion[index]

  const { correctSoFar, answeredSoFar } = useMemo(() => {
    if (!quiz) return { correctSoFar: 0, answeredSoFar: 0 }
    let correct = 0
    let answered = 0
    for (let i = 0; i < quiz.questions.length; i++) {
      const s = perQuestion[i]
      if (!s?.revealed || s.selected === null) continue
      answered += 1
      if (s.selected === quiz.questions[i].correctAnswerIndex) correct += 1
    }
    return { correctSoFar: correct, answeredSoFar: answered }
  }, [quiz, perQuestion])
  const selected = slot?.selected ?? null
  const revealed = slot?.revealed ?? false

  const updateSlot = useCallback((i: number, patch: Partial<QuestionSlot>) => {
    setPerQuestion((prev) => {
      const next = [...prev]
      if (!next[i]) return prev
      next[i] = { ...next[i], ...patch }
      return next
    })
  }, [])

  const pickOption = useCallback(
    (optionIndex: number) => {
      if (revealed || !question) return
      updateSlot(index, {
        selected: optionIndex,
        revealed: true,
      })
    },
    [question, revealed, index, updateSlot]
  )

  const revealAnswerOnly = useCallback(() => {
    if (revealed || !question) return
    updateSlot(index, { revealed: true })
  }, [question, revealed, index, updateSlot])

  const goNext = useCallback(() => {
    if (!quiz || !question || !revealed) return
    if (isLast) {
      const score = quiz.questions.reduce((acc, q, i) => {
        const s = perQuestion[i]
        if (!s) return acc
        return acc + (s.revealed && s.selected === q.correctAnswerIndex ? 1 : 0)
      }, 0)
      setQuizScore(score)
      setStep('results')
      return
    }
    setIndex((i) => i + 1)
  }, [
    quiz,
    question,
    revealed,
    isLast,
    perQuestion,
    setQuizScore,
    setStep,
  ])

  const goBack = useCallback(() => {
    if (index <= 0) return
    setIndex((i) => i - 1)
  }, [index])

  const handleCancel = useCallback(() => {
    const ok = window.confirm(
      'Opravdu chcete ukončit kvíz? Postup se neuloží.'
    )
    if (ok) cancelQuiz()
  }, [cancelQuiz])

  useEffect(() => {
    if (!quiz || !question) return

    const onKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable)
      ) {
        return
      }

      const numpadToIndex: Record<string, number> = {
        Numpad1: 0,
        Numpad2: 1,
        Numpad3: 2,
        Numpad4: 3,
      }

      if (!revealed) {
        const np = numpadToIndex[e.code]
        if (np !== undefined) {
          e.preventDefault()
          pickOption(np)
          return
        }
        if (e.key >= '1' && e.key <= '4') {
          e.preventDefault()
          pickOption(Number(e.key) - 1)
          return
        }
      }

      if (e.key === ' ' || e.key === 'Enter') {
        if (e.repeat) return
        e.preventDefault()
        if (revealed) {
          goNext()
        } else {
          revealAnswerOnly()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [quiz, question, revealed, pickOption, goNext, revealAnswerOnly])

  if (!quiz || !question || !slot) {
    return (
      <div
        className="flex min-h-[100dvh] w-full items-center justify-center bg-gray-950 px-6"
        role="alert"
      >
        <p className="text-center text-2xl font-semibold text-slate-200">
          Žádný kvíz k zobrazení.
        </p>
      </div>
    )
  }

  const shellClass = flags.dyslexia ? 'font-dyslexia' : ''
  const optionGap = 'gap-4 md:gap-5'
  const iconSize = 'h-6 w-6 shrink-0'

  return (
    <div
      className={`flex min-h-[100dvh] w-full flex-col bg-gray-950 text-white ${shellClass}`}
    >
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 px-4 py-4 md:px-10 md:py-5">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={goBack}
          disabled={index === 0}
          aria-disabled={index === 0}
          className={navButtonClass('back')}
        >
          <ArrowLeft className={iconSize} aria-hidden />
          Zpět
        </motion.button>
        <div className="order-last flex w-full flex-col items-center gap-1 text-center md:order-none md:w-auto">
          <p className="text-lg font-bold tracking-wide text-amber-200/95 md:text-xl">
            Otázka {index + 1} z {total}
          </p>
          <p
            className="text-sm font-semibold tabular-nums text-emerald-300/95 md:text-base"
            aria-live="polite"
            aria-atomic="true"
          >
            Správně: {correctSoFar}
            {answeredSoFar > 0 ? ` z ${answeredSoFar}` : ''}
          </p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleCancel}
          className={navButtonClass('cancel')}
        >
          <X className={iconSize} aria-hidden />
          Zrušit kvíz
        </motion.button>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-6 md:px-12 md:py-10 lg:py-12">
        <p className="mb-2 max-w-5xl text-center text-sm font-medium uppercase tracking-widest text-slate-500">
          {quiz.title}
        </p>
        <p className="mb-6 max-w-3xl text-center text-xs text-slate-600 md:text-sm">
          Klávesnice: klávesy{' '}
          <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">1</kbd>
          {' až '}
          <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">4</kbd>
          {' '}
          vyberou odpověď ·{' '}
          <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">Mezerník</kbd> nebo{' '}
          <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-300">Enter</kbd>{' '}
          odhalí odpověď nebo pokračuje
        </p>

        <AnimatePresence mode="wait">
          <motion.article
            key={question.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-labelledby={`q-${question.id}-title`}
            className="flex w-full max-w-6xl flex-1 flex-col"
          >
            <motion.h2
              id={`q-${question.id}-title`}
              initial={{ opacity: 0, y: -28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-4xl text-center text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              {question.questionText}
            </motion.h2>

            {question.media?.kind === 'image' && (
              <figure className="mx-auto mt-8 w-full max-w-4xl overflow-hidden rounded-2xl ring-2 ring-slate-600/80 ring-offset-4 ring-offset-gray-950">
                <img
                  src={question.media.displayUrl}
                  alt={question.media.alt}
                  loading="lazy"
                  decoding="async"
                  className="max-h-[min(50vh,28rem)] w-full object-contain md:max-h-[min(55vh,32rem)]"
                />
                <figcaption className="sr-only">{question.media.alt}</figcaption>
              </figure>
            )}

            {question.media?.kind === 'video' && (
              <div className="mx-auto mt-8 w-full max-w-4xl overflow-hidden rounded-2xl ring-2 ring-slate-600/80 ring-offset-4 ring-offset-gray-950">
                <video
                  controls
                  preload="metadata"
                  className="max-h-[min(50vh,28rem)] w-full bg-black object-contain md:max-h-[min(55vh,32rem)]"
                  src={question.media.url}
                  aria-label={question.media.alt}
                >
                  {question.media.alt}
                </video>
              </div>
            )}

            {question.media &&
              (question.media.sourceLabel || question.media.sourceUrl) && (
                <p className="mt-3 text-center text-sm text-slate-500">
                  {question.media.sourceUrl ? (
                    <a
                      href={question.media.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-slate-600 underline-offset-2 hover:text-slate-300"
                    >
                      {question.media.sourceLabel}
                    </a>
                  ) : (
                    question.media.sourceLabel
                  )}
                </p>
              )}

            <div
              className={`mt-10 grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 ${optionGap} md:mt-12`}
              role="group"
              aria-label="Možnosti odpovědi"
            >
              {question.options.map((opt, i) => {
                const isSelected = selected === i
                const isCorrect = i === question.correctAnswerIndex

                const idle = OPTION_IDLE_CLASSES[i] ?? OPTION_IDLE_CLASSES[0]
                let surface = `w-full rounded-2xl border-2 px-5 py-6 text-left text-2xl font-bold leading-snug text-white shadow-lg transition-colors focus:outline-none focus-visible:ring-4 md:px-7 md:py-8 md:text-3xl ${idle}`

                if (revealed) {
                  if (isCorrect) {
                    surface =
                      'w-full rounded-2xl border-2 border-green-300 bg-green-500 px-5 py-6 text-left text-2xl font-extrabold leading-snug text-white shadow-[0_0_40px_rgba(34,197,94,0.45)] focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300 md:px-7 md:py-8 md:text-3xl'
                  } else {
                    surface = `${surface} saturate-50`
                  }
                }

                const enterDelay = 0.12 + i * OPTION_STAGGER
                const optionMotion = revealed
                  ? isCorrect
                    ? {
                        scale: [1, 1.06, 1.05],
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: 'easeOut' },
                      }
                    : {
                        opacity: 0.4,
                        scale: 1,
                        y: 0,
                        transition: { duration: 0.35 },
                      }
                  : {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        delay: enterDelay,
                        type: 'spring',
                        stiffness: 380,
                        damping: 26,
                      },
                    }

                return (
                  <motion.button
                    key={`${question.id}-${i}`}
                    type="button"
                    initial={{ opacity: 0, y: 28, scale: 0.96 }}
                    animate={optionMotion}
                    disabled={revealed}
                    onClick={() => pickOption(i)}
                    whileTap={revealed ? undefined : { scale: 0.99 }}
                    className={surface}
                    aria-pressed={isSelected}
                  >
                    <span className="mr-3 inline-block min-w-[2ch] font-black text-white/90">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </motion.button>
                )
              })}
            </div>

            <AnimatePresence>
              {revealed && question.explanation.trim() ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="mt-10 w-full max-w-5xl border-l-4 border-sky-400 bg-blue-900/50 px-6 py-5 text-xl leading-relaxed text-blue-100 shadow-lg md:mt-12 md:px-8 md:py-6 md:text-2xl"
                  role="region"
                  aria-live="polite"
                >
                  <span className="font-bold text-sky-200">Vysvětlení: </span>
                  {question.explanation}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                  className="mt-8 w-full max-w-5xl"
                >
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={goNext}
                    className="w-full rounded-2xl border-2 border-amber-300 bg-amber-500 py-5 text-center text-2xl font-extrabold text-gray-950 shadow-lg shadow-amber-500/25 transition-colors hover:bg-amber-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 md:py-6 md:text-3xl"
                  >
                    {isLast ? 'Zobrazit výsledky' : 'Další otázka'}
                  </motion.button>
                  <p className="mt-3 text-center text-sm text-slate-500">
                    Mezerník nebo Enter: pokračovat
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.article>
        </AnimatePresence>
      </main>
    </div>
  )
}
