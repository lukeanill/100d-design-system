"use client"

import * as React from "react"

import { Button } from "@workspace/ui/components/button"
import { LiquidGlass, glassProps, type GlassWeight } from "@workspace/ui/components/liquid-glass"
import { useTheme } from "@workspace/ui/components/theme-provider"
import { VALUE_QUESTIONS, answerOf, getPreset } from "@workspace/ui/themes"
import background from "./tokens-glass-bg.mp4"

/**
 * The page for one theme, built to the Figma "Tokens" frame (Themes file, node 514:6564): the theme's name and its
 * settings, then its colour, texture, shadow, radius, principles, motion and typography. It follows the theme in the
 * Storybook toolbar: every value is read from that theme's tokens, so switching theme shows that theme's page.
 *
 * Sizes between sections are the frame's own values; type, colour, radius, shadow, glass and motion are the system's
 * tokens and text styles.
 */

const SCALE_NAMES = { sm: "Small", md: "Medium", lg: "Large" } as const

/** A theme setting as the Figma `settings/*` variable names it, read from the theme in force. */
function useThemeSettings() {
  const { theme } = useTheme()
  const preset = getPreset(theme)
  return {
    id: theme,
    settings: preset
      ? [
          ["Color Mode", preset.colorMode],
          ["UI Colors", preset.uiColor],
          ["Typescale", preset.scale],
          ["Radius", preset.radius],
          ["Shadow", preset.shadow],
          ["Texture", preset.material],
          ["Motion", preset.motion],
        ]
      : [],
    scale: preset?.scale ?? "sm",
    values: preset?.values,
  }
}

/** The corner radius an element ends up with, in px, kept current as the theme changes. */
function useCornerRadius(ref: React.RefObject<HTMLElement | null>) {
  const [radius, setRadius] = React.useState(0)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const read = () => setRadius(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0)
    read()
    const observer = new MutationObserver(read)
    for (let node: Element | null = el; node; node = node.parentElement) {
      observer.observe(node, { attributes: true, attributeFilter: ["class", "style", "data-theme"] })
    }
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(read)
    resize?.observe(el)
    return () => {
      observer.disconnect()
      resize?.disconnect()
    }
  }, [ref])
  return radius
}

/** One glass tile of the Glass sheet's light tone, in the radius step it is given, as the Figma draws it. */
function GlassTile({ weight, className = "", children }: { weight: GlassWeight; className?: string; children?: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const radius = useCornerRadius(ref)
  return (
    <div ref={ref} className={`relative isolate ${className}`}>
      <LiquidGlass radius={radius} {...glassProps(weight, "light")} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} aria-hidden="true" />
      <div className="relative flex size-full items-center justify-center">{children}</div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-20">
      <h2 className="text-h2-pri">{title}</h2>
      {children}
    </section>
  )
}

const caption = "text-sm opacity-40"

/** A row of swatches, a token each. */
function Swatches({ children }: { children: React.ReactNode }) {
  return <div className="flex h-11 items-center gap-2">{children}</div>
}
const swatch = "h-11 min-w-0 flex-1 rounded-sm"

function Colour() {
  return (
    <Section title="color">
      <div className="flex flex-col gap-20">
        <Swatches>
          <div title="--foreground" className={`${swatch} bg-foreground`} />
          <div title="--primary" className={`${swatch} bg-primary`} />
          <div title="--primary-foreground" className={`${swatch} bg-primary-foreground`} />
          <div title="--secondary" className={`${swatch} bg-secondary`} />
          <div title="--secondary-foreground" className={`${swatch} bg-secondary-foreground`} />
        </Swatches>
        <Swatches>
          <div title="--border" className={`${swatch} border border-border`} />
          <div title="--focus" className={`${swatch} border border-(--focus)`} />
          <div title="--muted" className={`${swatch} bg-muted`} />
          <div title="--destructive" className={`${swatch} bg-destructive`} />
          <div title="--affirmative" className={`${swatch} bg-affirmative`} />
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} title={`--chart-${n}`} className={`${swatch}`} style={{ backgroundColor: `var(--chart-${n})` }} />
          ))}
        </Swatches>
      </div>
    </Section>
  )
}

