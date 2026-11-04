import { useEffect, useState, type CSSProperties, type ReactNode } from "react"
import { ArrowUpIcon, CaretDownIcon, StopIcon, XIcon } from "@phosphor-icons/react"

import { cn } from "@workspace/ui/lib/utils"
import { DEFAULT_THEME_ID, getPreset, googleFontsHref, type ThemePalette } from "@workspace/ui/themes"
import { FluidTabs } from "@workspace/ui/components/animate-ui/components/base/fluid-tabs"
import { PromptBar } from "@workspace/ui/components/ai/prompt-bar"
import { MetalSurface } from "@workspace/ui/components/metal-surface"
import { ControlButton } from "@workspace/ui/components/control-button"
import { ThemedIcon } from "@workspace/ui/components/themed-icon"
import { GlassLayer } from "@workspace/ui/components/liquid-glass"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@workspace/ui/components/carousel"
import { VoiceGlow } from "@workspace/ui/components/voice/voice-glow"
import { VoiceRing } from "@workspace/ui/components/voice/voice-ring"
import { useDemoVoice } from "@workspace/ui/components/voice/demo-voice"
import TextRotate from "@workspace/ui/components/fancy/text/text-rotate"
import { GradientBackground } from "@workspace/ui/components/backgrounds/gradient-background"
import { animatedBackgroundAurora } from "@workspace/ui/components/backgrounds/gradients/animated-background-aurora"
import { animatedBackgroundHolo } from "@workspace/ui/components/backgrounds/gradients/animated-background-holo"
import { Pill } from "./Pill"
import { SlopesPhone } from "./SlopesPhone"
import { DEFAULT_STYLING, themeScope } from "./explore/styling"

/* The homepage's Preview section (Figma "Preview", node 290:9537): five themes in a row, a
 * swipeable row of the system's components, and two links out. Choosing a theme re-themes
 * the component cards and nothing outside them; with none chosen they wear the page's look. */

