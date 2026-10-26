import { useRef, useState, type CSSProperties, type ReactNode } from "react"
import { Link } from "react-router"
import { Popover, PopoverPanel, PopoverTrigger } from "@workspace/ui/components/animate-ui/components/base/popover"
import { GlassLayer, LiquidGlass, glassProps } from "@workspace/ui/components/liquid-glass"

/* The homepage, built to the Figma "HOME" frame (Themes file, node 94:3232).
 * Sizes, gaps and colours are the frame's own values, not theme tokens. */

const MIGRA = "font-[family-name:Migra]"
// Inter Light stands in for the Figma's "Test Söhne"; Söhne sets about 2.5% narrower, so the tracking is pulled in to keep the same line breaks
const BODY = "font-[family-name:Inter] font-light tracking-[-0.025em]"

// Storybook is built into the site at /storybook/; in dev it is its own server
const STORYBOOK_URL = import.meta.env.DEV ? "http://localhost:6006" : "/storybook/"
const GITHUB_URL = "https://github.com/lukeanill/100d-design-system"
const MONO = "font-[family-name:Geist_Mono,ui-monospace,monospace] font-light"

// the tiles' rim, softer than the system default: they sit on a dark page, where a white rim reads much stronger
const TILE_EDGE = 0.35

const PAD = "px-[clamp(20px,9.375vw,120px)]"

/** A section: 1280 wide, the 1040 column held by 120 of padding either side. */
function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`w-full ${PAD}`}>
      <div className={`mx-auto w-full max-w-[1040px] ${className}`}>{children}</div>
    </section>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-fit items-center justify-center rounded-full px-4 py-2 ring-1 ring-inset ring-white/25">
      <p className={`${BODY} text-[18px] leading-[1.42] whitespace-nowrap`}>{children}</p>
    </div>
  )
}

/** The fixed backdrop: a textured plate under a rotated, blurred glow. Neither is clipped to the 848 frame, so the glow carries on behind the tiles, as in the Figma. */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[848px]">
      <div className="absolute inset-x-0 top-[54px] h-[848px]">
        <div className="absolute inset-0 bg-black" />
        <img
          alt=""
          src="/home/bg-texture.jpg"
          className="absolute inset-0 size-full object-cover mix-blend-exclusion"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent via-50% to-black" />
      </div>
      <div className="absolute left-1/2 top-[-81px] h-[1118.182px] w-[1981.212px] -translate-x-[1116px] mix-blend-screen">
        <div className="absolute left-1/2 top-1/2 h-[1978.853px] w-[1113.986px] -translate-x-1/2 -translate-y-1/2 rotate-[-89.88deg] opacity-75 blur-[100px]">
          <img alt="" src="/home/bg-glow.jpg" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent via-50% to-black" />
        </div>
      </div>
      {/* Figma "blur/1200/md": a 160 background blur (CSS radius is half) under the 24% grey wash */}
      <div className="absolute inset-0 bg-[rgba(30,30,30,0.24)] backdrop-blur-[80px]" />
      {/* measured against the Figma: everything inside the 848 frame sits about 22% darker than the glow that spills out below it */}
      <div className="absolute inset-0 bg-black/[0.22]" />
    </div>
  )
}

function Arrow() {
  return <img alt="" src="/home/arrow-right.svg" className="size-4 shrink-0 transition-[width,height] duration-300 ease-out group-hover:size-[22px] motion-reduce:transition-none" />
}

/**
 * 320 × 380 tile: a 3D object behind a 36px title and a small link.
 * On hover the object softens (a 30px blur, which the Figma draws as a background
 * blur over it; blurring the image itself gives the same look and renders
 * reliably under the blend mode) under a faint dark wash, the
 * outline drops away, and the link grows from 16px to 20px with its arrow from
 * 16px to 22px (the Figma's hover frame).
 */
function LinkTile({
  image,
  title,
  label,
  to,
  href,
  popoverTrigger,
  showArrow = true,
}: {
  image: string
  title: ReactNode
  label: string
  /** an in-app route */
  to?: string
  /** a plain link, for another app on the same site */
  href?: string
  /** makes the tile the trigger of the surrounding <Popover> */
  popoverTrigger?: boolean
  showArrow?: boolean
}) {
  const className =
    "group relative flex h-[380px] w-full max-w-[320px] flex-col justify-end overflow-clip rounded-[16px] p-8 text-left isolate transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:aspect-[320/380] sm:h-auto sm:min-w-0 sm:flex-1 sm:p-4 md:p-6 lg:p-10 motion-reduce:transition-none"
  const content = (
    <>
      {/* the Glass sheet's Soft weight, in the tile's own 16px corner */}
      <GlassLayer weight="soft" radius={16} edge={TILE_EDGE} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-white/[0.02]">
        <img
          alt=""
          src={image}
          className="absolute inset-0 size-full object-cover opacity-40 mix-blend-screen transition-[filter] duration-300 ease-out group-hover:blur-[30px] motion-reduce:transition-none"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[12px] bg-[rgba(30,30,30,0.08)] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none"
      />
      <div className="relative flex w-full flex-col items-start justify-end gap-4 transition-[gap] duration-300 ease-out group-hover:gap-6 motion-reduce:transition-none">
        <p className={`${MIGRA} w-full [overflow-wrap:anywhere] text-[30px] leading-[1.14] font-extralight sm:text-[clamp(18px,2.8125vw,36px)]`}>{title}</p>
        <div className="flex items-center gap-2">
          <p className={`${BODY} text-[16px] leading-[1.42] whitespace-nowrap transition-[font-size] sm:text-[clamp(12px,1.25vw,16px)] duration-300 ease-out group-hover:text-[20px] motion-reduce:transition-none`}>
            {label}
          </p>
          {showArrow && <Arrow />}
        </div>
      </div>
    </>
  )
  if (to)
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  if (href)
    return (
      <a href={href} className={className}>
        {content}
      </a>
    )
  return (
    <PopoverTrigger className={`${className} cursor-pointer`} data-popover-trigger={popoverTrigger || undefined}>
      {content}
    </PopoverTrigger>
  )
}

