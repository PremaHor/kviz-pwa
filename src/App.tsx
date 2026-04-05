import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { AccessibleWrapper } from '@/components/accessibility/AccessibleWrapper'
import {
  GenerationErrorScreen,
  LoadingScreen,
} from '@/components/LoadingScreen'
import { LobbyScreen } from '@/components/multiplayer/LobbyScreen'
import { QuizPlayer } from '@/components/QuizPlayer'
import { ResultsScreen } from '@/components/ResultsScreen'
import { Wizard } from '@/components/Wizard'
import { useAccessibility } from '@/hooks/useAccessibility'
import { expectedGenerationSeconds } from '@/lib/expectedGenerationTime'
import { generateQuiz } from '@/services/aiService'
import { useQuizStore } from '@/store/useQuizStore'

const screenVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

function isAbortError(e: unknown): boolean {
  return (
    (e instanceof DOMException && e.name === 'AbortError') ||
    (e instanceof Error && e.name === 'AbortError')
  )
}

export default function App() {
  const reduceMotion = useAccessibility().reduceMotion
  const step = useQuizStore((s) => s.step)
  const config = useQuizStore((s) => s.config)
  const setQuiz = useQuizStore((s) => s.setQuiz)
  const setStep = useQuizStore((s) => s.setStep)
  const setGenerationError = useQuizStore((s) => s.setGenerationError)
  const setGenerationAbort = useQuizStore((s) => s.setGenerationAbort)

  const loadingRun = useRef(0)

  useEffect(() => {
    if (step !== 'loading') {
      setGenerationAbort(null)
      return
    }

    const runId = ++loadingRun.current
    const ac = new AbortController()
    setGenerationAbort(() => () => ac.abort())

    const timeoutMs = (expectedGenerationSeconds(config) + 120) * 1000
    let timeoutId: number | undefined

    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(() => {
        reject(
          new Error(
            'Generování trvalo příliš dlouho. Zkuste to znovu nebo zkraťte kvíz.'
          )
        )
      }, timeoutMs)
    })

    ;(async () => {
      const genPromise = generateQuiz(config, ac.signal)
      try {
        const quiz = await Promise.race([genPromise, timeoutPromise])
        if (timeoutId !== undefined) window.clearTimeout(timeoutId)
        if (runId !== loadingRun.current) return
        setGenerationError(null)
        setQuiz(quiz)
        const mode = useQuizStore.getState().gameMode
        setStep(mode === 'multi' ? 'lobby' : 'playing')
      } catch (e) {
        if (timeoutId !== undefined) window.clearTimeout(timeoutId)
        void genPromise.catch(() => {})
        if (runId !== loadingRun.current) return

        if (isAbortError(e)) {
          setGenerationError(null)
          setStep('wizard')
          return
        }

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
        setStep('generation-error')
      }
    })()

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      setGenerationAbort(null)
      ac.abort()
    }
  }, [step, config, setQuiz, setStep, setGenerationError, setGenerationAbort])

  const isWidePlaying = step === 'playing'

  return (
    <MotionConfig reducedMotion={reduceMotion ? 'always' : 'user'}>
      <AccessibleWrapper className="flex min-h-dvh flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Přeskočit na obsah
        </a>
        <main
          id="main-content"
          className={
            isWidePlaying
              ? 'flex flex-1 flex-col items-stretch justify-stretch p-0'
              : 'flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-14'
          }
          tabIndex={-1}
        >
          <div
            className={
              isWidePlaying ? 'w-full max-w-none' : 'w-full max-w-2xl'
            }
          >
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
                  className="flex w-full justify-center"
                >
                  <LoadingScreen />
                </motion.div>
              )}
              {step === 'generation-error' && (
                <motion.div
                  key="generation-error"
                  variants={screenVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex w-full justify-center"
                >
                  <GenerationErrorScreen />
                </motion.div>
              )}
              {step === 'lobby' && (
                <motion.div
                  key="lobby"
                  variants={screenVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex w-full justify-center"
                >
                  <LobbyScreen />
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
                  className="w-full"
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
      </AccessibleWrapper>
    </MotionConfig>
  )
}
