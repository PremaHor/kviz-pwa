import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getQuestionCount } from '@/lib/quizLength'
import { useQuizStore } from '@/store/useQuizStore'

const MESSAGES_BASE = [
  'Analyzuji téma...',
  'Vymýšlím otázky...',
  'Aplikuji pravidla přístupnosti...',
] as const

const MESSAGES =
  import.meta.env.VITE_QUIZ_MEDIA === '0'
    ? MESSAGES_BASE
    : [
        ...MESSAGES_BASE,
        'Doplňuji ilustrace nebo krátká videa z veřejných zdrojů — bez navýšení AI…',
      ]

export function GeneratingScreen() {
  const quizLength = useQuizStore((s) => s.config.quizLength)
  const questionCount = useMemo(() => getQuestionCount(quizLength), [quizLength])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length)
    }, 1500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div
      className="flex w-full max-w-md flex-col items-center justify-center gap-8 px-4 py-16 text-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Generování kvízu"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-500/20 ring-2 ring-indigo-400/50"
      >
        <Loader2 className="h-10 w-10 text-indigo-300" aria-hidden />
      </motion.div>
      <div>
        <h1 className="text-xl font-bold text-white sm:text-2xl">
          Připravuji váš kvíz
        </h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          {import.meta.env.VITE_GEMINI_API_KEY?.trim()
            ? questionCount <= 15
              ? 'Plné generování obvykle trvá zhruba půl minuty až minutu. Netrhejte stránku.'
              : questionCount <= 25
                ? 'U střední délky počítejte zhruba jednu až dvě minuty. Netrhejte stránku.'
                : 'Dlouhý kvíz může generovat i několik minut. Netrhejte stránku — o výsledek nepřijdete.'
            : 'Připravujeme ukázkový kvíz — za okamžik budete pokračovat v hře.'}
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={MESSAGES[index]}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-slate-300"
          >
            {MESSAGES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
