import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getQuestionCount } from '@/lib/quizLength'
import { useQuizStore } from '@/store/useQuizStore'

const MESSAGES_BASE = [
  'Rozplétám téma a souvislosti…',
  'Sestavuji strukturu otázek…',
  'Ladím obtížnost podle vašeho nastavení…',
  'Kontroluji srozumitelnost formulací…',
  'Propojuji fakta do souvislostí…',
  'Aplikuji pravidla přístupnosti…',
  'Upravuji formulace pro jasnost…',
  'Dávám finální tvar kvízu…',
  'Ještě chvilku — kvalita má přednost před rychlostí…',
  'Balím výstup pro plynulý průběh hry…',
  'Kontroluji konzistenci tématu napříč otázkami…',
  'Doplňuji kontext, aby odpovědi dávaly smysl…',
] as const

const MESSAGES_MEDIA_EXTRA = [
  'Hledám vhodné obrázky a krátká videa z veřejných zdrojů…',
  'Propojuji média s konkrétními otázkami…',
  'Ověřuji, že média text doplňují, ne rozptylují…',
  'Vybírám zdroje bez dalšího běhu AI…',
] as const

const MESSAGE_INTERVAL_MS = 2800

function pickNextMessage(messages: readonly string[], previous: string | null): string {
  if (messages.length <= 1) return messages[0] ?? ''
  let next = messages[Math.floor(Math.random() * messages.length)]
  let guard = 0
  while (next === previous && guard < 12) {
    next = messages[Math.floor(Math.random() * messages.length)]
    guard++
  }
  return next
}

/** Uzly uvnitř siluety — index 4 je „jádro“ uprostřed */
const NEURAL_NODES: { x: number; y: number }[] = [
  { x: 120, y: 62 },
  { x: 88, y: 88 },
  { x: 152, y: 88 },
  { x: 72, y: 118 },
  { x: 120, y: 118 },
  { x: 168, y: 118 },
  { x: 88, y: 148 },
  { x: 152, y: 148 },
  { x: 120, y: 172 },
]

const NEURAL_EDGES: [number, number][] = [
  [4, 0],
  [4, 1],
  [4, 2],
  [4, 3],
  [4, 5],
  [4, 6],
  [4, 7],
  [4, 8],
  [1, 3],
  [2, 5],
  [0, 1],
  [0, 2],
  [6, 8],
  [7, 8],
]

const BRAIN_PATH =
  'M120 36c22 0 42 10 52 28 8 14 10 32 6 48-2 10-8 20-16 28 6 8 10 18 10 28 0 24-20 44-52 44s-52-20-52-44c0-10 4-20 10-28-8-8-14-18-16-28-4-16-2-34 6-48 10-18 30-28 52-28z'

