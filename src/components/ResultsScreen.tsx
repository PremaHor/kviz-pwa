import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { BookOpen, PartyPopper, RotateCcw, Sparkles, Target, Trophy } from 'lucide-react'
import { useMemo } from 'react'
import { getAccessibilityFlags } from '@/lib/accessibilityUi'
import { useQuizStore } from '@/store/useQuizStore'

function resultTone(
  pct: number,
  total: number
): {
  headline: string
  subline: string
  Icon: LucideIcon
} {
  if (total === 0) {
    return {
      headline: 'Žádné otázky',
      subline: 'Zkuste znovu vygenerovat kvíz.',
      Icon: BookOpen,
    }
  }
  if (pct === 100) {
    return {
      headline: 'Naprosto výborně!',
      subline: 'Všechny odpovědi sedí — pokračujte v tomhle stylu.',
      Icon: Sparkles,
    }
  }
  if (pct >= 80) {
    return {
      headline: 'Skvělá práce!',
      subline: 'Většinu máte v malíku. Projďte si ještě případné výjimky ve vysvětleních.',
      Icon: Trophy,
    }
  }
  if (pct >= 50) {
    return {
      headline: 'Dobrý výsledek',
      subline: 'Polovina a víc je solidní základ — další kolo vás posune dál.',
      Icon: BookOpen,
    }
  }
  if (pct >= 25) {
    return {
      headline: 'Ještě to doladíte',
      subline: 'Nebuďte na sebe přísní — zkuste kvíz znovu nebo jiné téma.',
      Icon: Target,
    }
  }
  return {
    headline: 'Zkuste to znovu',
    subline: 'Učení je opakování. Nové kolo nebo jemnější téma často pomůže.',
    Icon: Target,
  }
}

export function ResultsScreen() {
  const quiz = useQuizStore((s) => s.quiz)
  const config = useQuizStore((s) => s.config)
  const quizScore = useQuizStore((s) => s.quizScore)
  const reset = useQuizStore((s) => s.reset)

  const flags = useMemo(() => getAccessibilityFlags(config), [config])
  const total = quiz?.questions.length ?? 0
  const percent = total > 0 ? Math.round((quizScore / total) * 100) : 0
  const { headline, subline, Icon } = useMemo(
    () => resultTone(percent, total),
    [percent, total]
  )

  const cardClass = flags.visual
    ? 'w-full max-w-md rounded-2xl border-2 border-amber-400 bg-neutral-950 p-8 text-center shadow-2xl text-white'
    : 'w-full max-w-md rounded-2xl border border-slate-600/80 bg-slate-800/60 p-8 text-center shadow-2xl'

  const titleClass = flags.visual
    ? 'text-3xl font-bold text-white'
    : 'text-2xl font-bold text-white'

  const scoreClass = flags.visual
    ? 'mt-6 text-5xl font-bold tabular-nums text-white sm:text-6xl'
    : 'mt-6 text-4xl font-bold tabular-nums text-white sm:text-5xl'

  const buttonClass = flags.visual
    ? 'mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-amber-400 bg-amber-500 px-5 py-3.5 text-base font-bold text-black shadow-lg hover:bg-amber-400'
    : 'mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500 px-5 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400'

  const percentClass = flags.visual ? 'mt-2 text-base text-amber-100/90' : 'mt-2 text-sm text-slate-400'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`${cardClass} ${flags.dyslexia ? 'font-dyslexia' : ''}`}
      role="region"
      aria-labelledby="results-title"
    >
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20">
        {percent >= 80 && total > 0 ? (
          <PartyPopper className="h-8 w-8 text-indigo-300" aria-hidden />
        ) : (
          <Icon className="h-8 w-8 text-indigo-300" aria-hidden />
        )}
      </div>
      <h1 id="results-title" className={titleClass}>
        {headline}
      </h1>
      <p
        className={
          flags.visual ? 'mt-3 text-sm text-amber-100/85' : 'mt-3 text-sm text-slate-400'
        }
      >
        {subline}
      </p>
      {quiz && (
        <p
          className={
            flags.visual ? 'mt-3 text-amber-100/90' : 'mt-3 text-slate-400'
          }
        >
          <span className="text-slate-500">Kvíz:</span> {quiz.title}
        </p>
      )}
      <p className={scoreClass}>
        {quizScore}
        <span
          className={
            flags.visual
              ? 'text-xl font-semibold text-amber-200/80 sm:text-2xl'
              : 'text-lg font-semibold text-slate-400 sm:text-xl'
          }
        >
          {' '}
          / {total}
        </span>
      </p>
      <p className={percentClass}>
        {total > 0
          ? `${Math.round((quizScore / total) * 100)} % správně`
          : 'Žádné otázky'}
      </p>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => reset()}
        className={buttonClass}
      >
        <RotateCcw className="h-5 w-5" aria-hidden />
        Vytvořit nový kvíz
      </motion.button>
    </motion.div>
  )
}