/** One command in the install panel: Soft dark glass, with the text in the chart green. */
function CodeBox({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate flex w-full items-center rounded-[16px] p-6">
      <GlassLayer weight="soft" tone="dark" radius={16} />
      <code className={`${MONO} relative min-w-0 flex-1 text-[18px] leading-[1.14] break-all text-[#00bc7d]`}>{children}</code>
    </div>
  )
}

/**
 * The install panel the third tile opens (Figma 287:7271): Heavy dark glass that
 * overlaps the second and third tiles, 30px past the row's right edge and 16px
 * above it. It is the design system's Popover, so it comes in with its spring and
 * closes on Escape or a click outside; the row is its anchor. The Popover's own
 * surface is switched off so the glass is the only one, and the panel scales in
 * without fading (the content fades instead) so the refraction is there from the first frame.
 */
function InstallPanel({ anchor }: { anchor: React.RefObject<HTMLElement | null> }) {
  return (
    <PopoverPanel
      anchor={anchor}
      side="bottom"
      align="end"
      sideOffset={({ anchor }) => -(anchor.height + 16)}
      alignOffset={-30}
      initialFocus={false}
      fade={false}
      className="w-[min(571px,calc(100vw-40px))] rounded-[16px] border-0 p-0 shadow-none"
      style={{ "--glass-layer": "none", "--glass-surface": "transparent" } as CSSProperties}
    >
      <LiquidGlass radius={16} {...glassProps("heavy", "dark")} style={{ boxShadow: "0 24px 40px rgba(0, 0, 0, 0.25)" }}>
        <div className="flex animate-in flex-col justify-end gap-6 p-6 duration-300 fade-in-0 sm:p-10">
          <div className="flex w-full flex-col gap-4">
            <p className={`${BODY} text-[18px] leading-[1.42]`}>Install from command line</p>
            <CodeBox>npm install @lukeanill/ui</CodeBox>
            <p className={`${BODY} text-[18px] leading-[1.42]`}>Install via package.json</p>
            <CodeBox>&quot;@lukeanill/ui&quot;</CodeBox>
          </div>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex w-full items-center justify-end gap-2 py-6">
            <span className={`${BODY} text-[16px] leading-[1.42] whitespace-nowrap`}>View on Github</span>
            <img alt="" src="/home/arrow-right.svg" className="size-4 shrink-0" />
          </a>
        </div>
      </LiquidGlass>
    </PopoverPanel>
  )
}

/**
 * Italic words with the Figma's two-layer fill: a 40% magenta-to-cyan wash over
 * solid foreground, clipped to the letters. The angle is the one each Figma
 * text box carries, since it follows the box's shape.
 */
function Wash({ angle, children }: { angle: number; children: ReactNode }) {
  const style: CSSProperties = {
    backgroundImage: `linear-gradient(${angle}deg, rgba(219, 71, 214, 0.4) 21.224%, rgba(27, 175, 212, 0.4) 83.524%), linear-gradient(90deg, rgb(251, 251, 252) 0%, rgb(251, 251, 252) 100%)`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  }
  return (
    <span className={`${MIGRA} font-extralight italic`} style={style}>
      {children}
    </span>
  )
}

const It = ({ children }: { children: ReactNode }) => <em className={`${MIGRA} font-extralight italic`}>{children}</em>

const H48 = `${MIGRA} text-[clamp(32px,3.75vw,48px)] leading-[1.22] font-extralight`
const H36 = `${MIGRA} text-[clamp(26px,2.8125vw,36px)] leading-[1.22] font-extralight`
const BODY20 = `${BODY} text-[20px] leading-[1.42]`

