import { BeachBallIcon, CheckCircleIcon, DiamondIcon } from "@phosphor-icons/react"
import { useEffect, useState, type ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"
import {
  BODY_FONTS,
  HEADING_FONTS,
  VALUE_QUESTIONS,
  nearestWeight,
  type Elevation,
  type IconWeight,
  type Material,
  type Radius,
  type Scale,
  type Spacing,
  type ThemeDraft,
  type Tone,
} from "@workspace/ui/themes"

import { ActionButton, BackButton, Header, Page, Panel } from "./Chrome"
import { ControlTile } from "./ControlTile"
import { FeelTab } from "./Feel"
import { checkFont, loadPickerFonts } from "./fontLoading"
import { ColorToken, FontToken, OptionGroup, OptionRow, StepToken, Swatch, TextToken, WeightToken } from "./Pickers"
import { ProductPreview } from "./ProductPreview"
import { badColors, feelDone, feelMissing, lookDone, lookMissing, valuesDone, valuesMissing, type Tab } from "./state"

/* --- the choices of each tile, drawn as the Figma draws them ------------------ */

const TEXTURES: { value: Material; label: string; style?: React.CSSProperties; className?: string }[] = [
  { value: "solid", label: "Solid", className: "bg-white bg-none" },
  { value: "gradient", label: "Gradient", style: { background: "linear-gradient(180deg, rgba(239,239,239,0.4), #ffffff)" } },
  { value: "glass", label: "Glass" },
]
/** The Figma calls the square-cornered edge "Solid"; the theme's own name for it is "sharp". */
const EDGES: { value: Radius; label: string; radius: number }[] = [
  { value: "sharp", label: "Solid", radius: 0 },
  { value: "subtle", label: "Subtle", radius: 8 },
  { value: "strong", label: "Strong", radius: 16 },
  { value: "rounded", label: "Rounded", radius: 9999 },
]
const SHADOWS: { value: Elevation; label: string; shadow: string }[] = [
  { value: "none", label: "None", shadow: "none" },
  { value: "subtle", label: "Subtle", shadow: "0 4px 4px rgba(0,0,0,0.25)" },
  { value: "strong", label: "Strong", shadow: "0 8px 8px rgba(0,0,0,0.5)" },
]
/** Two squares whose gap is the spacing. The Figma gives Large's squares a shadow, so it is drawn here too. */
const SPACINGS: { value: Spacing; label: string; gap: number; shadow?: string }[] = [
  { value: "sm", label: "Small", gap: 8 },
  { value: "md", label: "Medium", gap: 16 },
  { value: "lg", label: "Large", gap: 24, shadow: "0 4px 4px rgba(0,0,0,0.25)" },
]
const ICONS: { value: IconWeight; label: string }[] = [
  { value: "thin", label: "Thin" },
  { value: "light", label: "Light" },
  { value: "regular", label: "Regular" },
  { value: "fill", label: "Filled" },
]
/** The texture's tone: cards sit darker or lighter than the page, and glass is dark or light. */
const TONES: { value: Tone; label: string; fill: string }[] = [
  { value: "dark", label: "Dark", fill: "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.85))" },
  { value: "light", label: "Light", fill: "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.9))" },
]
const SCALES: { value: Scale; label: string }[] = [
  { value: "sm", label: "Small" },
  { value: "md", label: "Medium" },
  { value: "lg", label: "Large" },
]

/* --- the Look tab: a column of control tiles beside a live product page ------- */

type TileId = "name" | "color" | "type" | "texture" | "edges" | "shadow" | "spacing" | "icons"

function LookTab({
  draft,
  set,
  onNext,
  missing,
}: {
  draft: ThemeDraft
  set: (patch: Partial<ThemeDraft>) => void
  onNext: () => void
  /** What is still to do; NEXT stays shut until it is empty. */
  missing: string[]
}) {
  const [open, setOpen] = useState<TileId | null>("name")
  const tile = (id: TileId) => ({ open: open === id, onOpenChange: (o: boolean) => setOpen(o ? id : null) })
  return (
    <div className="grid items-start gap-10 min-[1180px]:grid-cols-[390px_minmax(0,640px)] min-[1180px]:gap-[clamp(40px,8.6vw,110px)]">
      <div className="flex flex-col gap-4">
        <ControlTile title="Theme name" {...tile("name")}>
          <TextToken label="Theme name" placeholder="New theme name" value={draft.label} onChange={(label) => set({ label })} />
        </ControlTile>

        <ControlTile title="Color" {...tile("color")}>
          <div className="flex flex-col gap-3">
            <ColorToken label="Background" value={draft.background} onChange={(background) => set({ background })} />
            <ColorToken label="Foreground" value={draft.foreground} onChange={(foreground) => set({ foreground })} />
            <ColorToken label="Primary" value={draft.primary} onChange={(primary) => set({ primary })} />
            <ColorToken label="Secondary" value={draft.secondary} onChange={(secondary) => set({ secondary })} />
          </div>
        </ControlTile>

        <ControlTile title="Typography" {...tile("type")}>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[minmax(0,1fr)_104px] gap-2">
              <FontToken label="Heading" fonts={HEADING_FONTS} value={draft.headingFont} weight={draft.headingWeight} onChange={(headingFont) => set({ headingFont, headingWeight: nearestWeight(headingFont, draft.headingWeight ?? 400) })} />
              <WeightToken label="Weight" family={draft.headingFont} value={draft.headingWeight} onChange={(headingWeight) => set({ headingWeight })} />
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)_104px] gap-2">
              <FontToken label="Body" fonts={BODY_FONTS} value={draft.bodyFont} weight={draft.bodyWeight} onChange={(bodyFont) => set({ bodyFont, bodyWeight: nearestWeight(bodyFont, draft.bodyWeight ?? 400) })} />
              <WeightToken label="Weight" family={draft.bodyFont} value={draft.bodyWeight} onChange={(bodyWeight) => set({ bodyWeight })} />
            </div>
            <StepToken label="Scale" value={draft.scale} options={SCALES} onChange={(scale) => set({ scale })} />
          </div>
        </ControlTile>

        <ControlTile title="Texture" {...tile("texture")}>
          <OptionGroup label="Texture" className="flex flex-col gap-2">
            {TEXTURES.map((t) => (
              <OptionRow key={t.value} label={t.label} selected={draft.material === t.value} onSelect={() => set({ material: t.value })}>
                <Swatch selected={draft.material === t.value} className={t.className} style={t.style} />
              </OptionRow>
            ))}
          </OptionGroup>
          <OptionGroup label="Tone" className="mt-4 grid grid-cols-2 gap-2">
            {TONES.map((t) => (
              <OptionRow key={t.value} label={t.label} selected={draft.tone === t.value} onSelect={() => set({ tone: t.value })}>
                <Swatch selected={draft.tone === t.value} style={{ background: t.fill }} />
              </OptionRow>
            ))}
          </OptionGroup>
        </ControlTile>

        <ControlTile title="Edges" {...tile("edges")}>
          <OptionGroup label="Edges" className="grid grid-cols-2 gap-2">
            {EDGES.map((e) => (
              <OptionRow key={e.value} label={e.label} selected={draft.radius === e.value} onSelect={() => set({ radius: e.value })}>
                <Swatch selected={draft.radius === e.value} round={e.radius === 9999} radius={e.radius} />
              </OptionRow>
            ))}
          </OptionGroup>
        </ControlTile>

        <ControlTile title="Shadow" lifted {...tile("shadow")}>
          <OptionGroup label="Shadow" className="flex flex-col gap-4">
            {SHADOWS.map((s) => (
              <OptionRow key={s.value} label={s.label} selected={draft.elevation === s.value} onSelect={() => set({ elevation: s.value })}>
                <Swatch selected={draft.elevation === s.value} style={{ boxShadow: s.shadow }} />
              </OptionRow>
            ))}
          </OptionGroup>
        </ControlTile>

        <ControlTile title="Spacing" {...tile("spacing")}>
          <OptionGroup label="Spacing" className="flex flex-col gap-4">
            {SPACINGS.map((s) => (
              <OptionRow key={s.value} labelFirst label={s.label} selected={draft.spacing === s.value} onSelect={() => set({ spacing: s.value })} className="w-full">
                <span className="flex" style={{ gap: s.gap }}>
                  <Swatch selected={draft.spacing === s.value} style={{ boxShadow: s.shadow }} />
                  <Swatch selected={draft.spacing === s.value} style={{ boxShadow: s.shadow }} />
                </span>
              </OptionRow>
            ))}
          </OptionGroup>
        </ControlTile>

        <ControlTile title="Icons" {...tile("icons")}>
          <OptionGroup label="Icons" className="grid grid-cols-2 gap-2">
            {ICONS.map((i) => (
              <OptionRow key={i.value} label={i.label} selected={draft.iconWeight === i.value} onSelect={() => set({ iconWeight: i.value, iconStyle: "phosphor" })}>
                <Swatch round selected={draft.iconWeight === i.value}>
                  <BeachBallIcon size={32} weight={i.value} aria-hidden />
                </Swatch>
              </OptionRow>
            ))}
          </OptionGroup>
        </ControlTile>

        {missing.length > 0 && (
          <p role="status" className="px-2 text-center text-sm opacity-70">
            Still to do: {missing.join(", ")}
          </p>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={missing.length > 0}
          className="cursor-pointer rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/12 p-6 text-center text-[28px] leading-[1.14] italic outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-default disabled:opacity-50"
        >
          NEXT
        </button>
      </div>

      <ProductPreview draft={draft} className="min-[1180px]:sticky min-[1180px]:top-[137px]" />
    </div>
  )
}

/* --- the four UX questions --------------------------------------------------- */

function ValuesSections({ draft, set }: { draft: ThemeDraft; set: (patch: Partial<ThemeDraft>) => void }) {
  const answer = (i: number, a: "a" | "b") => set({ values: draft.values.map((v, j) => (j === i ? a : v)) })
  return (
    <div className="flex flex-col gap-5">
      {VALUE_QUESTIONS.map((q, i) => (
        <Panel key={q.key} className="px-8 pt-9 pb-12 text-center">
          <p className="text-xs">
            {i + 1} of {VALUE_QUESTIONS.length}
          </p>
          <h3 className="mt-1 text-[28px] leading-[1.14]">{q.question}</h3>
          <div role="radiogroup" aria-label={q.question} className="mx-auto mt-12 grid max-w-[620px] grid-cols-2 gap-6 max-sm:grid-cols-1">
            {(["a", "b"] as const).map((k) => {
              const on = draft.values[i] === k
              return (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => answer(i, k)}
                  className="flex cursor-pointer flex-col items-center gap-3 rounded-md px-4 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <span className={cn("grid size-5 place-items-center rounded-full border", on ? "border-transparent bg-[#00bc7d] text-black" : "border-white/50")}>
                    {on && <CheckCircleIcon size={20} weight="fill" className="text-[#00bc7d]" />}
                  </span>
                  <span className="text-base font-bold">{q[k].label}</span>
                  <span className="max-w-[220px] text-sm">{q[k].description}</span>
                </button>
              )
            })}
          </div>
        </Panel>
      ))}
    </div>
  )
}

/* --- the screen ------------------------------------------------------------- */

/** One of the bar's three words: the current one is full white, the rest half. */
function TabButton({
  id,
  tab,
  onTab,
  state,
  locked = false,
  children,
}: {
  id: Tab
  tab: Tab
  onTab: (t: Tab) => void
  state: "done" | "skipped" | "todo"
  /** The page before it is not finished, so it cannot be opened yet. */
  locked?: boolean
  children: ReactNode
}) {
  const active = tab === id
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      aria-disabled={locked && !active}
      disabled={locked && !active}
      onClick={() => onTab(id)}
      className={cn("flex cursor-pointer items-center gap-1.5 text-base leading-[1.42] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-default", !active && "opacity-50")}
    >
      {children}
      {state === "done" && <CheckCircleIcon size={14} weight="fill" className="text-[#00bc7d]" />}
      {state === "skipped" && <DiamondIcon size={14} weight="fill" className="text-[#fe9a00]" />}
    </button>
  )
}

