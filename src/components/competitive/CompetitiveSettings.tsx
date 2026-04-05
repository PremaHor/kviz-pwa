import { motion } from 'framer-motion'
import { Timer } from 'lucide-react'
import type { QuizConfiguration, TargetGroup } from '@/types'
import {
  clampCompetitiveTimeLimitSeconds,
  competitiveMaxTimeBonusForGroup,
  competitiveTimePresetsForGroup,
  defaultCompetitiveLimitForGroup,
} from '@/lib/competitiveScoring'

type CompetitiveSettingsProps = {
  config: QuizConfiguration
  onChange: (partial: Partial<QuizConfiguration>) => void
}

function bonusDescription(group: TargetGroup): string {
  const max = competitiveMaxTimeBonusForGroup(group)
  if (max === 0) {
    return 'Body pouze za správnou odpověď (100 bodů); časový bonus u této skupiny nepoužíváme.'
  }
  if (group === 'adults') {
    return `Správná odpověď: 100 bodů + časový bonus až ${max} (vyšší váha než u juniorů). Špatně nebo po vypršení času: 0 bodů.`
  }
  return `Správná odpověď: 100 bodů + časový bonus až ${max}. Špatně nebo po vypršení času: 0 bodů.`
}

function timeHint(group: TargetGroup): string {
  switch (group) {
    case 'adults':
      return 'Dospělí: kratší kolo (obvykle 8–10 s), náročnější otázky.'
    case 'seniors':
      return 'Senioři: delší klidné kolo (20–40 s), bez nátlakových sloganů v textu otázek.'
    default:
      return 'Junioři: typicky 10–12 s, střední obtížnost, můžeš zahlédnout bonusové znění otázky.'
  }
}

/**
 * Nastavení délky kola pro soutěžní kvíz (junioři, dospělí, senioři).
 */
export function CompetitiveSettings({ config, onChange }: CompetitiveSettingsProps) {
  const group = config.targetGroup
  const current = clampCompetitiveTimeLimitSeconds(
    config.competitiveTimeLimitSeconds ?? defaultCompetitiveLimitForGroup(group),
    group
  )
  const presets = competitiveTimePresetsForGroup(group)

  return (
    <div
      className="mt-5 rounded-2xl border border-amber-500/35 bg-amber-950/25 p-4 text-left"
      role="region"
      aria-labelledby="competitive-settings-title"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20">
          <Timer className="h-5 w-5 text-amber-300" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            id="competitive-settings-title"
            className="text-sm font-semibold text-amber-100"
          >
            Soutěžní režim
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-amber-100/80">
            {timeHint(group)}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-amber-100/75">
            {bonusDescription(group)}
          </p>
          <p className="mt-3 text-xs font-medium text-amber-200/90">
            Čas na jednu otázku
          </p>
          <div
            className="mt-2 flex flex-wrap gap-2"
            role="group"
            aria-label="Délka kola v sekundách"
          >
            {presets.map((sec) => {
              const selected = current === sec
              return (
                <motion.button
                  key={sec}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onChange({ competitiveTimeLimitSeconds: sec })}
                  aria-pressed={selected}
                  className={`min-w-[3.25rem] rounded-xl border-2 px-3 py-2 text-sm font-bold tabular-nums transition-colors ${
                    selected
                      ? 'border-amber-400 bg-amber-500/25 text-white shadow-md shadow-amber-500/15'
                      : 'border-slate-600/80 bg-slate-800/50 text-slate-200 hover:border-slate-500'
                  }`}
                >
                  {sec} s
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