export function Showcase() {
  const [installOpen, setInstallOpen] = useState(false)
  const tilesRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative isolate flex min-h-svh flex-col items-center overflow-x-clip bg-black text-[#fbfbfc]">
      <Backdrop />

      <div className="relative z-10 flex w-full flex-col">
        {/* Hero */}
        <Section className="flex flex-col items-center gap-10 pt-[clamp(128px,15.625vw,200px)] pb-[clamp(64px,9.375vw,120px)]">
          <div className="flex flex-col items-center text-center leading-[1.22]">
            <p className={`${MIGRA} text-[clamp(32px,3.75vw,48px)] font-extralight`}>A themeable</p>
            <p className={`${MIGRA} text-[clamp(40px,4.6875vw,60px)] font-extrabold`}>design system</p>
            <p className={`${MIGRA} text-[clamp(32px,3.75vw,48px)] font-extralight italic`}>on a mission.</p>
          </div>
          <p className={`${BODY} text-center text-[16px] leading-[1.42]`}>
            for AI Product Builders,
            <br />
            by Luke &amp; Claude.
          </p>
        </Section>

        {/* Three link tiles */}
        <Section className="pt-10 pb-20">
          <Popover open={installOpen} onOpenChange={setInstallOpen}>
          <div ref={tilesRef} className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-4 lg:gap-10">
          <LinkTile
            image="/home/tile-blob.png"
            title={
              <>
                House themes
                <br />
                and components
              </>
            }
            label="View storybook"
            href={STORYBOOK_URL}
          />
          <LinkTile image="/home/tile-box.png" title="Your look, feel and principles" label="Build your theme" to="/themes" />
          <LinkTile
            image="/home/tile-star.png"
            title={installOpen ? "npm install @lukeanill/ui@4.3.0" : "Use the system in your AI tool"}
            label="Install package"
            showArrow={!installOpen}
            popoverTrigger
          />
          </div>
          <InstallPanel anchor={tilesRef} />
          </Popover>
        </Section>

        {/* This is */}
        <Section className="flex flex-col items-start gap-8 py-20">
          <Pill>This is</Pill>
          <div className="flex flex-col gap-1">
            <p className={H48}>An experiment of </p>
            <div className="flex flex-wrap items-start gap-x-3">
              <p className={H48}>
                <em className="font-extrabold italic">design</em> with
              </p>
              <p className={`${H48} bg-linear-to-r/srgb from-[#db47d6] to-[#1bafd4] bg-clip-text font-extrabold text-transparent`}>
                AI in its DNA,
              </p>
            </div>
          </div>
        </Section>

        {/* Problem */}
        <Section className="flex flex-col items-start gap-10 pt-20 pb-20">
          <Pill>Problem</Pill>
          <div className="flex w-full flex-col gap-10 min-[1100px]:flex-row min-[1100px]:gap-20">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className={H48}>AI can build a</p>
              <p className={H48}>
                <Wash angle={6.34}>very useful, yet generic</Wash>
              </p>
              <p className={H48}>prototype in minutes.</p>
            </div>
            <div className={`${BODY20} flex w-full flex-col gap-6 opacity-90 min-[1100px]:w-[435px] min-[1100px]:shrink-0`}>
              <p>Moving AI from generic outputs to custom ones takes significant time and effort – chipping away at the time benefit offered.</p>
              <p>
                This explores how effective an AI built design system can be – that’s easily customized, extended, and
                effective in driving cohesive product level decisions.
              </p>
            </div>
          </div>
        </Section>

        {/* Change */}
        <Section className="flex flex-col items-start gap-10 pt-10 pb-20">
          <Pill>Change</Pill>
          <div className="flex w-full flex-col gap-6 min-[1100px]:flex-row min-[1100px]:gap-0">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className={`${H36} flex flex-wrap gap-x-2`}>
                <span>AI can use a</span>
                <Wash angle={14.43}>purpose built</Wash>
                <span>system</span>
              </p>
              <p className={`${H36} flex flex-wrap gap-x-2`}>
                <span>to produce </span>
                <Wash angle={13.44}>highly credible</Wash>
              </p>
              <p className={H36}>prototypes in minutes.</p>
            </div>
            <p className={`${BODY20} w-full min-[1100px]:w-[435px] min-[1100px]:shrink-0`}>
              How? to walk the walk. Building the system and many diverse prototypes with it – Iterating to the point of
              marginal utility.
            </p>
          </div>
        </Section>

        {/* Mission */}
        <Section className="flex flex-col items-start gap-10 pt-20 pb-[clamp(96px,12.5vw,160px)]">
          <Pill>Mission</Pill>
          <div className="flex w-full flex-col gap-10 pb-6 min-[1100px]:flex-row min-[1100px]:gap-20">
            <div className="flex min-w-0 flex-1 flex-col justify-center pb-[6px]">
              <div className={`${H48} [text-box:trim-both_cap_alphabetic]`}>
                <p>
                  Helping <It>product builders</It>
                </p>
                <p>
                  to lead the way with <It>better-designed</It> products.
                </p>
              </div>
            </div>
            <p className={`${BODY20} w-full min-[1100px]:w-[435px] min-[1100px]:shrink-0`}>
              In a new AI world of product, by crafting specialist AI design tools that outperform<br className="max-[1099px]:hidden" /> general AI tools. Read more.
            </p>
          </div>
        </Section>
      </div>
    </div>
  )
}
