import type { QuizConfiguration } from '@/types'

export type AccessibilityFlags = {
  dyslexia: boolean
  visual: boolean
  motor: boolean
  cognitive: boolean
}

export function getAccessibilityFlags(
  config: QuizConfiguration
): AccessibilityFlags {
  const h = new Set(config.handicaps.filter((x) => x !== 'none'))
  return {
    dyslexia: h.has('dyslexia'),
    visual: h.has('visual_impairment'),
    motor: h.has('motor_skills'),
    cognitive: h.has('cognitive'),
  }
}

/** Obal karty otázky / náhledu v průvodci */
export function quizSurfaceClass(flags: AccessibilityFlags): string {
  if (flags.visual) {
    return 'rounded-2xl border-2 border-amber-400 bg-neutral-950 p-5 shadow-xl sm:p-6 text-white'
  }
  return 'rounded-2xl border border-slate-600/80 bg-slate-800/50 p-5 shadow-xl sm:p-6'
}

/** Nadpis otázky */
export function quizQuestionTitleClass(flags: AccessibilityFlags): string {
  const base = 'font-semibold leading-snug'
  if (flags.visual) {
    return `${base} text-xl text-white sm:text-2xl`
  }
  if (flags.dyslexia) {
    return `${base} text-lg text-white sm:text-xl leading-relaxed`
  }
  return `${base} text-lg text-white sm:text-xl`
}

/** Mezery mezi možnostmi */
export function quizOptionsGridClass(flags: AccessibilityFlags): string {
  return flags.motor ? 'mt-5 grid gap-4' : 'mt-5 grid gap-3'
}

export function quizOptionPaddingClass(flags: AccessibilityFlags): string {
  return flags.motor ? 'px-4 py-5 min-h-[3.5rem]' : 'px-4 py-3'
}

/** Jedna možnost odpovědi — základ (bez stavu vyhodnocení) */
export function quizOptionIdleClass(flags: AccessibilityFlags): string {
  const pad = quizOptionPaddingClass(flags)
  if (flags.visual) {
    return `rounded-xl border-2 border-amber-300 bg-neutral-900 ${pad} text-left text-base font-semibold text-white transition-colors hover:bg-neutral-800`
  }
  return `rounded-xl border-2 border-slate-600/80 bg-slate-800/60 ${pad} text-left text-base font-medium text-slate-100 transition-colors hover:border-slate-500 hover:bg-slate-700/50`
}

/** Klávesová / čitelná značka A–D */
export function quizOptionLabelClass(flags: AccessibilityFlags): string {
  if (flags.visual) {
    return 'mr-2 font-bold text-amber-300'
  }
  return 'mr-2 font-semibold text-indigo-300'
}

/** Vysvětlení po odhalení odpovědi */
export function quizExplanationClass(flags: AccessibilityFlags): string {
  const text = flags.visual ? 'text-base text-neutral-100' : 'text-sm text-slate-200'
  const border = flags.visual
    ? 'border-amber-400/60 bg-neutral-900'
    : 'border-slate-600/60 bg-slate-900/40'
  const lead = flags.dyslexia || flags.cognitive ? 'leading-relaxed' : 'leading-relaxed'
  return `mt-5 rounded-xl border p-4 ${border} ${text} ${lead}`
}

/** Číslo otázky nad kartou */
export function quizProgressClass(flags: AccessibilityFlags): string {
  const base = 'mb-2 text-center text-slate-400'
  if (flags.visual) {
    return `${base} text-base font-medium text-amber-100/90`
  }
  return `${base} text-sm`
}