const THEMES = [
  { id: "illuzion", label: "ILLUZION" },
  { id: "savaya", label: "Savaya" },
  { id: "pacha", label: "Pacha" },
  { id: "amnesia", label: "Amnesia" },
  { id: "ushuaia", label: "Ushuaia" },
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

/** The themes' own faces, fetched once so each button can set its name in its theme's font. */
let fontsRequested = false
function requestThemeFonts() {
  if (fontsRequested || typeof document === "undefined") return
  fontsRequested = true
  const families = THEMES.flatMap(({ id }) => {
    const fonts = getPreset(id)?.fonts
    return fonts ? [fonts.display, fonts.body, fonts.secondary] : []
  }).map((f) => ({ family: f.family, weights: [f.weight] }))
  const href = googleFontsHref(families)
  if (!href) return
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href = href
  document.head.append(link)
}

/** The swatch is 48px, 8px smaller (40px) where the row is a single line on a smaller desktop (640 to 1099px). */
const SWATCH = "size-12 sm:max-[1099px]:size-10"

/** One quarter-pair of the swatch: the theme's secondary above its foreground, down the right half. */
function Swatch({ palette, selected, mode }: { palette: ThemePalette; selected: boolean; mode: "light" | "dark" }) {
  // selected tiles carry a 4px black border, so the halves sit 2px further up and left than on the others
  // the Figma's 48px swatch in percentages of the box, so it scales: 25 × 24 halves at 23.67 across (unselected), or in
  // the 40px inside of the 4px border, at 21.67 across with the pair 2px up
  const half = selected ? "left-[54.17%] h-[60%] w-[62.5%]" : "left-[49.31%] h-1/2 w-[52.08%]"
  const [top, bottom] = selected ? ["top-[-5%]", "top-[55%]"] : ["top-0", "top-1/2"]
  return (
    <span aria-hidden className={cn("relative block shrink-0", SWATCH)}>
      {/* the selected ring is the metal surface, 2px outside the swatch, always mounted so it only fades */}
      <span className="pointer-events-none absolute inset-[-2px] rounded-[14px] transition-opacity duration-300" style={{ opacity: selected ? 1 : 0 }}>
        <MetalSurface active={selected} variant="button" engine="v1" ringWidth={2} theme={mode} className="size-full rounded-[14px]! bg-transparent!">
          <span className="block size-full" />
        </MetalSurface>
      </span>
    <span
      className={cn(
        "relative block overflow-clip rounded-[12px]", SWATCH,
        selected && "border-4 border-solid border-black"
      )}
    >
      <span className="absolute inset-0 rounded-[12px]" style={{ backgroundColor: palette.background }} />
      <span className={cn("absolute", half, top)} style={{ backgroundColor: palette.secondary }} />
      <span className={cn("absolute", half, bottom)} style={{ backgroundColor: palette.foreground }} />
      <span
        className={cn("pointer-events-none absolute rounded-[inherit] shadow-[inset_2px_4px_8px_0px_rgba(34,34,34,0.24)]", selected ? "inset-[-2px]" : "inset-0")}
      />
    </span>
    </span>
  )
}

/** A theme choice (Figma 435:6368): its swatch over its name in its own face. Only the chosen one is lit; the rest sit at a light wash. */
function ThemeButton({
  id,
  label,
  selected,
  onClick,
}: {
  id: ThemeId | "default"
  label: string
  selected: boolean
  onClick: () => void
}) {
  // "This Theme" is the page's own look, the Berghain preset, and is the choice when no other is made
  const preset = getPreset(id === "default" ? DEFAULT_THEME_ID : id)
  if (!preset) return null
  const style: CSSProperties = {
    fontFamily: `"${preset.fonts.display.family}", serif`,
    fontWeight: preset.fonts.display.weight,
    color: selected
      ? id === "default"
        ? preset.palette.primary
        : id === "ushuaia"
          ? // its own label colour is near-black, which vanishes on the page's dark; the selector shows it white instead
            "#ffffff"
          : preset.palette.primaryForeground
      : "var(--alpha-light-md, rgba(246,244,244,0.24))",
  }
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      style={style}
      className="flex min-w-0 flex-col items-center justify-center gap-5 overflow-clip rounded-[16px] px-1 py-4 text-center leading-[1.14] outline-none transition-colors duration-300 [container-type:inline-size] focus-visible:ring-2 focus-visible:ring-white/60 motion-reduce:transition-none sm:flex-1"
    >
      <Swatch palette={preset.palette} selected={selected} mode={preset.colorMode} />
      {/* 20cqw is the size at which the longest name, ILLUZION, just fits the tile: 24px when there is room, smaller as the row narrows */}
      {/* ILLUZION is the heaviest face and reads larger than the rest, so it is 2px under the common size */}
      <span className={cn("max-w-full", id === "illuzion" ? "text-[length:calc(min(24px,20cqw)-2px)]" : "text-[length:min(24px,20cqw)]")}>{label}</span>
    </button>
  )
}


/** Each theme's backdrop, always mounted and fading in or out, so a change is a cross-fade. Savaya's is its gradient under grain. */
function ThemeBackdrop({ selected }: { selected: ThemeId | null }) {
  return (
    <>
      {THEMES.map(({ id }) => (
        <div
          key={id}
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none"
          style={{
            opacity: selected === id ? 1 : 0,
            ...(id === "savaya" ? { backgroundImage: SAVAYA_GRADIENT } : { backgroundColor: getPreset(id)?.palette.background }),
          }}
        >
          {id === "savaya" && (
            <>
              <Grain />
              <div className="absolute inset-0 bg-black/[0.12]" />
            </>
          )}
        </div>
      ))}
    </>
  )
}

/** The glass the cards are made of: the Glass sheet's Soft weight in a 24px corner, at the softer rim the homepage tiles use. */
function CardGlass({ radius = 24 }: { radius?: number }) {
  return <GlassLayer weight="soft" radius={radius} edge={0.35} />
}

/** A 500 × 380 card of glass, with the theme's backdrop over it. */
function PreviewCard({ selected, className, background, children }: { selected: ThemeId | null; className?: string; background?: ReactNode; children: ReactNode }) {
  return (
    <div className={cn("relative isolate h-[380px] overflow-clip rounded-[24px] text-foreground", className)}>
      <CardGlass />
      <ThemeBackdrop selected={selected} />
      {background}
      {children}
    </div>
  )
}

/** Aurora at twice its speed (0.205). */
const AURORA_FAST = { ...animatedBackgroundAurora, speed: 0.41 }

/** Holo at half its speed (1.265), so the voice card's background drifts rather than flows. */
const HOLO_SLOW = { ...animatedBackgroundHolo, speed: 0.63 }

