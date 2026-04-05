import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

function secondsWordCs(n: number): string {
  if (n === 1) return 'sekunda'
  if (n >= 11 && n <= 14) return 'sekund'
  const m = n % 10
  if (m >= 2 && m <= 4) return 'sekundy'
  return 'sekund'
}

type TimedQuestionProps = {
  /** Délka kola v sekundách (reset při změně klíče / props). */
  durationSeconds: number
  /** Když false, časovač se zastaví (např. po odpovědi). */
  active: boolean
  /** Zavolá se jednou při dosažení nuly (čas vypršel). */
  onExpire: () => void
  /** Aktualizace zbývajícího času (pro bodování). */
  onRemainingSeconds?: (remaining: number) => void
  /** U seniorů vypnout nápis „Rychle!“ a agresivnější zvýraznění. Výchozí true. */
  showUrgentCue?: boolean
  /** Volitelný obsah pod časovačem. */
  children?: React.ReactNode
}

/**
 * Obal soutěžní otázky: odpočet, progress bar, zvýraznění posledních 3 s, automatický timeout.
 */
export function TimedQuestion({
  durationSeconds,
  active,
  onExpire,
  onRemainingSeconds,
  showUrgentCue = true,
  children,
}: TimedQuestionProps) {
  const [remaining, setRemaining] = useState(durationSeconds)
  const expiredRef = useRef(false)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    setRemaining(durationSeconds)
    expiredRef.current = false
  }, [durationSeconds])

  useEffect(() => {
    onRemainingSeconds?.(remaining)
  }, [remaining, onRemainingSeconds])

  useEffect(() => {
    if (!active) return
    if (remaining <= 0) return
    const id = window.setTimeout(() => {
      setRemaining((r) => Math.max(0, r - 1))
    }, 1000)
    return () => window.clearTimeout(id)
  }, [active, remaining])

  useEffect(() => {
    if (!active) return
    if (remaining !== 0) return
    if (expiredRef.current) return
    expiredRef.current = true
    onExpireRef.current()
  }, [remaining, active])

  const progress =
    durationSeconds > 0 ? Math.max(0, Math.min(1, remaining / durationSeconds)) : 0
  const urgent = active && remaining > 0 && remaining <= 3
  const rushUi = showUrgentCue && urgent
  const displaySeconds = remaining

  return (
    <div className="flex w-full flex-col items-center">
      <div
        className={`mb-6 w-full max-w-2xl rounded-2xl border-2 px-4 py-4 transition-colors md:px-6 md:py-5 ${
          rushUi
            ? 'border-amber-400/90 bg-amber-950/40 shadow-lg shadow-amber-500/20'
            : urgent
              ? 'border-slate-500/90 bg-slate-900/60'
              : 'border-slate-600/80 bg-slate-900/50'
        }`}
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        aria-label={`Zbývá ${displaySeconds} sekund`}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-lg font-bold tabular-nums text-white sm:text-left">
            ⏱️ Zbývá {displaySeconds} {secondsWordCs(displaySeconds)}
          </p>
          {rushUi ? (
            <motion.p
              className="text-center text-base font-extrabold text-amber-300 sm:text-right"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
            >
              Rychle! 🏆
            </motion.p>
          ) : null}
        </div>
        <div
          className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-800"
          aria-hidden
        >
          <motion.div
            className={`h-full rounded-full ${
              rushUi
                ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                : urgent
                  ? 'bg-sky-600'
                  : 'bg-emerald-500'
            }`}
            initial={false}
            animate={{ width: `${progress * 100}%` }}
            transition={{
              duration: active && remaining > 0 ? 1 : 0.2,
              ease: 'linear',
            }}
          />
        </div>
      </div>
      {children}
    </div>
  )
}
