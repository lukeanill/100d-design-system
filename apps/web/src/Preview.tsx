import { useEffect, useState, type CSSProperties, type ReactNode } from "react"
import { ArrowUpIcon, CaretDownIcon, StopIcon, XIcon } from "@phosphor-icons/react"

import { cn } from "@workspace/ui/lib/utils"
import { getPreset, googleFontsHref } from "@workspace/ui/themes"
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
import { Pill } from "./Pill"
import { BODY, MIGRA } from "./LinkTile"
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

/** Whether a theme's text is light, by its foreground colour: a light foreground means a dark page, so its inactive tiles carry light text. */
function hasLightText(hex: string | undefined) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex ?? "")
  if (!m) return true
  const n = parseInt(m[1]!, 16)
  const lum = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255
  return lum > 0.5
}

/** The themes' own faces, fetched once so each button can set its name in its theme's font. */
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
  lightText,
  onClick,
}: {
  id: ThemeId
  label: string
  selected: boolean
  /** The preview's own text is light (a dark page), so an inactive tile's label is too. */
  lightText: boolean
  onClick: () => void
}) {
  const preset = getPreset(id)
  if (!preset) return null
  const style: CSSProperties = {
    fontFamily: `"${preset.fonts.display.family}", serif`,
    fontWeight: preset.fonts.display.weight,
    // active: the theme's own label colour; inactive: a dark or light wash of text by the page's light or dark
    color: selected
      ? preset.palette.primaryForeground
      : lightText
        ? "var(--alpha-light-md, rgba(246,244,244,0.24))"
        : "var(--alpha-dark-lg, rgba(30,30,30,0.32))",
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
        "relative flex h-20 max-h-20 w-full min-w-0 shrink-0 items-center justify-center overflow-clip rounded-[16px] border px-4 text-center text-[24px] leading-[1.14] min-[1100px]:flex-1 min-[1100px]:px-10 transition-[background-color,border-color,backdrop-filter] duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/60 motion-reduce:transition-none",
        // the metal ring is the selected border; the fills are alpha overlays, light/sm when chosen, dark/xs otherwise
        selected
          ? // on a light theme the ring needs a darker line against it to read on the pale tile
            preset.scheme === "light"
            ? "border-[color:var(--alpha-dark-xs,rgba(0,0,0,0.04))]"
            : "border-transparent"
          : "border-transparent bg-[image:linear-gradient(var(--alpha-dark-sm,rgba(30,30,30,0.08)),var(--alpha-dark-sm,rgba(30,30,30,0.08)))]"
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
          className="pointer-events-none absolute inset-0 bg-[image:linear-gradient(var(--alpha-light-md,rgba(246,244,244,0.24)),var(--alpha-light-md,rgba(246,244,244,0.24)))]"
        />
      )}
      <span className="relative">{label}</span>
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
function CardGlass() {
  return <GlassLayer weight="soft" radius={24} edge={0.35} />
}

/** A 500 × 380 card of glass, with the theme's backdrop over it. */
function PreviewCard({ selected, className, children }: { selected: ThemeId | null; className?: string; children: ReactNode }) {
  return (
    <div className={cn("relative isolate h-[380px] overflow-clip rounded-[24px] text-foreground", className)}>
      <CardGlass />
      <ThemeBackdrop selected={selected} />
      {children}
    </div>
  )
}

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
    <PreviewCard selected={selected}>
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

/** The video for the Slopes card, played while it is hovered. Until the file is in /public/home, the card shows a plain glass tile. */
const SLOPES_VIDEO: string | undefined = undefined

/**
 * A 500 × 372 card with a caption under it, the whole of it a link out. The card holds an image, or a
 * video that plays only while the pointer is on it (and starts again from the top each time).
 */
function MediaLink({ href, image, video, label, children }: { href: string; image?: string; video?: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-w-0 flex-1 flex-col gap-6 outline-none"
      onMouseEnter={(e) => void e.currentTarget.querySelector("video")?.play().catch(() => {})}
      onMouseLeave={(e) => {
        const v = e.currentTarget.querySelector("video")
        if (v) {
          v.pause()
          v.currentTime = 0
        }
      }}
    >
      <div className="relative isolate h-[372px] w-full overflow-clip rounded-[24px] group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-white/60">
        {!video && !image && <CardGlass />}
        {video ? (
          <video src={video} poster={image} muted loop playsInline preload="metadata" className="absolute inset-0 size-full object-cover" />
        ) : image ? (
          <img alt="" src={image} className="absolute inset-0 size-full object-cover" />
        ) : null}
      </div>
      <div className="flex flex-col gap-2">
        <p className={`${BODY} text-[16px] leading-[1.42]`}>{label}</p>
        <p className={`${MIGRA} text-[28px] leading-[1.14] font-extralight`}>{children}</p>
      </div>
    </a>
  )
}

export function Preview() {
  const [selected, setSelected] = useState<ThemeId | null>(null)
  useEffect(requestThemeFonts, [])
  const scope = themeScope(selected, DEFAULT_STYLING)
  // the page's text is light unless the chosen theme's is dark
  const lightText = hasLightText(selected ? getPreset(selected)?.palette.foreground : undefined)

  return (
    <>
      {/* themes */}
      <div className="flex w-full flex-col gap-6">
        <Pill>Preview</Pill>
        <div className="flex w-full flex-col gap-2">
          <div role="group" aria-label="Theme" className="grid grid-cols-2 gap-2 min-[1100px]:flex min-[1100px]:gap-2">
            {THEMES.map(({ id, label }) => (
              <ThemeButton
                key={id}
                id={id}
                label={label}
                selected={selected === id}
                lightText={lightText}
                onClick={() => setSelected((current) => (current === id ? null : id))}
              />
            ))}
          </div>
        </div>
      </div>

      {/* the system's components on the left, and on the right the voice components, one at a time */}
      <div className="flex w-full flex-col gap-6">
        <div className={cn(scope.className, "grid w-full grid-cols-1 gap-10 font-[family-name:var(--font-body)] [font-weight:var(--font-body-weight)] min-[1100px]:grid-cols-2")} style={scope.style}>
          <PreviewCard selected={selected} className="min-w-0">
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

      {/* two products built with it */}
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full flex-col gap-10 min-[1100px]:flex-row">
          <MediaLink href="https://slopes.lukeai.space" video={SLOPES_VIDEO} label="Slopes map">
            Real-time slope analysis, <em className="font-extrabold italic">anywhere.</em>
          </MediaLink>
          <MediaLink href="https://chart.lukeai.space" image="/home/chart-horoscopes.png" label="Birth chart horoscopes">
            Written in the stars. <em className="font-extrabold italic">Shared by stars.</em>
          </MediaLink>
        </div>
      </div>
    </>
  )
}
