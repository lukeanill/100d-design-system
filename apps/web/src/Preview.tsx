import { useEffect, useState, type CSSProperties } from "react"
import { ArrowUpIcon } from "@phosphor-icons/react"

import { cn } from "@workspace/ui/lib/utils"
import { getPreset, googleFontsHref } from "@workspace/ui/themes"
import { FluidTabs } from "@workspace/ui/components/animate-ui/components/base/fluid-tabs"
import { PromptBar } from "@workspace/ui/components/ai/prompt-bar"
import { MetalSurface } from "@workspace/ui/components/metal-surface"
import { ControlButton } from "@workspace/ui/components/control-button"
import { ThemedIcon } from "@workspace/ui/components/themed-icon"
import { StatCard } from "@workspace/ui/components/ai/stat-card"
import { DEFAULT_STYLING, themeScope } from "./explore/styling"

/* The homepage's Preview section (Figma "Preview", node 290:9537): four themes down the
 * left, and four of the system's components on the right. Choosing a theme re-themes the
 * container and nothing outside it; with none chosen the components wear the page's look. */

const THEMES = [
  { id: "illuzion", label: "ILLUZION" },
  { id: "savaya", label: "Savaya" },
  { id: "pacha", label: "Pacha" },
  { id: "amnesia", label: "Amnesia" },
] as const

type ThemeId = (typeof THEMES)[number]["id"]

/** Savaya's drawn backdrop: a two-tone gradient under film grain. The other themes get their flat background. */
const SAVAYA_GRADIENT = "linear-gradient(203.07deg, rgb(142, 123, 209) 27.792%, rgb(221, 111, 7) 90.604%)"
const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0.3 0.6 0.1 0 0  0.3 0.6 0.1 0 0  0.3 0.6 0.1 0 0  0 0 0 0 1'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>"
)}")`

function Grain({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay", className)}
      style={{ backgroundImage: GRAIN }}
    />
  )
}

/** The four themes' own faces, fetched once so each button can set its name in its theme's font. */
let fontsRequested = false
function requestThemeFonts() {
  if (fontsRequested || typeof document === "undefined") return
  fontsRequested = true
  const families = THEMES.flatMap(({ id }) => {
    const fonts = getPreset(id)?.fonts
    return fonts ? [fonts.display, fonts.body, fonts.serif] : []
  }).map((f) => ({ family: f.family, weights: [f.weight] }))
  const href = googleFontsHref(families)
  if (!href) return
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = href
  document.head.append(link)
}

function ThemeButton({
  id,
  label,
  selected,
  onClick,
}: {
  id: ThemeId
  label: string
  selected: boolean
  onClick: () => void
}) {
  const preset = getPreset(id)
  if (!preset) return null
  const style: CSSProperties = {
    fontFamily: `"${preset.fonts.display.family}", serif`,
    fontWeight: preset.fonts.display.weight,
    color: preset.palette.primaryForeground,
    backgroundColor: selected ? preset.palette.background : undefined,
    ["--radius" as string]: "16px",
  }
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      style={style}
      className={cn(
        "relative flex h-32 w-full shrink-0 items-center justify-center overflow-clip rounded-[16px] border px-4 text-center text-[22px] leading-[1.14] min-[1100px]:w-[220px] min-[1100px]:px-10 min-[1100px]:text-[28px] transition-[background-color,border-color,backdrop-filter] duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/60 motion-reduce:transition-none",
        // the metal ring is the selected border; the fills are alpha overlays, light/sm when chosen, dark/xs otherwise
        selected
          ? // on a light theme the ring needs a darker line against it to read on the pale tile
            preset.scheme === "light"
            ? "border-[color:var(--alpha-dark-xs,rgba(0,0,0,0.04))]"
            : "border-transparent"
          : "border-white/15 bg-[image:linear-gradient(var(--alpha-dark-xs,rgba(0,0,0,0.04)),var(--alpha-dark-xs,rgba(0,0,0,0.04)))]"
      )}
    >
      {selected && id === "savaya" && (
        <>
          <span aria-hidden className="absolute inset-0" style={{ backgroundImage: SAVAYA_GRADIENT }} />
          <Grain />
        </>
      )}
      {/* always mounted, only its strength changes, so choosing a tile never restarts the effect */}
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[16px] transition-opacity duration-300" style={{ opacity: selected ? 1 : 0 }}>
        <MetalSurface active={selected} variant="button" engine="v1" ringWidth={2} theme={preset.scheme} className="size-full rounded-[16px]! bg-transparent!">
          <span className="block size-full" />
        </MetalSurface>
      </span>
      {selected && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[image:linear-gradient(var(--alpha-light-sm,rgba(255,255,255,0.12)),var(--alpha-light-sm,rgba(255,255,255,0.12)))]"
        />
      )}
      <span className="relative">{label}</span>
    </button>
  )
}

