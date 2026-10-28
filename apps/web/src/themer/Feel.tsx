import { useEffect, useRef, useState, type ReactNode } from "react"

import {
  BACKGROUNDS,
  CLICKS,
  HERO_HEADINGS,
  HERO_TEXTS,
  LINK_HOVERS,
  MOTIONS,
  MOTION_STYLES,
  OVERLAYS,
  SPEEDS,
  TRANSITIONS,
  TRANSITION_COLORS,
  type ThemeDraft,
} from "@workspace/ui/themes"

import { ControlTile } from "./ControlTile"
import { BackgroundPreview, HeroPreview, MotionPreview, TransitionPreview } from "./FeelPreviews"
import { ChoiceToken, ColumnLabel, OptionGroup, ToggleToken } from "./Pickers"
import { draftToTheme } from "./state"

/* --- the words on the options, as the Figma writes them ------------------------- */

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)
const TRANSITION_LABELS: Record<(typeof TRANSITIONS)[number], string> = {
  none: "None",
  blinds: "Blinds",
  iris: "Iris",
  curtain: "Curtain",
  fade: "Fade",
  "curtain-iris": "Curtain + Iris",
}
const BACKGROUND_LABELS: Record<(typeof BACKGROUNDS)[number], string> = {
  none: "None",
  aurora: "Aurora",
  smoke: "Smoke",
  ascii: "ASCII",
  holo: "Holo",
  // as the Figma writes it
  eighties: "80",
}
const TEXT_LABELS: Record<(typeof HERO_TEXTS)[number], string> = {
  none: "None",
  rolling: "Rolling",
  scramble: "Scramble",
  typewriter: "Typewriter",
  splitting: "Splitting",
  "vertical-cut": "Vertical cut",
}

type SectionId = "motion" | "transition" | "background" | "hero"

/** A column of choices: its heading, then one token each. */
function Column<T extends string | number>({
  title,
  options,
  value,
  onChange,
  label,
  leading,
  width = "w-[180px]",
  heading = true,
}: {
  title: string
  options: readonly T[]
  value: T | undefined
  onChange: (v: T) => void
  label: (v: T) => string
  leading?: (v: T) => ReactNode
  width?: string
  /** Show the title over the column. Component Animations has none: its four choices stand alone. */
  heading?: boolean
}) {
  return (
    <OptionGroup label={title} className={`flex shrink-0 flex-col gap-3 ${width}`}>
      {heading && <ColumnLabel>{title}</ColumnLabel>}
      {options.map((o) => (
        <ChoiceToken key={o} label={label(o)} selected={value === o} onSelect={() => onChange(o)} leading={leading?.(o)} />
      ))}
    </OptionGroup>
  )
}

/** A row of three choices, as the Hero section sets them. */
function Row<T extends string>({ title, label, options, value, onChange }: { title: string; label: (v: T) => string; options: readonly T[]; value: T | undefined; onChange: (v: T) => void }) {
  const rows = Array.from({ length: Math.ceil(options.length / 3) }, (_, i) => options.slice(i * 3, i * 3 + 3))
  return (
    <OptionGroup label={title} className="flex w-full flex-col gap-3">
      <ColumnLabel>{title}</ColumnLabel>
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-3 gap-2">
            {row.map((o) => (
              <ChoiceToken key={o} label={label(o)} selected={value === o} onSelect={() => onChange(o)} className="[&_button]:px-2" />
            ))}
          </div>
        ))}
      </div>
    </OptionGroup>
  )
}

const dot = (color: string) => <span className="size-6 rounded-full" style={{ background: color }} />

/**
 * The Feel tab: how the theme moves. Component animations, page transitions, an animated
 * background and the hero. Every question has to be answered (none is an answer) before the page
 * can be left, and each choice plays in the picture beside it.
 */
