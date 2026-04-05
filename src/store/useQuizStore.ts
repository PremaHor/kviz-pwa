import { create } from 'zustand'
import type { GeneratedQuiz, QuizConfiguration } from '@/types'

export type AppStep =
  | 'wizard'
  | 'loading'
  | 'generation-error'
  | 'lobby'
  | 'playing'
  | 'results'

export type GameMode = 'single' | 'multi'

export type MultiplayerStatus = 'lobby' | 'waiting' | 'playing' | 'results'

export type MultiplayerPlayer = {
  id: string
  name: string
  score: number
}

export type MultiplayerState = {
  roomCode: string | null
  players: MultiplayerPlayer[]
  currentPlayerId: string | null
  /** Hráč, který místnost vytvořil (pro zobrazení v lobby). */
  hostPlayerId: string | null
  isHost: boolean
  status: MultiplayerStatus
  currentQuestionIndex: number
  /** Aktuální kolo: hráč → index odpovědi */
  roundAnswers: Record<string, number>
}

const defaultMultiplayer = (): MultiplayerState => ({
  roomCode: null,
  players: [],
  currentPlayerId: null,
  hostPlayerId: null,
  isHost: false,
  status: 'lobby',
  currentQuestionIndex: 0,
  roundAnswers: {},
})

function randomRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 4; i++) {
    s += chars[Math.floor(Math.random() * chars.length)]!
  }
  return s
}

function newId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const defaultConfig: QuizConfiguration = {
  targetGroup: 'adults',
  handicaps: ['none'],
  category: 'knowledge',
  theme: 'ad_general',
  customThemeText: '',
  quizLength: 'medium',
  competitiveTimeLimitSeconds: 12,
}

interface QuizState {
  step: AppStep
  config: QuizConfiguration
  quiz: GeneratedQuiz | null
  quizScore: number
  generationError: string | null
  generationAbort: (() => void) | null
  gameMode: GameMode
  /** Alias pro kompatibilitu s požadavkem (kód místnosti). */
  multiplayer: MultiplayerState
  setStep: (step: AppStep) => void
  setConfig: (partial: Partial<QuizConfiguration>) => void
  setQuiz: (quiz: GeneratedQuiz | null) => void
  setQuizScore: (score: number) => void
  cancelQuiz: () => void
  setGenerationError: (message: string | null) => void
  /** Nastaví funkci zrušení probíhajícího generování (AbortController). */
  setGenerationAbort: (fn: (() => void) | null) => void
  reset: () => void
  setGameMode: (mode: GameMode) => void
  createMockRoom: (playerName: string) => void
  joinMockRoom: (roomCode: string, playerName: string) => void
  startMockGame: () => void
  submitMockAnswer: (questionIndex: number, answerIndex: number) => void
  nextMockQuestion: () => void
}

export const useQuizStore = create<QuizState>((set, get) => ({
  step: 'wizard',
  config: defaultConfig,
  quiz: null,
  quizScore: 0,
  generationError: null,
  generationAbort: null,
  gameMode: 'single',
  multiplayer: defaultMultiplayer(),

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
      generationAbort: null,
      gameMode: 'single',
      multiplayer: defaultMultiplayer(),
    }),

  setGenerationError: (generationError) => set({ generationError }),

  setGenerationAbort: (fn) => set({ generationAbort: fn }),

  reset: () =>
    set({
      step: 'wizard',
      config: defaultConfig,
      quiz: null,
      quizScore: 0,
      generationError: null,
      generationAbort: null,
      gameMode: 'single',
      multiplayer: defaultMultiplayer(),
    }),

  setGameMode: (mode) =>
    set(() => ({
      gameMode: mode,
      ...(mode === 'single' ? { multiplayer: defaultMultiplayer() } : {}),
    })),

  createMockRoom: (playerName) => {
    const playerId = newId()
    const name = playerName.trim() || 'Hráč'
    set({
      gameMode: 'multi',
      multiplayer: {
        roomCode: randomRoomCode(),
        players: [{ id: playerId, name, score: 0 }],
        currentPlayerId: playerId,
        hostPlayerId: playerId,
        isHost: true,
        status: 'lobby',
        currentQuestionIndex: 0,
        roundAnswers: {},
      },
    })
  },

  joinMockRoom: (roomCode, playerName) => {
    const playerId = newId()
    const name = playerName.trim() || 'Hráč'
    const code = roomCode.trim().toUpperCase().slice(0, 8) || 'MOCK'
    set((s) => {
      const prev = s.multiplayer
      const nextPlayers = [
        ...prev.players,
        { id: playerId, name, score: 0 },
      ]
      return {
        gameMode: 'multi',
        multiplayer: {
          ...prev,
          roomCode: code,
          players: nextPlayers,
          currentPlayerId: playerId,
          hostPlayerId: prev.hostPlayerId ?? nextPlayers[0]?.id ?? null,
          isHost: false,
          status: 'lobby',
          currentQuestionIndex: 0,
          roundAnswers: {},
        },
      }
    })
  },

  startMockGame: () =>
    set((s) => ({
      multiplayer: {
        ...s.multiplayer,
        status: 'playing',
        currentQuestionIndex: 0,
        roundAnswers: {},
        players: s.multiplayer.players.map((p) => ({ ...p, score: 0 })),
      },
    })),

  submitMockAnswer: (questionIndex, answerIndex) => {
    const s = get()
    const quiz = s.quiz
    const m = s.multiplayer
    if (!quiz || m.status !== 'playing') return
    if (questionIndex !== m.currentQuestionIndex) return
    const pid = m.currentPlayerId
    if (!pid || m.roundAnswers[pid] !== undefined) return

    const q = quiz.questions[questionIndex]
    if (!q) return
    const optCount = q.options.length
    if (answerIndex < 0 || answerIndex >= optCount) return

    let roundAnswers = { ...m.roundAnswers, [pid]: answerIndex }
    for (const p of m.players) {
      if (roundAnswers[p.id] === undefined) {
        roundAnswers[p.id] = Math.floor(Math.random() * optCount)
      }
    }

    const correct = q.correctAnswerIndex
    const players = m.players.map((p) => ({
      ...p,
      score: p.score + (roundAnswers[p.id] === correct ? 1 : 0),
    }))

    set({
      multiplayer: {
        ...m,
        roundAnswers,
        players,
        status: 'waiting',
      },
    })
  },

  nextMockQuestion: () => {
    const s = get()
    const quiz = s.quiz
    const m = s.multiplayer
    if (!quiz) return
    const next = m.currentQuestionIndex + 1
    if (next >= quiz.questions.length) {
      const me = m.players.find((p) => p.id === m.currentPlayerId)
      set({
        multiplayer: {
          ...m,
          status: 'results',
          roundAnswers: {},
        },
        quizScore: me?.score ?? 0,
      })
      return
    }
    set({
      multiplayer: {
        ...m,
        currentQuestionIndex: next,
        roundAnswers: {},
        status: 'playing',
      },
    })
  },
}))
