import { create } from 'zustand'
import type { GeneratedQuiz, QuizConfiguration } from '@/types'

export type AppStep = 'wizard' | 'loading' | 'playing' | 'results'

const defaultConfig: QuizConfiguration = {
  targetGroup: 'adults',
  handicaps: ['none'],
  category: 'knowledge',
  theme: 'general',
  quizLength: 'medium',
}

interface QuizState {
  step: AppStep
  config: QuizConfiguration
  quiz: GeneratedQuiz | null
  quizScore: number
  generationError: string | null
  setStep: (step: AppStep) => void
  setConfig: (partial: Partial<QuizConfiguration>) => void
  setQuiz: (quiz: GeneratedQuiz | null) => void
  setQuizScore: (score: number) => void
  /** Ukončí rozhraný kvíz a vrátí na průvodce (nastavení zůstane). */
  cancelQuiz: () => void
  setGenerationError: (message: string | null) => void
  reset: () => void
}

export const useQuizStore = create<QuizState>((set) => ({
  step: 'wizard',
  config: defaultConfig,
  quiz: null,
  quizScore: 0,
  generationError: null,
  setStep: (step) => set({ step }),
  setConfig: (partial) =>
    set((s) => ({
      config: { ...s.config, ...partial },
    })),
  setQuiz: (quiz) => set({ quiz }),
  setQuizScore: (quizScore) => set({ quizScore }),
  cancelQuiz: () =>
    set({
      quiz: null,
      step: 'wizard',
      quizScore: 0,
      generationError: null,
    }),
  setGenerationError: (generationError) => set({ generationError }),
  reset: () =>
    set({
      step: 'wizard',
      config: defaultConfig,
      quiz: null,
      quizScore: 0,
      generationError: null,
    }),
}))