export function Language({
  draft,
  onChange,
  tab,
  onTab,
  visited,
  onBack,
  onContinue,
}: {
  draft: ThemeDraft
  onChange: (patch: Partial<ThemeDraft>) => void
  tab: Tab
  onTab: (t: Tab) => void
  visited: Set<Tab>
  onBack: () => void
  onContinue: () => void
}) {
  useEffect(() => {
    void loadPickerFonts()
  }, [])
  // a chosen font that cannot load is said out loud, once per choice
  useEffect(() => {
    if (draft.headingFont) void checkFont(draft.headingFont, draft.headingWeight ?? 400)
  }, [draft.headingFont, draft.headingWeight])
  useEffect(() => {
    if (draft.bodyFont) void checkFont(draft.bodyFont, draft.bodyWeight ?? 400)
  }, [draft.bodyFont, draft.bodyWeight])

  const bad = badColors(draft)
  // each page has to be complete before the next: Look, then Feel, then Values
  const lookGap = [...lookMissing(draft), ...bad.map((k) => `${k} colour`)]
  const feelGap = [...lookGap, ...feelMissing(draft)]
  const gap = tab === "look" ? lookGap : tab === "feel" ? feelGap : [...feelGap, ...valuesMissing(draft)]
  const stateOf = (id: Tab): "done" | "skipped" | "todo" => {
    const done = id === "look" ? lookDone(draft) : id === "feel" ? feelDone(draft) : valuesDone(draft)
    return done ? "done" : visited.has(id) && tab !== id ? "skipped" : "todo"
  }

  return (
    <Page glow={false} wide>
      <Header
        nav={<BackButton onClick={onBack} />}
        center={
          <div role="tablist" className="flex items-center justify-center gap-6">
            <TabButton id="look" tab={tab} onTab={onTab} state={stateOf("look")}>
              Look
            </TabButton>
            <TabButton id="feel" tab={tab} onTab={onTab} state={stateOf("feel")} locked={lookGap.length > 0}>
              Feel
            </TabButton>
            <TabButton id="values" tab={tab} onTab={onTab} state={stateOf("values")} locked={feelGap.length > 0}>
              Values
            </TabButton>
          </div>
        }
        actions={
          <ActionButton onClick={onContinue} disabled={gap.length > 0} title={gap.length ? `Still to do: ${gap.join(", ")}` : undefined}>
            Continue
          </ActionButton>
        }
      />
      {tab === "look" ? (
        <LookTab draft={draft} set={onChange} onNext={onContinue} missing={lookGap} />
      ) : tab === "feel" ? (
        <FeelTab draft={draft} set={onChange} missing={feelMissing(draft)} />
      ) : (
        <div className="mx-auto w-full max-w-[1040px]">
          <ValuesSections draft={draft} set={onChange} />
        </div>
      )}
    </Page>
  )
}