function Texture() {
  return (
    <Section title="texture">
      <div className="relative isolate overflow-hidden rounded-xl p-16">
        <video src={background} autoPlay loop muted playsInline aria-hidden="true" className="absolute inset-0 -z-10 size-full object-cover" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-(--alpha-dark-lg)" />
        <div className="flex gap-4 py-10">
          {(["soft", "medium", "heavy"] as const).map((weight) => (
            <GlassTile key={weight} weight={weight} className="h-30 flex-1 rounded-md">
              <span className="text-md text-background capitalize">{weight}</span>
            </GlassTile>
          ))}
        </div>
      </div>
    </Section>
  )
}

const SHADOWS = [
  { step: "xs", box: "h-6 w-10 rounded-xs shadow-xs", label: "text-sm" },
  { step: "sm", box: "h-12 w-20 rounded-sm shadow-sm", label: "text-md" },
  { step: "md", box: "h-20 w-30 rounded-md shadow-md", label: "text-md" },
  { step: "lg", box: "h-30 w-40 rounded-md shadow-lg", label: "text-md" },
] as const

function Shadow() {
  return (
    <Section title="shadow">
      <div className="flex flex-wrap items-center gap-10">
        {SHADOWS.map(({ step, box, label }) => (
          <div key={step} className={`flex items-center justify-center bg-primary text-primary-foreground ${box}`}>
            <span className={label}>{step}</span>
          </div>
        ))}
      </div>
    </Section>
  )
}

function Radius() {
  return (
    <Section title="radius">
      <div className="flex flex-wrap items-center gap-10">
        <Button size="sm">Button</Button>
        <Button>Button</Button>
        <GlassTile weight="medium" className="h-20 w-30 rounded-md shadow-md">
          <span className="text-xs">Card</span>
        </GlassTile>
        <GlassTile weight="medium" className="h-30 w-40 rounded-md shadow-md">
          <GlassTile weight="medium" className="m-2 size-[calc(100%-1rem)] rounded-sm shadow-md">
            <span className="text-xs">Card within card</span>
          </GlassTile>
        </GlassTile>
        <div className="relative isolate h-50 w-50 rounded-xl bg-secondary">
          <div aria-hidden className="absolute inset-0 rounded-xl bg-(--alpha-dark-lg)" />
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-xs">Card</span>
          <GlassTile weight="heavy" className="absolute inset-x-0 bottom-0 h-30 rounded-xl shadow-md">
            <span className="text-xs">Modal/Dialog/Drawer</span>
          </GlassTile>
        </div>
      </div>
    </Section>
  )
}

function Principles({ values }: { values?: readonly ("a" | "b")[] }) {
  const names = ["Nav", "Decisions", "Options", "Tone"]
  return (
    <Section title="principles">
      <div className="flex flex-wrap gap-10">
        {names.map((name, index) => (
          <div key={name} className="flex flex-col gap-2">
            <p className={caption}>{name}</p>
            <p className="text-h5-pri">{values ? answerOf(index, values[index] ?? "a").label : VALUE_QUESTIONS[index].a.label}</p>
          </div>
        ))}
      </div>
    </Section>
  )
}

const MOTION_CSS = `
@keyframes tokens-ball { from { left: 0 } to { left: calc(100% - var(--ball)) } }
@media (prefers-reduced-motion: reduce) { .tokens-ball { animation: none !important } }
`

/** A track with a ball that slides along it once and back, on one timing, on the theme's curve. */
function Track({ name, duration, ease }: { name?: string; duration: string; ease: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      {name && <p className={caption}>{name}</p>}
      <div className="relative h-[42px] rounded-[20px] border border-(--alpha-light-sm)">
        <span
          className="tokens-ball absolute top-0 left-0 size-10 rounded-full bg-primary"
          style={{ ["--ball" as string]: "2.5rem", animation: `tokens-ball ${duration} ${ease} 0.4s infinite alternate` }}
        />
      </div>
    </div>
  )
}

