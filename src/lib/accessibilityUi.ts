import type { QuizConfiguration } from '@/types'
import { combineHandicaps } from '@/lib/accessibility/combineHandicaps'

export type AccessibilityFlags = {
  dyslexia: boolean
  visual: boolean
  /** Zpětná kompatibilita: dyslexie / kognitivní / PAS / cizinci — širší typografie. */
  cognitive: boolean
  cognitiveDementia: boolean
  autism: boolean
  hearing: boolean
  czechLearners: boolean
  hideMedia: boolean
  cognitivePastel: boolean
  largeTouch: boolean
  creamyBackground: boolean
  reduceMotion: boolean
  hearingVisualFeedback: boolean
}

export function getAccessibilityFlags(
  config: QuizConfiguration
): AccessibilityFlags {
  const c = combineHandicaps(config.handicaps)
  return {
    dyslexia: c.dyslexia,
    visual: c.visualImpairment,
    cognitive:
      c.cognitiveDementia ||
      c.autismSpectrum ||
      c.czechLearners ||
      c.dyslexia,
    cognitiveDementia: c.cognitiveDementia,
    autism: c.autismSpectrum,
    hearing: c.hearingImpairment,
    czechLearners: c.czechLearners,
    hideMedia: c.hideQuestionMedia,
    cognitivePastel: c.cognitivePastelUi,
    largeTouch: c.largeTouchTargets,
    creamyBackground: c.creamyBackground,
    reduceMotion: c.reduceMotion,
    hearingVisualFeedback: c.hearingVisualFeedback,
  }
}

/** Obal karty otázky / náhledu v průvodci */
export function quizSurfaceClass(flags: AccessibilityFlags): string {
  if (flags.creamyBackground && !flags.visual) {
    return 'rounded-2xl border-2 border-amber-200/50 bg-[#fffdf8] p-5 shadow-xl sm:p-6 text-stone-900'
  }
  if (flags.visual) {
    return 'rounded-2xl border-2 border-amber-400 bg-neutral-950 p-5 shadow-xl sm:p-6 text-white'
  }
  return 'rounded-2xl border border-slate-600/80 bg-slate-800/50 p-5 shadow-xl sm:p-6'
}

/** Nadpis otázky */
export function quizQuestionTitleClass(flags: AccessibilityFlags): string {
  const base = 'font-semibold'
  const dys = flags.dyslexia ? 'font-dyslexia leading-[1.8]' : 'leading-snug'
  if (flags.visual) {
    return `${base} ${dys} text-xl text-white sm:text-2xl`
  }
  if (flags.creamyBackground) {
    return `${base} ${dys} text-lg text-stone-900 sm:text-xl`
  }
  if (flags.dyslexia) {
    return `${base} ${dys} text-lg text-white sm:text-xl`
  }
  return `${base} text-lg text-white sm:text-xl leading-snug`
}

/** Mezery mezi možnostmi */
export function quizOptionsGridClass(flags: AccessibilityFlags): string {
  const gap = flags.largeTouch ? 'gap-4' : 'gap-3'
  return `mt-5 grid ${gap}`
}

export function quizOptionPaddingClass(flags: AccessibilityFlags): string {
  return flags.largeTouch ? 'px-5 py-5' : 'px-4 py-3'
}

/** Jedna možnost odpovědi, základ (bez stavu vyhodnocení) */
export function quizOptionIdleClass(flags: AccessibilityFlags): string {
  const pad = quizOptionPaddingClass(flags)
  const minH = flags.largeTouch ? 'min-h-[3.25rem]' : ''
  if (flags.cognitivePastel && !flags.visual) {
    return `rounded-xl border-2 border-sky-200/70 bg-sky-100/90 ${pad} ${minH} text-left text-base font-semibold text-sky-950 transition-colors hover:bg-sky-50`
  }
  if (flags.visual) {
    return `rounded-xl border-2 border-amber-300 bg-neutral-900 ${pad} ${minH} text-left text-base font-semibold text-white transition-colors hover:bg-neutral-800`
  }
  if (flags.creamyBackground) {
    return `rounded-xl border-2 border-stone-400/80 bg-stone-100 ${pad} ${minH} text-left text-base font-medium text-stone-900 transition-colors hover:bg-stone-50`
  }
  return `rounded-xl border-2 border-slate-600/80 bg-slate-800/60 ${pad} ${minH} text-left text-base font-medium text-slate-100 transition-colors hover:border-slate-500 hover:bg-slate-700/50`
}

/** Klávesová / čitelná značka A až D */
export function quizOptionLabelClass(flags: AccessibilityFlags): string {
  if (flags.visual) {
    return 'mr-2 font-bold text-amber-300'
  }
  if (flags.creamyBackground) {
    return 'mr-2 font-semibold text-stone-700'
  }
  return 'mr-2 font-semibold text-indigo-300'
}

/** Vysvětlení po odhalení odpovědi */
export function quizExplanationClass(flags: AccessibilityFlags): string {
  const lead = flags.dyslexia ? 'leading-[1.8]' : 'leading-relaxed'
  if (flags.visual) {
    return `mt-5 rounded-xl border border-amber-400/60 bg-neutral-900 p-4 text-base text-neutral-100 ${lead}`
  }
  if (flags.creamyBackground) {
    return `mt-5 rounded-xl border border-stone-400/70 bg-amber-50/90 p-4 text-sm text-stone-900 ${lead}`
  }
  return `mt-5 rounded-xl border border-slate-600/60 bg-slate-900/40 p-4 text-sm text-slate-200 ${lead}`
}

/** Číslo otázky nad kartou */
export function quizProgressClass(flags: AccessibilityFlags): string {
  const base = 'mb-2 text-center'
  if (flags.visual) {
    return `${base} text-base font-medium text-amber-100/90`
  }
  if (flags.creamyBackground) {
    return `${base} text-sm text-stone-600`
  }
  return `${base} text-sm text-slate-400`
}
