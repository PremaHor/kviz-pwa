import { motion } from 'framer-motion'
import { useQuizStore } from '@/store/useQuizStore'

export function LobbyScreen() {
  const quiz = useQuizStore((s) => s.quiz)
  const multiplayer = useQuizStore((s) => s.multiplayer)
  const startMockGame = useQuizStore((s) => s.startMockGame)
  const setStep = useQuizStore((s) => s.setStep)

  const handleStart = () => {
    startMockGame()
    setStep('playing')
  }

  return (
    <div className="w-full max-w-md space-y-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-white">Lobby</h1>
        <p className="mt-2 text-sm text-slate-400">
          Kvíz je připraven. Sdílejte kód s ostatními (mock jen na tomto zařízení).
        </p>
      </div>

      {quiz ? (
        <p className="text-sm text-slate-300">
          <span className="text-slate-500">Kvíz:</span> {quiz.title}
        </p>
      ) : null}

      <div className="rounded-2xl border border-indigo-500/40 bg-indigo-950/30 px-6 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-indigo-200/80">
          Kód místnosti
        </p>
        <p className="mt-2 font-mono text-4xl font-bold tracking-[0.2em] text-indigo-100">
          {multiplayer.roomCode ?? '—'}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-600/80 bg-slate-800/50 p-5 text-left">
        <p className="text-center text-sm font-medium text-slate-300">Hráči</p>
        <ul className="mt-3 space-y-2">
          {multiplayer.players.length === 0 ? (
            <li className="text-center text-sm text-slate-500">Zatím nikdo</li>
          ) : (
            multiplayer.players.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-slate-900/50 px-3 py-2 text-sm text-white"
              >
                <span>{p.name}</span>
                {multiplayer.hostPlayerId === p.id ? (
                  <span className="text-xs text-emerald-400">hostitel</span>
                ) : null}
              </li>
            ))
          )}
        </ul>
      </div>

      {multiplayer.isHost ? (
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleStart}
          className="w-full rounded-xl bg-indigo-500 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-400"
        >
          Spustit hru
        </motion.button>
      ) : (
        <p className="text-sm text-slate-400">
          Počkejte, až hostitel spustí hru.
        </p>
      )}

      <button
        type="button"
        onClick={() => setStep('wizard')}
        className="text-sm text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
      >
        Zpět do průvodce
      </button>
    </div>
  )
}