function NeuralBrainVisual({ reducedMotion }: { reducedMotion: boolean }) {
  const pulse = reducedMotion
    ? { scale: 1, opacity: 0.85 }
    : { scale: [1, 1.12, 1], opacity: [0.55, 1, 0.55] }

  const dashAnimate = reducedMotion ? { strokeDashoffset: 0 } : { strokeDashoffset: [0, -28] }

  return (
    <div
      className="relative mx-auto flex h-[min(18rem,72vw)] w-[min(18rem,72vw)] items-center justify-center"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-indigo-500/25 via-violet-600/10 to-transparent blur-2xl" />
      <div className="relative rounded-[2.5rem] border border-indigo-400/25 bg-slate-950/60 p-6 shadow-[0_0_60px_-12px_rgba(129,140,248,0.45)] ring-1 ring-white/5 backdrop-blur-sm">
        <svg
          viewBox="0 0 240 240"
          className="h-full w-full text-indigo-300/90"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gen-brain-fill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(129 140 248)" stopOpacity="0.22" />
              <stop offset="55%" stopColor="rgb(167 139 250)" stopOpacity="0.12" />
              <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="gen-edge" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="rgb(165 180 252)" stopOpacity="0.15" />
              <stop offset="50%" stopColor="rgb(196 181 253)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="rgb(165 180 252)" stopOpacity="0.15" />
            </linearGradient>
            <filter id="gen-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <motion.path
            d={BRAIN_PATH}
            fill="url(#gen-brain-fill)"
            stroke="currentColor"
            strokeWidth={1}
            strokeOpacity={0.35}
            initial={false}
            animate={
              reducedMotion
                ? { opacity: 0.9 }
                : { opacity: [0.65, 0.95, 0.65], scale: [1, 1.02, 1] }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{ transformOrigin: '120px 118px' }}
          />

          {NEURAL_EDGES.map(([a, b], i) => {
            const A = NEURAL_NODES[a]
            const B = NEURAL_NODES[b]
            return (
              <motion.line
                key={`${a}-${b}`}
                x1={A.x}
                y1={A.y}
                x2={B.x}
                y2={B.y}
                stroke="url(#gen-edge)"
                strokeWidth={1.25}
                strokeLinecap="round"
                strokeDasharray="6 10"
                filter="url(#gen-glow)"
                initial={false}
                animate={dashAnimate}
                transition={{
                  duration: reducedMotion ? 0 : 1.6 + (i % 5) * 0.12,
                  repeat: reducedMotion ? 0 : Infinity,
                  ease: 'linear',
                  delay: i * 0.08,
                }}
              />
            )
          })}

          {NEURAL_NODES.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === 4 ? 5.5 : 3.8}
              className={i === 4 ? 'fill-violet-200' : 'fill-indigo-200'}
              filter="url(#gen-glow)"
              initial={false}
              animate={pulse}
              transition={{
                duration: reducedMotion ? 0 : 2.2 + (i % 4) * 0.15,
                repeat: reducedMotion ? 0 : Infinity,
                ease: 'easeInOut',
                delay: reducedMotion ? 0 : i * 0.14,
              }}
            />
          ))}

          {!reducedMotion ? (
            <circle r={2.4} className="fill-cyan-200" filter="url(#gen-glow)">
              <animateMotion
                dur="3.2s"
                repeatCount="indefinite"
                path="M120 62 L88 88 L72 118 L88 148 L120 172 L152 148 L168 118 L152 88 Z"
                calcMode="linear"
              />
            </circle>
          ) : null}
        </svg>
      </div>
    </div>
  )
}

export function GeneratingScreen() {
  const quizLength = useQuizStore((s) => s.config.quizLength)
  const questionCount = useMemo(() => getQuestionCount(quizLength), [quizLength])
  const reducedMotion = useReducedMotion() ?? false

  const messages = useMemo((): string[] => {
    const base: string[] = [...MESSAGES_BASE]
    if (import.meta.env.VITE_QUIZ_MEDIA !== '0') {
      base.push(...MESSAGES_MEDIA_EXTRA)
    }
    return base
  }, [])

  const prevRef = useRef<string | null>(null)
  const [statusLine, setStatusLine] = useState(() =>
    pickNextMessage(messages, null)
  )

  const rotateMessage = useCallback(() => {
    const next = pickNextMessage(messages, prevRef.current)
    prevRef.current = next
    setStatusLine(next)
  }, [messages])

  useEffect(() => {
    prevRef.current = statusLine
  }, [statusLine])

  useEffect(() => {
    const id = window.setInterval(rotateMessage, MESSAGE_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [rotateMessage])

  return (
    <div
      className="flex w-full max-w-lg flex-col items-center justify-center gap-10 px-4 py-12 text-center sm:py-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Generování kvízu"
    >
      <NeuralBrainVisual reducedMotion={reducedMotion} />

      <div className="w-full max-w-md space-y-4">
        <h1 className="bg-gradient-to-r from-indigo-100 via-white to-violet-200 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
          Připravuji váš kvíz
        </h1>
        <p className="text-sm leading-relaxed text-slate-500">
          {import.meta.env.VITE_DEV_MOCK === '1'
            ? 'Ukázkový režim: za chvíli pokračujete v hře.'
            : questionCount <= 15
              ? 'Generování na serveru obvykle trvá zhruba půl minuty až minutu. Netrhejte stránku.'
              : questionCount <= 25
                ? 'U střední délky počítejte zhruba jednu až dvě minuty. Netrhejte stránku.'
                : 'Dlouhý kvíz může na serveru trvat i několik minut. Netrhejte stránku, o výsledek nepřijdete.'}
        </p>

        <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-indigo-500/20 bg-slate-900/50 px-4 py-3 text-left shadow-inner ring-1 ring-white/5">
          <div
            className="pointer-events-none absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-indigo-400 via-violet-400 to-cyan-400 opacity-90"
            aria-hidden
          />
          <AnimatePresence mode="wait">
            <motion.p
              key={statusLine}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: reducedMotion ? 0.12 : 0.35, ease: 'easeOut' }}
              className="pl-3 text-sm font-medium leading-snug text-indigo-100/95 sm:text-base"
            >
              {statusLine}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