export function FeelTab({ draft, set, missing }: { draft: ThemeDraft; set: (patch: Partial<ThemeDraft>) => void; missing: string[] }) {
  const [open, setOpen] = useState<Set<SectionId>>(new Set(["motion", "transition", "background", "hero"]))
  const tile = (id: SectionId) => ({
    open: open.has(id),
    onOpenChange: (o: boolean) =>
      setOpen((s) => {
        const next = new Set(s)
        if (o) next.add(id)
        else next.delete(id)
        return next
      }),
  })

  const theme = draftToTheme(draft)
  const feel = theme.feel

  // the transition and the hero text play whenever one of their choices changes, and the box can be clicked to play again
  const [transitionRun, setTransitionRun] = useState(0)
  const [heroRun, setHeroRun] = useState(0)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    setTransitionRun((n) => n + 1)
  }, [draft.transition, draft.transitionColor, draft.transitionSpeed])
  useEffect(() => setHeroRun((n) => n + 1), [draft.heroText])

  const stack = "flex gap-6 max-[1180px]:flex-col"
  return (
    <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4">
      <ControlTile title="Component Animations" roomy {...tile("motion")}>
        <div className={stack}>
          <Column title="Component Animations" heading={false} options={MOTIONS} value={draft.motion} onChange={(motion) => set({ motion })} label={(m) => MOTION_STYLES[m].label} />
          <MotionPreview theme={theme} motion={draft.motion} />
        </div>
      </ControlTile>

      <ControlTile title="Page Transitions" roomy {...tile("transition")}>
        <div className={stack}>
          <div className="flex gap-6">
            <Column title="Style" options={TRANSITIONS} value={draft.transition} onChange={(transition) => set({ transition })} label={(t) => TRANSITION_LABELS[t]} />
            <div className="flex w-[180px] shrink-0 flex-col gap-3">
              <Column
                title="Color"
                options={TRANSITION_COLORS}
                value={draft.transitionColor}
                onChange={(transitionColor) => set({ transitionColor })}
                label={cap}
                leading={(c) => dot(c === "primary" ? theme.palette.primary : theme.palette.foreground)}
              />
              <Column title="Speed" options={SPEEDS} value={draft.transitionSpeed} onChange={(transitionSpeed) => set({ transitionSpeed })} label={cap} />
            </div>
          </div>
          <TransitionPreview theme={theme} feel={feel} run={transitionRun} onRun={() => setTransitionRun((n) => n + 1)} />
        </div>
      </ControlTile>

      <ControlTile title="Animated background" roomy {...tile("background")}>
        <div className={stack}>
          <div className="flex gap-6">
            <Column title="Style" options={BACKGROUNDS} value={draft.animatedBackground} onChange={(animatedBackground) => set({ animatedBackground })} label={(b) => BACKGROUND_LABELS[b]} />
            <div className="flex w-[184px] shrink-0 flex-col gap-3">
              <ColumnLabel>Settings</ColumnLabel>
              <ToggleToken label="Theme colors" on={feel.animatedBackgroundThemeColors} onToggle={() => set({ animatedBackgroundThemeColors: !feel.animatedBackgroundThemeColors })} />
              <ToggleToken label="Inverse colors" on={feel.animatedBackgroundInverse} onToggle={() => set({ animatedBackgroundInverse: !feel.animatedBackgroundInverse })} />
              <OptionGroup label="Overlay" className="flex flex-col gap-3">
                <ColumnLabel>Overlay</ColumnLabel>
                <div className="grid grid-cols-2 gap-2">
                  {OVERLAYS.map((o) => (
                    <ChoiceToken key={o} label={`${o}%`} selected={draft.animatedBackgroundOverlay === o} onSelect={() => set({ animatedBackgroundOverlay: o })} className="[&_button]:px-2" />
                  ))}
                </div>
              </OptionGroup>
            </div>
          </div>
          <BackgroundPreview theme={theme} feel={feel} />
        </div>
      </ControlTile>

      <ControlTile title="Hero Section" roomy {...tile("hero")}>
        <div className={stack}>
          <div className="flex w-[508px] shrink-0 flex-col gap-6 max-[1180px]:w-full">
            <Row title="Hero Headings" options={HERO_HEADINGS} value={draft.heroHeading} onChange={(heroHeading) => set({ heroHeading })} label={cap} />
            <Row title="Hero Text Entry" options={HERO_TEXTS} value={draft.heroText} onChange={(heroText) => set({ heroText })} label={(t) => TEXT_LABELS[t]} />
            <Row title="Button Click" options={CLICKS} value={draft.buttonClick} onChange={(buttonClick) => set({ buttonClick })} label={cap} />
            <Row title="Links Hover" options={LINK_HOVERS} value={draft.linkHover} onChange={(linkHover) => set({ linkHover })} label={cap} />
          </div>
          <HeroPreview theme={theme} feel={feel} run={heroRun} />
        </div>
      </ControlTile>

      {missing.length > 0 && (
        <p role="status" className="px-2 pt-2 text-center text-sm opacity-70">
          Still to do: {missing.join(", ")}
        </p>
      )}
    </div>
  )
}