export function Preview() {
  const [selected, setSelected] = useState<ThemeId | null>(null)
  useEffect(requestThemeFonts, [])
  const scope = themeScope(selected, DEFAULT_STYLING)

  return (
    <div
      className={cn(
        scope.className,
        "relative flex w-full flex-col gap-10 overflow-clip rounded-[16px] border border-white/15 bg-gradient-to-b from-white/[0.02] to-white/[0.02] p-6 font-[family-name:var(--font-body)] [font-weight:var(--font-body-weight)] text-foreground [contain:layout_paint] min-[1100px]:block min-[1100px]:h-[640px] min-[1100px]:p-0"
      )}
      style={scope.style}
    >
      {/* each theme's backdrop is always mounted and fades in or out, so a change is a cross-fade */}
      {THEMES.map(({ id }) => (
        <div
          key={id}
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none"
          style={{
            opacity: selected === id ? 1 : 0,
            ...(id === "savaya" ? {} : { backgroundColor: getPreset(id)?.palette.background }),
          }}
        >
          {id === "savaya" && (
            <>
              {/* the gradient lives on the Figma's own 1168 × 714 plate, set 71px left and 59px above the container, because its angle follows the plate's shape */}
              <div
                className="absolute"
                style={{ left: -71, top: -59, width: 1168, height: 714, backgroundImage: SAVAYA_GRADIENT }}
              />
              <Grain />
              <div className="absolute inset-0 bg-black/[0.12]" />
            </>
          )}
        </div>
      ))}

      <div
        role="group"
        aria-label="Theme"
        className="relative grid grid-cols-2 gap-4 min-[1100px]:absolute min-[1100px]:top-[40px] min-[1100px]:left-[40px] min-[1100px]:flex min-[1100px]:flex-col"
      >
        {THEMES.map(({ id, label }) => (
          <ThemeButton
            key={id}
            id={id}
            label={label}
            selected={selected === id}
            onClick={() => setSelected((current) => (current === id ? null : id))}
          />
        ))}
      </div>

      {/* the four components, centred on the rows the Figma's examples sit in */}
      <div className="relative flex flex-col items-center gap-10 min-[1100px]:static min-[1100px]:block">
        <div className="min-[1100px]:absolute min-[1100px]:top-[123px] min-[1100px]:left-[calc(50%+130px)] min-[1100px]:-translate-x-1/2 min-[1100px]:-translate-y-1/2">
          <FluidTabs />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 min-[1100px]:w-max min-[1100px]:flex-nowrap min-[1100px]:absolute min-[1100px]:top-[232px] min-[1100px]:left-[calc(50%+130px)] min-[1100px]:-translate-x-1/2 min-[1100px]:-translate-y-1/2">
          {(["v1", "v2"] as const).map((engine) => (
            <div key={engine} className="flex items-center gap-3">
              <ControlButton size="lg" engine={engine} metal halo filled aria-label={`Send (${engine})`}>
                <ThemedIcon phosphor={ArrowUpIcon} />
              </ControlButton>
              <ControlButton size="lg" shape="pill" engine={engine} metal halo>
                Upgrade to Pro
              </ControlButton>
            </div>
          ))}
        </div>
        <div className="min-[1100px]:absolute min-[1100px]:top-[313px] min-[1100px]:left-[calc(50%+130px)] min-[1100px]:-translate-x-1/2">
          <StatCard />
        </div>
        <div className="w-full max-w-[433px] min-[1100px]:absolute min-[1100px]:top-[552px] min-[1100px]:left-[calc(50%+130px)] min-[1100px]:-translate-x-1/2 min-[1100px]:-translate-y-1/2">
          <PromptBar appearance={{ demo: false }} />
        </div>
      </div>
    </div>
  )
}
