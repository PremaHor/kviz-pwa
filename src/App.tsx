import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { GeneratingScreen } from '@/components/GeneratingScreen'
import { QuizPlayer } from '@/components/QuizPlayer'
import { ResultsScreen } from '@/components/ResultsScreen'
import { Wizard } from '@/components/Wizard'
import { generateQuiz } from '@/services/aiService'
import { useQuizStore } from '@/store/useQuizStore'

const screenVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export default function App() {
  const step = useQuizStore((s) => s.step)
  const config = useQuizStore((s) => s.config)
  const setQuiz = useQuizStore((s) => s.setQuiz)
  const setStep = useQuizStore((s) => s.setStep)
  const setGenerationError = useQuizStore((s) => s.setGenerationError)

  const loadingRun = useRef(0)

  useEffect(() => {
    if (step !== 'loading') return
    const runId = ++loadingRun.current
    let cancelled = false

    ;(async () => {
      try {
        const quiz = await generateQuiz(config)
        if (cancelled || runId !== loadingRun.current) return
        setGenerationError(null)
        setQuiz(quiz)
        setStep('playing')
      } catch (e) {
        if (!cancelled && runId === loadingRun.current) {
          const msg =
            e instanceof Error
              ? e.message
              : typeof e === 'object' &&
                  e !== null &&
                  'message' in e &&
                  typeof (e as { message: unknown }).message === 'string'
                ? (e as { message: string }).message
                : 'Generování kvízu se nezdařilo.'
          setGenerationError(msg)
          setStep('wizard')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [step, config, setQuiz, setStep, setGenerationError])

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Přeskočit na obsah
      </a>
      <main
        id="main-content"
        className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14"
        tabIndex={-1}
      >
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === 'wizard' && (
              <motion.div
                key="wizard"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center"
              >
                <Wizard />
              </motion.div>
            )}
            {step === 'loading' && (
              <motion.div
                key="loading"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center"
              >
                <GeneratingScreen />
              </motion.div>
            )}
            {step === 'playing' && (
              <motion.div
                key="playing"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center"
              >
                <QuizPlayer />
              </motion.div>
            )}
            {step === 'results' && (
              <motion.div
                key="results"
                variants={screenVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center"
              >
                <ResultsScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <footer className="pb-6 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-400">Kvíz na míru</p>
        <p className="mt-1 max-w-md mx-auto leading-relaxed">
          PWA s důrazem na přístupnost · obsah z AI podle vašeho nastavení
        </p>
      </footer>
    </div>
  )
}
