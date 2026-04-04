import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { AccessibilityFlags } from '@/lib/accessibilityUi'
import {
  getAccessibilityFlags,
  quizExplanationClass,
  quizOptionIdleClass,
  quizOptionLabelClass,
  quizOptionPaddingClass,
  quizOptionsGridClass,
  quizProgressClass,
  quizQuestionTitleClass,
  quizSurfaceClass,
} from '@/lib/accessibilityUi'
import { useQuizStore } from '@/store/useQuizStore'

type QuestionSlot = { selected: number | null; revealed: boolean }

function optionButtonClasses(
  flags: AccessibilityFlags,
  revealed: boolean,
  isSelected: boolean,
  isCorrect: boolean
): string {
  const pad = quizOptionPaddingClass(flags)
  const base =
    'w-full rounded-xl border-2 text-left font-medium transition-colors disabled:cursor-default'
  const size = flags.visual ? 'text-base font-semibold' : 'text-base'

  if (!revealed) {
    if (isSelected) {
      if (flags.visual) {
        return `${base} ${pad} ${size} border-cyan-400 bg-neutral-800 text-white ring-2 ring-cyan-300`
      }
      return `${base} ${pad} ${size} border-indigo-400 bg-indigo-500/20 text-white ring-1 ring-indigo-400/30`
    }
    return quizOptionIdleClass(flags)
  }

  if (isCorrect) {
    if (flags.visual) {
      return `${base} ${pad} ${size} border-emerald-400 bg-emerald-950 text-white ring-2 ring-emerald-300`
    }
    return `${base} ${pad} ${size} border-emerald-500/80 bg-emerald-500/15 text-white ring-1 ring-emerald-500/40`
  }
  if (isSelected) {
    if (flags.visual) {
      return `${base} ${pad} ${size} border-rose-400 bg-rose-950 text-white ring-2 ring-rose-300`
    }
    return `${base} ${pad} ${size} border-rose-500/80 bg-rose-500/15 text-white ring-1 ring-rose-500/40`
  }
  if (flags.visual) {
    return `${base} ${pad} ${size} border-neutral-600 bg-neutral-900/40 text-neutral-500`
  }
  return `${base} ${pad} ${size} border-slate-600/50 bg-slate-800/30 text-slate-400`
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

  if (!quiz || !question || !slot) {
    return (
      <p className="text-slate-300" role="alert">
        Žádný kvíz k zobrazení.
      </p>
    )
  }

  const shellClass = flags.dyslexia ? 'font-dyslexia' : ''

  const primaryNavClass = flags.visual
    ? 'inline-flex items-center gap-2 rounded-xl border-2 border-amber-400 bg-neutral-900 px-3 py-2.5 text-base font-semibold text-white transition-colors hover:bg-neutral-800 disabled:pointer-events-none disabled:opacity-40'
    : 'inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/70 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700/80 disabled:pointer-events-none disabled:opacity-40'

  const cancelClass = flags.visual
    ? 'inline-flex items-center gap-2 rounded-xl border-2 border-rose-400 bg-rose-950/50 px-3 py-2.5 text-base font-semibold text-rose-100 transition-colors hover:bg-rose-950/80'
    : 'inline-flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/30 px-3 py-2 text-sm font-medium text-rose-200 transition-colors hover:bg-rose-950/50'

  const nextClass = flags.visual
    ? 'mt-4 w-full rounded-xl border-2 border-amber-400 bg-amber-500 py-3.5 text-center text-base font-bold text-black shadow-lg hover:bg-amber-400'
    : 'mt-4 w-full rounded-xl bg-indigo-500 py-3 text-center text-base font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400'

  const explainLabel =
    flags.visual ? (
      <span className="font-bold text-amber-300">Vysvětlení: </span>
    ) : (
      <span className="font-semibold text-indigo-300">Vysvětlení: </span>
    )

  return (
    <div className={`w-full max-w-lg ${shellClass}`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={goBack}
          disabled={index === 0}
          aria-disabled={index === 0}
          className={primaryNavClass}
        >
          <ArrowLeft className={flags.visual ? 'h-5 w-5 shrink-0' : 'h-4 w-4 shrink-0'} aria-hidden />
          Zpět
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleCancel}
          className={cancelClass}
        >
          <X className={flags.visual ? 'h-5 w-5 shrink-0' : 'h-4 w-4 shrink-0'} aria-hidden />
          Zrušit kvíz
        </motion.button>
      </div>

      <p className={quizProgressClass(flags)}>
        Otázka {index + 1} z {total}
      </p>
      <AnimatePresence mode="wait">
        <motion.article
          key={question.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          aria-labelledby={`q-${question.id}-title`}
          className={quizSurfaceClass(flags)}
        >
          <h2
            id={`q-${question.id}-title`}
            className={quizQuestionTitleClass(flags)}
          >
            {question.questionText}
          </h2>

          {question.media?.kind === 'image' && (
            <figure
              className={`mt-4 overflow-hidden rounded-xl ${
                flags.visual
                  ? 'ring-2 ring-amber-400/90 ring-offset-2 ring-offset-slate-900'
                  : 'ring-1 ring-slate-600/60'
              }`}
            >
              <img
                src={question.media.displayUrl}
                alt={question.media.alt}
                loading="lazy"
                decoding="async"
                className="max-h-52 w-full object-cover sm:max-h-60"
              />
              <figcaption className="sr-only">{question.media.alt}</figcaption>
            </figure>
          )}

          {question.media?.kind === 'video' && (
            <div
              className={`mt-4 overflow-hidden rounded-xl ${
                flags.visual
                  ? 'ring-2 ring-amber-400/90 ring-offset-2 ring-offset-slate-900'
                  : 'ring-1 ring-slate-600/60'
              }`}
            >
              <video
                controls
                preload="metadata"
                className="max-h-60 w-full bg-black/40 object-contain sm:max-h-72"
                src={question.media.url}
                aria-label={question.media.alt}
              >
                {question.media.alt}
              </video>
            </div>
          )}

          {question.media &&
            (question.media.sourceLabel || question.media.sourceUrl) && (
              <p className="mt-2 text-center text-xs text-slate-500">
                {question.media.sourceUrl ? (
                  <a
                    href={question.media.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-slate-500 underline-offset-2 hover:text-slate-300"
                  >
                    {question.media.sourceLabel}
                  </a>
                ) : (
                  question.media.sourceLabel
                )}
              </p>
            )}

          <div
            className={quizOptionsGridClass(flags)}
            role="group"
            aria-label="Možnosti odpovědi"
          >
            {question.options.map((opt, i) => {
              const isSelected = selected === i
              const isCorrect = i === question.correctAnswerIndex
              return (
                <motion.button
                  key={i}
                  type="button"
                  disabled={revealed}
                  onClick={() => pickOption(i)}
                  whileTap={revealed ? undefined : { scale: 0.99 }}
                  className={optionButtonClasses(
                    flags,
                    revealed,
                    isSelected,
                    isCorrect
                  )}
                  aria-pressed={isSelected}
                >
                  <span className={quizOptionLabelClass(flags)}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </motion.button>
              )
            })}
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p
                  className={quizExplanationClass(flags)}
                  role="region"
                  aria-live="polite"
                >
                  {explainLabel}
                  {question.explanation}
                </p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={goNext}
                  className={nextClass}
                >
                  {isLast ? 'Zobrazit výsledky' : 'Další otázka'}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.article>
      </AnimatePresence>
    </div>
  )
}