function Motion() {
  const ease = "var(--motion-ease)"
  return (
    <Section title="motion">
      <style>{MOTION_CSS}</style>
      <div className="flex flex-col gap-6">
        <div className="flex gap-10">
          <Track name="Fast" duration="var(--duration-fast)" ease={ease} />
          <Track name="Faster" duration="var(--duration-faster)" ease={ease} />
        </div>
        <div className="flex gap-10">
          <Track name="Long" duration="var(--duration-long)" ease={ease} />
          <Track name="Longer" duration="var(--duration-longer)" ease={ease} />
        </div>
        <div className="flex flex-col gap-6">
          <Track name="Longest" duration="var(--duration-longest)" ease={ease} />
          <Track duration="var(--motion-duration)" ease="var(--motion-transition-ease)" />
        </div>
      </div>
    </Section>
  )
}

const H = [1, 2, 3, 4, 5, 6] as const
/** What each heading level shows, as the Figma frame lists them: the primary face, then the secondary one. */
const HEADING_ROWS: Record<(typeof H)[number], ("pri" | "sec" | "bold")[]> = {
  1: ["pri", "sec", "sec"],
  2: ["pri", "sec", "sec"],
  3: ["pri", "bold"],
  4: ["pri", "bold"],
  5: ["pri", "sec", "sec"],
  6: ["pri", "sec", "sec", "bold"],
}
const SAMPLE = { pri: "Missed Thursday?", bold: "20 mins today?" }

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-8">
      <span className={`w-16 shrink-0 text-right ${caption}`}>{label}</span>
      <div className="flex min-w-0 flex-col gap-2">{children}</div>
    </div>
  )
}

const PANGRAM = "The quick brown fox jumps over the lazy dog."

function Typography({ scale }: { scale: keyof typeof SCALE_NAMES }) {
  return (
    <Section title="typography">
      <div className="flex flex-col gap-8">
        <p className="pl-24 text-lg">Typescale - {SCALE_NAMES[scale]}</p>
        {H.map((h) => {
          let sec = 0
          return (
            <Row key={h} label={`h${h}`}>
              {HEADING_ROWS[h].map((kind, i) => {
                if (kind === "pri") return <p key={i} className={`text-h${h}-pri`}>{SAMPLE.pri}</p>
                if (kind === "bold") return <p key={i} className={`text-h${h}-sec-bold`}>{SAMPLE.bold}</p>
                return <p key={i} className={`text-h${h}-sec`}>{sec++ === 0 ? "NO DRAMA" : "LLAMA"}</p>
              })}
            </Row>
          )
        })}
        <Row label="body lg">
          <p className="text-lg">{PANGRAM}</p>
          <p className="text-lg">{PANGRAM}</p>
        </Row>
        <Row label="body md">
          <p className="text-md">{PANGRAM}</p>
          <p className="text-md-bold">{PANGRAM}</p>
          <p className="text-md-italic">{PANGRAM}</p>
        </Row>
        <Row label="code md">
          <div className="font-mono text-sm tracking-tighter text-accent">
            <p>{PANGRAM}</p>
            <p>{PANGRAM}</p>
          </div>
        </Row>
        <Row label="body sm">
          <p className="text-sm">{PANGRAM}</p>
          <p className="text-sm-bold">{PANGRAM}</p>
          <p className="text-sm-italic">{PANGRAM}</p>
        </Row>
        <Row label="code sm">
          <div className="font-mono text-xs tracking-tighter text-accent">
            <p>{PANGRAM}</p>
            <p>{PANGRAM}</p>
          </div>
        </Row>
      </div>
    </Section>
  )
}

export function TokensTheme() {
  const { id, settings, scale, values } = useThemeSettings()
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-30 px-5 py-20 sm:px-10 lg:px-30 lg:py-40">
        <header className="flex flex-col gap-20">
          <h1 className="text-h1-pri-bold">{id}</h1>
          <div className="flex flex-wrap gap-10">
            {settings.map(([name, value]) => (
              <div key={name} className="flex flex-col gap-2">
                <p className="text-md opacity-60">{name}</p>
                <p className="text-h5-pri">{value}</p>
              </div>
            ))}
          </div>
        </header>
        <Colour />
        <Texture />
        <Shadow />
        <Radius />
        <Principles values={values} />
        <Motion />
        <Typography scale={scale} />
      </div>
    </div>
  )
}
