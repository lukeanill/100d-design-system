import { ChatCircleDotsIcon, CalendarHeartIcon, NotePencilIcon, ArrowUpIcon } from "@phosphor-icons/react"

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
/** The Preview's "color" value as Figma's Settings/color holds it, which can disagree with the palette. */
const FIGMA_COLOR: Record<string, string> = {
  fabrik: "dark", illuzion: "dark", laroc: "light", bootshaus: "dark", berghain: "dark",
  savaya: "dark", pacha: "light", amnesia: "dark", ushuaia: "light",
}
/**
 * The font name each theme's specimen shows, as written on the Figma Themes frame
 * (node 9:178), typos included: "Glook" is shown as drawn, for the designer to decide.
 */
const SPECIMEN_NAMES: Record<string, string> = {
  fabrik: "Folio",
  illuzion: "Intan",
  laroc: "GT PRESSURA",
  bootshaus: "ITC Garamond",
  berghain: "PP Editorial",
  savaya: "Glook",
  pacha: "Khaviax",
  amnesia: "Swear",
  ushuaia: "Migra",
}

/** What the Preview panel says about a theme's six settings, in Figma's order. */
const settingsOf = (t: Theme) => [
  ["elevation", t.elevation],
  ["spacing", t.spacing],
  ["radius", t.radius],
  ["material", t.material],
  ["color", FIGMA_COLOR[t.id] ?? t.scheme],
  ["motion", t.motion],
]

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
      <div className="grid items-start gap-6 border-b py-8 sm:grid-cols-[1.1fr_1.5fr_1.5fr_auto]" style={rule}>
        <p className="text-[56px] leading-none" style={{ fontFamily: "var(--font-primary)", fontWeight: "var(--h1-weight)", color: p.primaryForeground === p.background ? "var(--primary)" : "var(--primary-foreground)" }}>
          {SPECIMEN_NAMES[theme.id] ?? theme.fonts.display.family}
        </p>
        <p className="text-sm" style={{ fontFamily: "var(--font-body-token)", fontWeight: "var(--font-body-weight)" }}>
          {theme.fonts.body.family}.<br />
          {sample}
        </p>
        <p className="text-sm" style={{ fontFamily: "var(--font-emphasis)" }}>
          {theme.fonts.serif.family}.<br />
          {sample}
        </p>
        <div className="grid grid-cols-2 gap-2" style={{ color: "var(--secondary)" }}>
          {[ArrowUpIcon, ChatCircleDotsIcon, NotePencilIcon, CalendarHeartIcon].map((I, i) => (
            <span key={i} className="grid size-6 place-items-center rounded-[4px]" style={{ background: "var(--secondary)", color: "var(--background)" }}>
              <I size={14} weight={theme.icons.weight} />
            </span>
          ))}
        </div>
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
        title={<PageTitle>Copy a Theme</PageTitle>}
        actions={
          <ActionButton onClick={onContinue} disabled={!current}>
            Continue
          </ActionButton>
        }
      />
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
                "flex h-[155px] cursor-pointer items-center justify-center overflow-hidden rounded-2xl border px-4 text-center text-[48px] leading-none outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 max-sm:h-[96px] max-sm:text-[32px]",
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
              {TILE_LABELS[t.id] ?? t.label}
            </button>
          )
        })}
      </div>
      {current && (
        <div className="mt-[67px]">
          <Preview theme={current} />
        </div>
      )}
      {!current && (
        <div className="mt-[67px] rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-sm text-white/50">Select a theme to preview</div>
      )}
    </Page>
  )
}
