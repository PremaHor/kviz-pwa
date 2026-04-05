import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TimedQuestion } from '@/components/competitive/TimedQuestion'
import {
  getAccessibilityFlags,
  type AccessibilityFlags,
} from '@/lib/accessibilityUi'
import {
  clampCompetitiveTimeLimitSeconds,
  competitivePointsForAnswer,
} from '@/lib/competitiveScoring'
import { MultiplayerQuizPlayer } from '@/components/multiplayer/MultiplayerQuizPlayer'
import { useQuizStore } from '@/store/useQuizStore'

type QuestionSlot = {
  selected: number | null
  revealed: boolean
  timedOut?: boolean
  pointsEarned?: number
}

const OPTION_IDLE_CLASSES: [string, string, string, string] = [
  'border-rose-400/90 bg-rose-700 hover:bg-rose-600 focus-visible:ring-rose-300',
  'border-sky-400/90 bg-sky-700 hover:bg-sky-600 focus-visible:ring-sky-300',
  'border-amber-400/90 bg-amber-700 hover:bg-amber-600 focus-visible:ring-amber-300',
  'border-violet-400/90 bg-violet-700 hover:bg-violet-600 focus-visible:ring-violet-300',
]

const OPTION_STAGGER = 0.15

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
  if (flags.cognitivePastel && flags.creamyBackground) {
    return [
      'border-sky-300/90 bg-sky-100/95 hover:bg-sky-50 focus-visible:ring-sky-400 text-sky-950',
      'border-rose-300/90 bg-rose-100/95 hover:bg-rose-50 focus-visible:ring-rose-400 text-rose-950',
      'border-amber-300/90 bg-amber-100/95 hover:bg-amber-50 focus-visible:ring-amber-400 text-amber-950',
      'border-violet-300/90 bg-violet-100/95 hover:bg-violet-50 focus-visible:ring-violet-400 text-violet-950',
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
  if (flags.creamyBackground) {
    return [
      'border-rose-400/80 bg-rose-100/90 hover:bg-rose-50 focus-visible:ring-rose-400 text-rose-950',
      'border-sky-400/80 bg-sky-100/90 hover:bg-sky-50 focus-visible:ring-sky-400 text-sky-950',
      'border-amber-400/80 bg-amber-100/90 hover:bg-amber-50 focus-visible:ring-amber-400 text-amber-950',
      'border-violet-400/80 bg-violet-100/90 hover:bg-violet-50 focus-visible:ring-violet-400 text-violet-950',
    ]
  }
  return OPTION_IDLE_CLASSES
}

function navButtonClass(variant: 'back' | 'cancel', lightChrome: boolean): string {
  const base =
    'inline-flex items-center gap-2 rounded-xl px-4 py-3 text-lg font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
  if (lightChrome) {
    const off = 'focus-visible:ring-offset-[#fef9f0]'
    if (variant === 'back') {
      return `${base} border-2 border-stone-500 bg-stone-200 text-stone-900 hover:bg-stone-100 disabled:pointer-events-none disabled:opacity-35 focus-visible:ring-stone-500 ${off}`
    }
    return `${base} border-2 border-rose-600 bg-rose-100 text-rose-950 hover:bg-rose-50 focus-visible:ring-rose-500 ${off}`
  }
  const darkBase = `${base} text-white focus-visible:ring-offset-gray-950`
  if (variant === 'back') {
    return `${darkBase} border-2 border-slate-500 bg-slate-800 hover:bg-slate-700 disabled:pointer-events-none disabled:opacity-35 focus-visible:ring-slate-400`
  }
  return `${darkBase} border-2 border-rose-500/80 bg-rose-950/80 hover:bg-rose-900/90 focus-visible:ring-rose-400`
}

function SinglePlayerQuiz() {
  const quiz = useQuizStore((s) => s.quiz)
  const config = useQuizStore((s) => s.config)
  const setStep = useQuizStore((s) => s.setStep)
  const setQuizScore = useQuizStore((s) => s.setQuizScore)
  const cancelQuiz = useQuizStore((s) => s.cancelQuiz)

  const flags = useMemo(() => getAccessibilityFlags(config), [config])
  const optionPalette = useMemo(() => optionIdlePalette(flags), [flags])
  const lightChrome = flags.creamyBackground && !flags.visual
  const isCompetitive = config.category === 'competitive'
  const showCompetitiveTimer =
    isCompetitive && !flags.cognitiveDementia

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

  const effectiveTimeLimit = useMemo(() => {
    if (!question) return 12
    return clampCompetitiveTimeLimitSeconds(
      question.timeLimit ?? config.competitiveTimeLimitSeconds,
      config.targetGroup
    )
  }, [question, config.competitiveTimeLimitSeconds, config.targetGroup])

  const remainingSecondsRef = useRef(effectiveTimeLimit)
  const goNextRef = useRef<() => void>(() => {})

  useEffect(() => {
    remainingSecondsRef.current = effectiveTimeLimit
  }, [question?.id, effectiveTimeLimit])

  const { correctSoFar, answeredSoFar, pointsSoFar } = useMemo(() => {
    if (!quiz) {
      return { correctSoFar: 0, answeredSoFar: 0, pointsSoFar: 0 }
    }
    let correct = 0
    let answered = 0
    let points = 0
    for (let i = 0; i < quiz.questions.length; i++) {
      const s = perQuestion[i]
      if (!s?.revealed) continue
      if (isCompetitive) {
        answered += 1
        points += s.pointsEarned ?? 0
        if (
          s.selected !== null &&
          s.selected === quiz.questions[i].correctAnswerIndex
        ) {
          correct += 1
        }
      } else {
        if (s.selected === null) continue
        answered += 1
        if (s.selected === quiz.questions[i].correctAnswerIndex) correct += 1
      }
    }
    return { correctSoFar: correct, answeredSoFar: answered, pointsSoFar: points }
  }, [quiz, perQuestion, isCompetitive])
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
      if (isCompetitive) {
        const rem = remainingSecondsRef.current
        const correct = optionIndex === question.correctAnswerIndex
        const pts = competitivePointsForAnswer(
          correct,
          rem,
          effectiveTimeLimit,
          config.targetGroup
        )
        updateSlot(index, {
          selected: optionIndex,
          revealed: true,
          timedOut: false,
          pointsEarned: pts,
        })
        return
      }
      updateSlot(index, {
        selected: optionIndex,
        revealed: true,
      })
    },
    [
      question,
      revealed,
      index,
      updateSlot,
      isCompetitive,
      effectiveTimeLimit,
      config.targetGroup,
    ]
  )

  const handleTimeExpired = useCallback(() => {
    if (!question || revealed || !isCompetitive) return
    updateSlot(index, {
      revealed: true,
      selected: null,
      timedOut: true,
      pointsEarned: 0,
    })
  }, [question, revealed, isCompetitive, index, updateSlot])

  const revealAnswerOnly = useCallback(() => {
    if (revealed || !question) return
    updateSlot(index, { revealed: true })
  }, [question, revealed, index, updateSlot])

  const goNext = useCallback(() => {
    if (!quiz || !question || !revealed) return
    if (isLast) {
      let score: number
      if (isCompetitive) {
        score = quiz.questions.reduce((acc, _, i) => {
          const s = perQuestion[i]
          if (!s?.revealed) return acc
          return acc + (s.pointsEarned ?? 0)
        }, 0)
      } else {
        score = quiz.questions.reduce((acc, q, i) => {
          const s = perQuestion[i]
          if (!s) return acc
          return (
            acc +
            (s.revealed && s.selected === q.correctAnswerIndex ? 1 : 0)
          )
        }, 0)
      }
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
    isCompetitive,
  ])

  useEffect(() => {
    goNextRef.current = goNext
  }, [goNext])

  useEffect(() => {
    if (!isCompetitive || !quiz) return
    const s = perQuestion[index]
    if (!s?.revealed || !s.timedOut) return
    const id = window.setTimeout(() => {
      goNextRef.current()
    }, 2800)
    return () => window.clearTimeout(id)
  }, [isCompetitive, quiz, index, perQuestion])

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

      const maxIdx = question.options.length - 1
      const numpadToIndex: Record<string, number> = {
        Numpad1: 0,
        Numpad2: 1,
        Numpad3: 2,
        Numpad4: 3,
      }

      if (!revealed) {
        const np = numpadToIndex[e.code]
        if (np !== undefined && np <= maxIdx) {
          e.preventDefault()
          pickOption(np)
          return
        }
        if (e.key >= '1' && e.key <= '4') {
          const idx = Number(e.key) - 1
          if (idx <= maxIdx) {
            e.preventDefault()
            pickOption(idx)
          }
          return
        }
      }

      if (e.key === ' ' || e.key === 'Enter') {
        if (e.repeat) return
        e.preventDefault()
        if (revealed) {
          goNext()
        } else if (!isCompetitive) {
          revealAnswerOnly()
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    quiz,
    question,
    revealed,
    pickOption,
    goNext,
    revealAnswerOnly,
    isCompetitive,
    question?.options.length,
  ])

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

  const shellClass = flags.dyslexia ? 'font-dyslexia leading-[1.8]' : ''
  const rootChrome =
    flags.visual
      ? 'bg-[#0a0a0a] text-neutral-50'
      : flags.creamyBackground
        ? 'bg-[#fef9f0] text-stone-900'
        : 'bg-gray-950 text-white'
  const headerBorder = lightChrome
    ? 'border-stone-300/90'
    : flags.visual
      ? 'border-amber-500/50'
      : 'border-slate-800/80'
  const optionGap = flags.largeTouch ? 'gap-5 md:gap-6' : 'gap-4 md:gap-5'
  const iconSize = 'h-6 w-6 shrink-0'
  const maxKey = question.options.length
  const keyHint = maxKey === 3 ? '1 až 3' : '1 až 4'

  return (
    <div
      className={`flex min-h-[100dvh] w-full flex-col ${rootChrome} ${shellClass}`}
    >
      <header
        className={`flex shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-4 md:px-10 md:py-5 ${headerBorder}`}
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={goBack}
          disabled={index === 0}
          aria-disabled={index === 0}
          className={navButtonClass('back', lightChrome)}
        >
          <ArrowLeft className={iconSize} aria-hidden />
          Zpět
        </motion.button>
        <div className="order-last flex w-full flex-col items-center gap-1 text-center md:order-none md:w-auto">
          <p
            className={`text-lg font-bold tracking-wide md:text-xl ${
              lightChrome ? 'text-amber-900' : 'text-amber-200/95'
            }`}
          >
            Otázka {index + 1} z {total}
          </p>
          <p
            className={`text-sm font-semibold tabular-nums md:text-base ${
              lightChrome ? 'text-emerald-800' : 'text-emerald-300/95'
            }`}
            aria-live="polite"
            aria-atomic="true"
          >
            {isCompetitive ? (
              <>
                Body: {pointsSoFar}
                {answeredSoFar > 0
                  ? ` · správně ${correctSoFar} z ${answeredSoFar}`
                  : null}
              </>
            ) : (
              <>
                Správně: {correctSoFar}
                {answeredSoFar > 0 ? ` z ${answeredSoFar}` : ''}
              </>
            )}
          </p>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleCancel}
          className={navButtonClass('cancel', lightChrome)}
        >
          <X className={iconSize} aria-hidden />
          Zrušit kvíz
        </motion.button>
      </header>

      <main className="flex flex-1 flex-col items-center px-4 py-6 md:px-12 md:py-10 lg:py-12">
        <p
          className={`mb-2 max-w-5xl text-center text-sm font-medium uppercase tracking-widest ${
            lightChrome ? 'text-stone-500' : 'text-slate-500'
          }`}
        >
          {quiz.title}
        </p>
        <p
          className={`mb-6 max-w-3xl text-center text-xs md:text-sm ${
            lightChrome ? 'text-stone-600' : 'text-slate-600'
          }`}
        >
          {isCompetitive ? (
            <>
              Soutěžní režim: klávesy{' '}
              <kbd
                className={`rounded px-1.5 py-0.5 font-mono ${
                  lightChrome
                    ? 'bg-stone-200 text-stone-800'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                1
              </kbd>
              {' až '}
              <kbd
                className={`rounded px-1.5 py-0.5 font-mono ${
                  lightChrome
                    ? 'bg-stone-200 text-stone-800'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {maxKey}
              </kbd>{' '}
              ({keyHint}) vyberou odpověď.
              {showCompetitiveTimer
                ? ' Po vypršení času se zobrazí správná odpověď a hra pokračuje.'
                : ' Časovač je vypnutý (nastavení přístupnosti).'}
            </>
          ) : (
            <>
              Klávesnice: klávesy{' '}
              <kbd
                className={`rounded px-1.5 py-0.5 font-mono ${
                  lightChrome
                    ? 'bg-stone-200 text-stone-800'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                1
              </kbd>
              {' až '}
              <kbd
                className={`rounded px-1.5 py-0.5 font-mono ${
                  lightChrome
                    ? 'bg-stone-200 text-stone-800'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {maxKey}
              </kbd>{' '}
              ({keyHint}) vyberou odpověď ·{' '}
              <kbd
                className={`rounded px-1.5 py-0.5 font-mono ${
                  lightChrome
                    ? 'bg-stone-200 text-stone-800'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                Mezerník
              </kbd>{' '}
              nebo{' '}
              <kbd
                className={`rounded px-1.5 py-0.5 font-mono ${
                  lightChrome
                    ? 'bg-stone-200 text-stone-800'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                Enter
              </kbd>{' '}
              odhalí odpověď nebo pokračuje
            </>
          )}
        </p>

        {showCompetitiveTimer && !revealed ? (
          <TimedQuestion
            key={question.id}
            durationSeconds={effectiveTimeLimit}
            active={!revealed}
            onExpire={handleTimeExpired}
            showUrgentCue={config.targetGroup !== 'seniors'}
            onRemainingSeconds={(n) => {
              remainingSecondsRef.current = n
            }}
          />
        ) : null}

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
              className={`mx-auto max-w-4xl text-center text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl ${
                lightChrome ? 'text-stone-900' : 'text-white'
              }`}
            >
              {question.questionText}
            </motion.h2>

            {!flags.hideMedia && question.media?.kind === 'image' && (
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

            {!flags.hideMedia && question.media?.kind === 'video' && (
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

            {!flags.hideMedia &&
              question.media &&
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

                const idle = optionPalette[i] ?? optionPalette[0]
                const touchPad = flags.largeTouch
                  ? 'min-h-[4.25rem] px-6 py-7 md:px-8 md:py-10'
                  : 'px-5 py-6 md:px-7 md:py-8'
                const defaultText =
                  lightChrome || (flags.cognitivePastel && flags.creamyBackground)
                    ? ''
                    : ' text-white'
                let surface = `w-full rounded-2xl border-2 ${touchPad} text-left text-2xl font-bold leading-snug shadow-lg transition-colors focus:outline-none focus-visible:ring-4 md:text-3xl ${defaultText} ${idle}`

                if (revealed) {
                  if (isCorrect) {
                    const hear =
                      flags.hearingVisualFeedback
                        ? ' ring-4 ring-cyan-300 ring-offset-2 ring-offset-transparent'
                        : ''
                    surface =
                      `w-full rounded-2xl border-2 border-green-300 bg-green-500 ${touchPad} text-left text-2xl font-extrabold leading-snug text-white shadow-[0_0_40px_rgba(34,197,94,0.45)] focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300 md:text-3xl${hear}`
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
                    aria-label={
                      flags.visual
                        ? `Možnost ${String.fromCharCode(65 + i)}: ${opt}`
                        : undefined
                    }
                  >
                    <span
                      className={`mr-3 inline-block min-w-[2ch] font-black ${
                        lightChrome ||
                        (flags.cognitivePastel && flags.creamyBackground)
                          ? 'text-stone-700'
                          : 'text-white/90'
                      }`}
                    >
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </motion.button>
                )
              })}
            </div>

            <AnimatePresence>
              {revealed && slot?.timedOut ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="mt-10 w-full max-w-5xl border-l-4 border-rose-400 bg-rose-950/50 px-6 py-5 text-xl leading-relaxed text-rose-50 shadow-lg md:mt-12 md:px-8 md:py-6 md:text-2xl"
                  role="alert"
                  aria-live="assertive"
                >
                  <p className="font-extrabold text-rose-200">Čas vypršel!</p>
                  <p className="mt-3 text-rose-50/95">
                    Bohužel, čas vypršel. Správná odpověď byla:{' '}
                    <span className="font-bold text-white">
                      {String.fromCharCode(65 + question.correctAnswerIndex)}.{' '}
                      {question.options[question.correctAnswerIndex]}
                    </span>
                  </p>
                  {question.explanation.trim() ? (
                    <p className="mt-4 text-lg text-rose-100/90 md:text-xl">
                      <span className="font-semibold text-rose-200">Vysvětlení: </span>
                      {question.explanation}
                    </p>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {revealed &&
              !slot?.timedOut &&
              isCompetitive &&
              slot &&
              slot.selected !== null &&
              slot.pointsEarned !== undefined ? (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.28 }}
                  className="mt-8 text-center text-xl font-bold text-amber-200 md:text-2xl"
                >
                  {slot.selected === question.correctAnswerIndex
                    ? `+${slot.pointsEarned} bodů`
                    : '0 bodů (špatná odpověď)'}
                </motion.p>
              ) : null}
            </AnimatePresence>

            <AnimatePresence>
              {revealed && !slot?.timedOut && question.explanation.trim() ? (
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
              {revealed && !slot?.timedOut && (
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
            {revealed && slot?.timedOut ? (
              <p className="mt-6 text-center text-sm text-slate-500">
                Za chvíli následuje další otázka…
              </p>
            ) : null}
          </motion.article>
        </AnimatePresence>
      </main>
    </div>
  )
}

export function QuizPlayer() {
  const gameMode = useQuizStore((s) => s.gameMode)
  if (gameMode === 'multi') {
    return <MultiplayerQuizPlayer />
  }
  return <SinglePlayerQuiz />
}
