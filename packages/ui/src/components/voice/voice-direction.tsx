"use client"

import { cn } from "@workspace/ui/lib/utils"

/**
 * Which side a voice comes from, as the Voice direction model on libraries.dev reports it. The model reads an
 * iPhone's stereo microphones and is iOS only, so on the web this is the read-out: hand it the pan the model
 * (or your own source) gives, −1 left … 1 right, and it shows the side.
 *
 * - `pan`: −1 left … 1 right.
 * - `probabilities`: optional left / ahead / right, 0–1 each, shown as bars under the dial.
 * - `active`: false greys it out while no voice is heard.
 */
type VoiceSide = "left" | "ahead" | "right"

/** The three sides the model names: within a third of the middle is ahead. */
function panToSide(pan: number): VoiceSide {
  return pan < -1 / 3 ? "left" : pan > 1 / 3 ? "right" : "ahead"
}

type VoiceDirectionProps = {
  pan: number
  probabilities?: Record<VoiceSide, number>
  active?: boolean
  className?: string
}

const SIDES: VoiceSide[] = ["left", "ahead", "right"]
const LABEL: Record<VoiceSide, string> = { left: "Left", ahead: "Ahead", right: "Right" }

function VoiceDirection({ pan, probabilities, active = true, className }: VoiceDirectionProps) {
  const clamped = Math.max(-1, Math.min(1, pan))
  const side = panToSide(clamped)
  // the needle sweeps a half dial: −1 is 90° left of straight up, 1 is 90° right
  const angle = clamped * 80
  const R = 80
  const arc = (from: number, to: number) => {
    const point = (deg: number) => [100 + R * Math.sin((deg * Math.PI) / 180), 100 - R * Math.cos((deg * Math.PI) / 180)]
    const [x1, y1] = point(from)
    const [x2, y2] = point(to)
    return `M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`
  }

  return (
    <div className={cn("flex w-[200px] flex-col items-center gap-2 text-foreground", !active && "opacity-40", className)}>
      <svg viewBox="0 0 200 112" role="img" aria-label={`Voice direction: ${LABEL[side]}`} className="w-full overflow-visible">
        {[
          [-90, -30, "left"],
          [-30, 30, "ahead"],
          [30, 90, "right"],
        ].map(([from, to, id]) => (
          <path
            key={id as string}
            d={arc(from as number, to as number)}
            fill="none"
            stroke="currentColor"
            strokeWidth={id === side ? 10 : 6}
            strokeLinecap="round"
            opacity={id === side ? 1 : 0.24}
            className="transition-[stroke-width,opacity] duration-(--motion-fast) ease-(--motion-transition-ease)"
          />
        ))}
        <g style={{ transform: `rotate(${angle}deg)`, transformOrigin: "100px 100px" }} className="transition-transform duration-300 ease-out">
          <line x1="100" y1="100" x2="100" y2="34" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </g>
        <circle cx="100" cy="100" r="6" fill="currentColor" />
      </svg>
      <p className="text-body-md">{LABEL[side]}</p>
      {probabilities ? (
        <div className="flex w-full justify-between gap-2" aria-hidden>
          {SIDES.map((id) => (
            <div key={id} className="flex flex-1 flex-col items-center gap-1">
              <div className="h-1 w-full overflow-clip rounded-full bg-current/15">
                <div className="h-full rounded-full bg-current transition-[width] duration-300" style={{ width: `${Math.round(probabilities[id] * 100)}%` }} />
              </div>
              <span className="text-body-sm opacity-60">{LABEL[id]}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export { VoiceDirection, panToSide }
export type { VoiceDirectionProps, VoiceSide }
