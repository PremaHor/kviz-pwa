import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { useQuizStore, type GameMode } from '@/store/useQuizStore'

export function GameModeStep() {
  const gameMode = useQuizStore((s) => s.gameMode)
  const multiplayer = useQuizStore((s) => s.multiplayer)
  const setGameMode = useQuizStore((s) => s.setGameMode)
  const createMockRoom = useQuizStore((s) => s.createMockRoom)
  const joinMockRoom = useQuizStore((s) => s.joinMockRoom)

  const [hostName, setHostName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [joinName, setJoinName] = useState('')
  const [joinOpen, setJoinOpen] = useState(false)

  const selectMode = useCallback(
    (mode: GameMode) => {
      setGameMode(mode)
      if (mode === 'single') {
        setJoinOpen(false)
      }
    },
    [setGameMode]
  )

  const radioClass = (active: boolean) =>
    `flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors ${
      active
        ? 'border-indigo-400 bg-indigo-500/15 text-white'
        : 'border-slate-600/80 bg-slate-800/40 text-slate-200 hover:border-slate-500'
    }`

  return (
    <div className="space-y-4 border-b border-slate-700/80 pb-6">
      <p className="text-center text-sm font-medium text-slate-300" id="gamemode-label">
        Režim hry
      </p>
      <div className="space-y-2" role="radiogroup" aria-labelledby="gamemode-label">
        <motion.button
          type="button"
          role="radio"
          aria-checked={gameMode === 'single'}
          whileTap={{ scale: 0.99 }}
          onClick={() => selectMode('single')}
          className={radioClass(gameMode === 'single')}
        >
          <span
            className={`flex h-4 w-4 shrink-0 rounded-full border-2 ${
              gameMode === 'single'
                ? 'border-indigo-400 bg-indigo-500'
                : 'border-slate-500'
            }`}
            aria-hidden
          />
          <span className="font-semibold">Singleplayer</span>
          <span className="ml-auto text-xs text-slate-400">standard</span>
        </motion.button>
        <motion.button
          type="button"
          role="radio"
          aria-checked={gameMode === 'multi'}
          whileTap={{ scale: 0.99 }}
          onClick={() => selectMode('multi')}
          className={radioClass(gameMode === 'multi')}
        >
          <span
            className={`flex h-4 w-4 shrink-0 rounded-full border-2 ${
              gameMode === 'multi'
                ? 'border-indigo-400 bg-indigo-500'
                : 'border-slate-500'
            }`}
            aria-hidden
          />
          <span className="font-semibold">Multiplayer</span>
          <span className="ml-auto text-xs text-amber-200/80">mock</span>
        </motion.button>
      </div>

      {gameMode === 'multi' ? (
        <div className="space-y-4 rounded-2xl border border-slate-600/60 bg-slate-900/40 p-4">
          {multiplayer.roomCode ? (
            <div className="text-center">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Místnost
              </p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-indigo-200">
                {multiplayer.roomCode}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                Hráči: {multiplayer.players.map((p) => p.name).join(', ') || '—'}
              </p>
              {multiplayer.isHost ? (
                <p className="mt-1 text-xs text-emerald-300/90">Jste hostitel</p>
              ) : (
                <p className="mt-1 text-xs text-slate-400">Hostitel spustí hru po vygenerování kvízu</p>
              )}
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label htmlFor="mock-host-name" className="block text-xs text-slate-400">
                  Vaše jméno (hostitel)
                </label>
                <input
                  id="mock-host-name"
                  type="text"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="např. Jana"
                  maxLength={40}
                  className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/80 focus:outline-none focus:ring-2 focus:ring-indigo-400/25"
                />
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={() => createMockRoom(hostName)}
                  className="w-full rounded-xl bg-indigo-500 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400"
                >
                  Vytvořit místnost
                </motion.button>
              </div>
              <div className="border-t border-slate-700/80 pt-4">
                <button
                  type="button"
                  onClick={() => setJoinOpen((o) => !o)}
                  className="w-full text-center text-sm text-slate-400 hover:text-white"
                >
                  {joinOpen ? 'Skrýt připojení' : 'Připojit se k místnosti'}
                </button>
                {joinOpen ? (
                  <div className="mt-3 space-y-2">
                    <label htmlFor="mock-join-code" className="block text-xs text-slate-400">
                      Kód místnosti
                    </label>
                    <input
                      id="mock-join-code"
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      placeholder="ABCD"
                      maxLength={8}
                      className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 font-mono text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/80 focus:outline-none focus:ring-2 focus:ring-indigo-400/25"
                    />
                    <label htmlFor="mock-join-name" className="block text-xs text-slate-400">
                      Vaše jméno
                    </label>
                    <input
                      id="mock-join-name"
                      type="text"
                      value={joinName}
                      onChange={(e) => setJoinName(e.target.value)}
                      placeholder="např. Petr"
                      maxLength={40}
                      className="w-full rounded-xl border border-white/10 bg-black/25 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/80 focus:outline-none focus:ring-2 focus:ring-indigo-400/25"
                    />
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.98 }}
                      onClick={() => joinMockRoom(joinCode, joinName)}
                      className="w-full rounded-xl border border-slate-500 bg-slate-800 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
                    >
                      Připojit se
                    </motion.button>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}