/** The scale that fits the 402-wide phone to the card at 289, which also brings its 66px bottom corner to the Figma's 48. */
const PHONE_SCALE = 289 / 402

/** The pager inside the voice card: a dark pill of three dots, the current one solid. */
function Dots({ api }: { api: CarouselApi }) {
  const [state, setState] = useState({ count: 0, index: 0 })
  useEffect(() => {
    if (!api) return
    const read = () => setState({ count: api.scrollSnapList().length, index: api.selectedScrollSnap() })
    read()
    api.on("select", read).on("reInit", read)
    return () => {
      api.off("select", read).off("reInit", read)
    }
  }, [api])
  return (
    <div className="absolute bottom-6 left-1/2 z-10 flex h-5 -translate-x-1/2 items-center gap-3 rounded-full bg-(--alpha-dark-md) px-3.5" role="group" aria-label="Voice variants">
      {Array.from({ length: state.count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Show variant ${i + 1}`}
          aria-current={i === state.index}
          onClick={() => api?.scrollTo(i)}
          className={cn("size-2 cursor-pointer rounded-full bg-foreground transition-opacity duration-300 motion-reduce:transition-none", i === state.index ? "opacity-100" : "opacity-30 hover:opacity-60")}
        />
      ))}
    </div>
  )
}

/**
 * The right-hand card: the voice components, one at a time. Swipe or use the dots to move between the
 * prompt bar with its glow, the ring, and a phone with the glow along its edge. They share one demo voice.
 */
function VoiceCard({ selected }: { selected: ThemeId | null }) {
  const [api, setApi] = useState<CarouselApi>()
  const level = useDemoVoice(true)
  // the library's own colours until a theme is chosen, then the theme's
  const glowColors = selected ? "theme" : "colorful"
  const ringColors = selected ? "theme" : "spectrum"
  return (
    <PreviewCard selected={selected} background={<GradientBackground config={HOLO_SLOW} useThemeColors scrim={0.75} className="opacity-50" />}>
      <Carousel opts={{ align: "start" }} setApi={setApi} className="h-full">
        <CarouselContent className="ml-0">
          <CarouselItem className="h-[380px] pl-0">
            <div className="flex h-full items-end justify-center px-10 pb-[84px]">
              <VoiceGlow colorVariant={glowColors} level={level} className="w-full">
                <PromptBar appearance={{ demo: false }} data={{ modelLabel: "Agent", placeholder: "Type or Talk..." }} />
              </VoiceGlow>
            </div>
          </CarouselItem>
          <CarouselItem className="h-[380px] pl-0">
            <div className="flex h-full items-center justify-center pb-[52px]">
              <VoiceRing state="listening" level={level} size={256} colorVariant={ringColors} />
            </div>
          </CarouselItem>
          <CarouselItem className="h-[380px] pl-0">
            {/* the phone runs up past the card's top edge, so only its bottom corners show */}
            <div className="relative mx-auto" style={{ width: 289, height: 312 }}>
              <div className="absolute left-0" style={{ top: -66 * PHONE_SCALE, width: 402, height: 500, transform: `scale(${PHONE_SCALE})`, transformOrigin: "top left" }}>
                <VoiceGlow type="mobile" colorVariant={glowColors} borderRadius={66} level={level}>
                  <div className="relative h-[500px] w-[402px] overflow-clip rounded-b-[66px] bg-foreground/5 text-foreground outline-1 -outline-offset-[0.5px] outline-foreground/20">
                    <h6 className="absolute inset-x-8 top-[146px] text-center">Alexa, tell me a rude joke</h6>
                    <div className="absolute inset-x-8 bottom-16 flex items-center justify-between">
                      <ControlButton shape="pill" size="lg" aria-label="Choose agent">
                        Agent (auto)
                        <ThemedIcon phosphor={CaretDownIcon} />
                      </ControlButton>
                      <div className="flex items-center gap-4">
                        <ControlButton size="lg" aria-label="Stop audio">
                          <ThemedIcon phosphor={StopIcon} />
                        </ControlButton>
                        <ControlButton size="lg" aria-label="Close">
                          <ThemedIcon phosphor={XIcon} />
                        </ControlButton>
                      </div>
                    </div>
                  </div>
                </VoiceGlow>
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
      <Dots api={api} />
    </PreviewCard>
  )
}

/**
 * A 500 × 372 card with a caption under it, the whole of it a link out. The card holds an image, or a
 * `visual` that is told when the pointer is on the card (Slopes' phone plays its recordings only then).
 */
function MediaLink({
  href,
  image,
  visual,
  label,
  children,
}: {
  href: string
  image?: string
  visual?: (hovered: boolean) => ReactNode
  label: string
  children: ReactNode
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-w-0 flex-1 flex-col gap-6 outline-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative isolate h-[372px] w-full overflow-clip rounded-[16px] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-white/60">
        {!visual && !image && <CardGlass radius={16} />}
        {visual ? (
          <>
            <CardGlass radius={16} />
            <img alt="" src="/home/slopes-bg.png" className="pointer-events-none absolute inset-0 size-full rounded-[16px] object-cover opacity-40" />
            {visual(hovered)}
          </>
        ) : image ? (
          <img alt="" src={image} className="absolute inset-0 size-full object-cover object-top" />
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-md">{label}</p>
        <p className="text-h6-pri">{children}</p>
      </div>
    </a>
  )
}

export function Preview() {
  const [selected, setSelected] = useState<ThemeId | null>(null)
  useEffect(requestThemeFonts, [])
  const scope = themeScope(selected, DEFAULT_STYLING)

  return (
    <>
      {/* themes */}
      <div className="flex w-full flex-col gap-12">
        <Pill>Preview</Pill>
        <div className="flex w-full flex-col gap-2">
          <div role="group" aria-label="Theme" className="grid grid-cols-3 gap-2 sm:flex">
            <ThemeButton id="default" label="This Theme" selected={selected === null} onClick={() => setSelected(null)} />
            {THEMES.map(({ id, label }) => (
              <ThemeButton key={id} id={id} label={label} selected={selected === id} onClick={() => setSelected(id)} />
            ))}
          </div>
        </div>
      </div>

      {/* the system's components on the left, and on the right the voice components, one at a time */}
      <div className="flex w-full flex-col gap-6">
        <div className={cn(scope.className, "grid w-full grid-cols-1 gap-x-10 gap-y-5 font-[family-name:var(--font-body)] [font-weight:var(--font-body-weight)] min-[1100px]:grid-cols-2")} style={scope.style}>
          <PreviewCard selected={selected} className="min-w-0" background={<GradientBackground config={AURORA_FAST} useThemeColors scrim={0.75} className="opacity-50" />}>
            <div className="relative flex h-full flex-col items-center justify-evenly px-6">
              <FluidTabs />
              <div className="flex items-center gap-3">
                <ControlButton size="lg" engine="v2" metal halo filled aria-label="Send">
                  <ThemedIcon phosphor={ArrowUpIcon} />
                </ControlButton>
                <ControlButton size="lg" shape="pill" engine="v2" metal halo>
                  Upgrade to Pro
                </ControlButton>
              </div>
              <h6>
                <TextRotate texts={["Design", "Build", "Ship"]} rotationInterval={1400} staggerDuration={0.02} />
              </h6>
            </div>
          </PreviewCard>
          <div className="min-w-0">
            <VoiceCard selected={selected} />
          </div>
        </div>
      </div>

      {/* three products built with it */}
      <div className="mt-10 flex w-full flex-col gap-12">
        <Pill>Projects</Pill>
        <div className="flex w-full flex-col gap-10 min-[1100px]:flex-row min-[1100px]:gap-8">
          <MediaLink href="https://slopes.lukeai.space" visual={(hovered) => <SlopesPhone playing={hovered} />} label="Slopes map">
            Real-time slope analysis,
            <br />
            <em className="text-h6-sec-bold">anywhere on earth.</em>
          </MediaLink>
          <MediaLink href="https://goodnudge.lukeai.space" image="/home/goodnudge.webp" label="Good nudge guidance">
            A collection of behavioral nudge principles. <em className="text-h6-sec-bold">Don’t deceive.</em>
          </MediaLink>
          <MediaLink href="https://chart.lukeai.space" image="/home/chart-horoscopes.png" label="Birth chart horoscopes">
            Written in the stars.
            <br />
            <em className="text-h6-sec-bold">Shared by stars &amp; their friends.</em>
          </MediaLink>
        </div>
      </div>
    </>
  )
}
