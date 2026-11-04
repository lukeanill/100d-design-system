import { presets, themeStyle, type Theme } from "@workspace/ui/themes"
import { cn } from "@workspace/ui/lib/utils"

import { ActionButton, BackButton, Header, Page, PageTitle } from "./Chrome"

/**
 * Text exactly as the Figma draws it, typos and capitals included. Nothing here
 * is corrected: the spellings are flagged for the designer to decide.
 */
const TILE_LABELS: Record<string, string> = {
  fabrik: "FABRIK",
  illuzion: "ILLUZION",
  laroc: "Laroc",
  bootshaus: "Bootshaus",
  berghain: "Berhgain",
  savaya: "Savaya",
  pacha: "Pacha",
  amnesia: "Amensia",
  ushuaia: "Ashuaia",
}
/** Spacing is stored as sm, md, lg; the panel says it in words. */
const SPACING_WORDS = { sm: "small", md: "medium", lg: "large" } as const

/**
 * What the Preview panel says about a theme's six settings, in Figma's order. Every value is read from
 * the theme being shown, so the panel can only say what the theme is; copy.test.ts holds it to the
 * tokens the theme writes.
 */
export const settingsOf = (t: Theme) => [
  ["shadow", t.shadow],
  ["spacing", SPACING_WORDS[t.spacing]],
  ["radius", t.radius],
  ["texture", t.material],
  ["color", t.colorMode],
  ["motion", t.motion],
]

/** The two typefaces the specimen shows: the theme's own heading and body families, by their real names. */
export const specimenOf = (t: Theme) => ({ heading: t.fonts.display.family, body: t.fonts.body.family })

const sample = "The quick brown fox jumps over the lazy dog."

/** The chosen theme, in its own colours, fonts and settings. A controlled space: nothing outside it changes. */
function Preview({ theme }: { theme: Theme }) {
  const p = theme.palette
  const rule = { borderColor: "color-mix(in oklab, var(--foreground), transparent 75%)" }
  return (
    <div
      style={{ ...themeStyle(theme), background: "var(--background)", color: "var(--foreground)", borderRadius: 16 }}
      className="p-[53px] max-sm:p-6"
    >
      <h3 className="border-b pb-6 text-[40px] leading-tight" style={{ ...rule, fontFamily: "var(--font-primary)", fontWeight: "var(--h1-weight)" }}>
        PREVIEW
      </h3>
      <dl className="grid grid-cols-3 gap-x-6 gap-y-4 border-b py-6 text-sm sm:grid-cols-6" style={{ ...rule, fontFamily: "var(--font-body-token)" }}>
        {settingsOf(theme).map(([k, v]) => (
          <div key={k}>
            <dt className="opacity-60">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      <div className="grid items-start gap-6 border-b py-8 sm:grid-cols-[1.1fr_1.5fr]" style={rule}>
        <p className="text-[56px] leading-none" style={{ fontFamily: "var(--font-primary)", fontWeight: "var(--h1-weight)", color: p.primaryForeground === p.background ? "var(--primary)" : "var(--primary-foreground)" }}>
          {specimenOf(theme).heading}
        </p>
        <p className="text-sm" style={{ fontFamily: "var(--font-body-token)", fontWeight: "var(--font-body-weight)" }}>
          {specimenOf(theme).body}.<br />
          {sample}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-5 pt-8 sm:grid-cols-4">
        {[p.primaryForeground, p.primary, p.secondary, p.secondaryForeground].map((c, i) => (
          <span key={i} className="h-[66px]" style={{ background: c }} title={c} />
        ))}
      </div>
    </div>
  )
}

export function Copy({
  selected,
  onSelect,
  onBack,
  onContinue,
}: {
  selected: string | null
  onSelect: (id: string) => void
  onBack: () => void
  onContinue: () => void
}) {
  const current = presets.find((t) => t.id === selected)
  return (
    <Page>
      <Header
        nav={<BackButton onClick={onBack} />}
        actions={
          <ActionButton onClick={onContinue} disabled={!current}>
            Continue
          </ActionButton>
        }
      />
      <PageTitle>Copy a Theme</PageTitle>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3" role="radiogroup" aria-label="Preset themes">
        {presets.map((t) => {
          const on = t.id === selected
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onSelect(t.id)}
              className={cn(
                "flex h-[88px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border px-4 text-center leading-none outline-none transition-colors [container-type:inline-size] focus-visible:ring-[3px] focus-visible:ring-ring/50",
                on ? "border-transparent" : "border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.05] text-white/20 hover:text-white/40"
              )}
              style={
                on
                  ? {
                      ...themeStyle(t),
                      background: "var(--background)",
                      color: t.palette.primaryForeground === t.palette.background ? "var(--primary)" : "var(--primary-foreground)",
                      fontFamily: "var(--font-primary)",
                      fontWeight: "var(--h1-weight)",
                    }
                  : { fontFamily: `'${t.fonts.display.family}', serif`, fontWeight: t.fonts.display.weight }
              }
            >
              {/* 18.5cqw is the size at which the longest name, Bootshaus, just fits the tile; every name takes it, up to 48px (32px on a phone) */}
              <span className="text-[length:min(48px,18.5cqw)] max-sm:text-[length:min(32px,18.5cqw)]">{TILE_LABELS[t.id] ?? t.label}</span>
            </button>
          )
        })}
      </div>
      {current && (
        <div className="mt-8">
          <Preview theme={current} />
        </div>
      )}
      {!current && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-sm text-white/50">Select a theme to preview</div>
      )}
    </Page>
  )
}
