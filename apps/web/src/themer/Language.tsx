import { CheckCircleIcon, DiamondIcon, PencilSimpleIcon } from "@phosphor-icons/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@workspace/ui/lib/utils"
import {
  ELEVATIONS,
  ICON_STYLES,
  ICON_WEIGHTS,
  MATERIALS,
  RADII,
  SPACINGS,
  VALUE_QUESTIONS,
  nearestWeight,
  type ThemeDraft,
} from "@workspace/ui/themes"

import { AlpesCard } from "./AlpesCard"
import { ActionButton, BackButton, Header, Page, Panel } from "./Chrome"
import { checkFont, loadPickerFonts } from "./fontLoading"
import { ChoicePicker, ColorPicker, FontPicker, WeightPicker, type Option } from "./Pickers"
import { badColors, lookDone, valuesDone, type Tab } from "./state"

/* --- the small pictures inside the Styles pickers ---------------------------- */

const box = (style: React.CSSProperties) => <span className="block size-5 bg-[#1b1717]" style={style} />
const SURFACES: Option<(typeof MATERIALS)[number]>[] = [
  { value: "solid", label: "Solid", visual: box({}) },
  { value: "glass", label: "Glass", visual: box({ background: "rgba(27,23,23,.35)", border: "1px solid #1b1717" }) },
  { value: "gradient", label: "Gradient", visual: box({ background: "linear-gradient(180deg,#1b1717,#d9d9d9)" }) },
]
const EDGES: Option<(typeof RADII)[number]>[] = [
  { value: "sharp", label: "Sharp", visual: box({ borderRadius: 0 }) },
  { value: "subtle", label: "Subtle", visual: box({ borderRadius: 3 }) },
  { value: "strong", label: "Strong", visual: box({ borderRadius: 7 }) },
  { value: "rounded", label: "Rounded", visual: box({ borderRadius: 12 }) },
]
const SHADOWS: Option<(typeof ELEVATIONS)[number]>[] = [
  { value: "none", label: "None", visual: box({}) },
  { value: "subtle", label: "Subtle", visual: box({ boxShadow: "0 3px 5px rgba(0,0,0,.4)" }) },
  { value: "strong", label: "Strong", visual: box({ boxShadow: "5px 5px 0 rgba(0,0,0,.45)" }) },
]
const gap = (n: number) => (
  <span className="flex flex-col" style={{ gap: n }}>
    <span className="block h-1.5 w-5 bg-[#1b1717]" />
    <span className="block h-1.5 w-5 bg-[#1b1717]" />
  </span>
)
const SPACING: Option<(typeof SPACINGS)[number]>[] = [
  { value: "md", label: "Medium", visual: gap(3) },
  { value: "lg", label: "Large", visual: gap(7) },
]
const ICON_STYLE_OPTIONS: Option<(typeof ICON_STYLES)[number]>[] = [
  { value: "phosphor", label: "Phosphor", visual: <span className="text-[11px] font-bold">Ph</span> },
  { value: "lucide", label: "Lucide", visual: <span className="text-[11px] font-bold">Lu</span> },
]
const ICON_WEIGHT_OPTIONS: Option<(typeof ICON_WEIGHTS)[number]>[] = ICON_WEIGHTS.map((w) => ({ value: w, label: w[0].toUpperCase() + w.slice(1), visual: <span className="text-[11px] font-bold">{w[0].toUpperCase()}</span> }))

/* --- one section: a title, a card, and its controls ------------------------- */

/** The card at a fixed scale, clipped to its own box. */
function Scaled({ draft, scale, crop }: { draft: ThemeDraft; scale: number; crop?: { width: number; height: number; x: number } }) {
  const width = crop?.width ?? 480 * scale
  const height = crop?.height ?? 340 * scale
  return (
    <div style={{ width, height, overflow: "hidden", flex: "none" }}>
      <div style={{ transform: `translateX(${-(crop?.x ?? 0)}px) scale(${scale})`, transformOrigin: "top left", width: 480, height: 340 }}>
        <AlpesCard draft={draft} />
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Panel className="relative h-[460px] overflow-hidden max-lg:h-auto max-lg:pb-8">
      <h3 className="pt-[44px] text-center text-[28px] leading-[1.14]">{title}</h3>
      <div className="mt-[52px] flex items-start justify-center gap-12 px-6 max-lg:flex-col max-lg:items-center">{children}</div>
    </Panel>
  )
}

const Column = ({ children }: { children: ReactNode }) => <div className="flex flex-col items-center gap-8 pt-2">{children}</div>

function LookSections({ draft, set }: { draft: ThemeDraft; set: (patch: Partial<ThemeDraft>) => void }) {
  return (
    <div className="flex flex-col gap-5">
      <Section title="Colors">
        <Column>
          <ColorPicker label="Background" value={draft.background} onChange={(background) => set({ background })} />
          <ColorPicker label="Primary" value={draft.primary} onChange={(primary) => set({ primary })} />
          <ColorPicker label="Secondary" value={draft.secondary} onChange={(secondary) => set({ secondary })} />
        </Column>
        <AlpesCard draft={draft} />
      </Section>

      <Section title="Fonts">
        <Scaled draft={draft} scale={0.81} />
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 pt-2">
          <FontPicker label="Headings" value={draft.headingFont} onChange={(headingFont) => set({ headingFont, headingWeight: nearestWeight(headingFont, draft.headingWeight ?? 400) })} />
          <WeightPicker label="Weight" family={draft.headingFont} value={draft.headingWeight} onChange={(headingWeight) => set({ headingWeight })} />
          <FontPicker label="Body" value={draft.bodyFont} onChange={(bodyFont) => set({ bodyFont, bodyWeight: nearestWeight(bodyFont, draft.bodyWeight ?? 400) })} />
          <WeightPicker label="Weight" family={draft.bodyFont} value={draft.bodyWeight} onChange={(bodyWeight) => set({ bodyWeight })} />
        </div>
      </Section>

      <Section title="Styles">
        <Column>
          <ChoicePicker label="Surfaces" value={draft.material} options={SURFACES} onChange={(material) => set({ material })} />
          <ChoicePicker label="Edges" value={draft.radius} options={EDGES} onChange={(radius) => set({ radius })} />
        </Column>
        <Scaled draft={draft} scale={0.81} />
        <Column>
          <ChoicePicker label="Shadows" value={draft.elevation} options={SHADOWS} onChange={(elevation) => set({ elevation })} />
          <ChoicePicker label="Spacing" value={draft.spacing} options={SPACING} onChange={(spacing) => set({ spacing })} />
        </Column>
      </Section>

      <Section title="Icons">
        <Scaled draft={draft} scale={1.7} crop={{ width: 390, height: 262, x: 363 }} />
        <Column>
          <ChoicePicker shape="circle" label="Style" value={draft.iconStyle} options={ICON_STYLE_OPTIONS} onChange={(iconStyle) => set({ iconStyle })} />
          <ChoicePicker shape="circle" label="Weight" value={draft.iconWeight} options={ICON_WEIGHT_OPTIONS} onChange={(iconWeight) => set({ iconWeight })} />
        </Column>
      </Section>
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

function TabButton({ id, tab, onTab, state, children }: { id: Tab; tab: Tab; onTab: (t: Tab) => void; state: "done" | "skipped" | "todo"; children: ReactNode }) {
  const active = tab === id
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onTab(id)}
      className={cn(
        "flex cursor-pointer items-center gap-1.5 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        active ? "text-white" : state === "done" ? "text-[#00bc7d]" : state === "skipped" ? "text-[#fe9a00]" : "text-white/50"
      )}
    >
      {children}
      {state === "done" && <CheckCircleIcon size={14} weight="fill" className="text-[#00bc7d]" />}
      {state === "skipped" && <DiamondIcon size={14} weight="fill" className="text-[#fe9a00]" />}
    </button>
  )
}

/** The theme's name: a title you can type over. */
export function NameField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [editing, setEditing] = useState(false)
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (editing) ref.current?.select()
  }, [editing])
  return (
    <div className="inline-flex flex-col items-center">
      {editing ? (
        <input
          ref={ref}
          aria-label="Theme name"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
          className="w-[min(70vw,430px)] bg-transparent text-center text-[48px] leading-[1.22] outline-none max-sm:text-[32px]"
          style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--h2-weight)" }}
        />
      ) : (
        <button type="button" onClick={() => setEditing(true)} aria-label="Rename theme" className="flex cursor-text items-start gap-2 text-[48px] leading-[1.22] max-sm:text-[32px]" style={{ fontFamily: "var(--font-heading)" }}>
          {value || placeholder}
          <PencilSimpleIcon size={18} className="mt-3" />
        </button>
      )}
      <span className="mt-1 w-full border-b border-dashed border-white/70" />
    </div>
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
  const stateOf = (id: Tab): "done" | "skipped" | "todo" => {
    const done = id === "look" ? lookDone(draft) : valuesDone(draft)
    return done ? "done" : visited.has(id) && tab !== id ? "skipped" : "todo"
  }

  return (
    <Page rings>
      <Header
        nav={<BackButton onClick={onBack} />}
        title={<NameField placeholder="Your Design Language" value={draft.label} onChange={(label) => onChange({ label })} />}
        actions={
          <ActionButton onClick={onContinue} disabled={bad.length > 0} title={bad.length ? "Fix the colour first" : undefined}>
            Continue
          </ActionButton>
        }
      />
      <div role="tablist" className="mb-[60px] flex sm:-mt-12 justify-center gap-6">
        <TabButton id="look" tab={tab} onTab={onTab} state={stateOf("look")}>
          Look
        </TabButton>
        <TabButton id="values" tab={tab} onTab={onTab} state={stateOf("values")}>
          Values
        </TabButton>
      </div>
      {tab === "look" ? <LookSections draft={draft} set={onChange} /> : <ValuesSections draft={draft} set={onChange} />}
    </Page>
  )
}
