import { useEffect, useRef } from "react"
import type { ReactNode } from "react"

/* The homepage, built to the Figma "HOME" frame (Themes file, node 94:3232).
 * Sizes, gaps and colours are the frame's own values, not theme tokens. */

const MIGRA = "font-[family-name:Migra]"
// Inter Light stands in for the Figma's "Test Söhne"; Söhne sets about 2.5% narrower, so the tracking is pulled in to keep the same line breaks
const BODY = "font-[family-name:Inter] font-light tracking-[-0.025em]"

/** A section: 1280 wide, the 1040 column held by 120 of padding either side. */
function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`w-full px-[clamp(20px,9.375vw,120px)]`}>
      <div className={`mx-auto w-full max-w-[1040px] ${className}`}>{children}</div>
    </section>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-fit items-center justify-center rounded-full px-2 py-1 ring-1 ring-inset ring-white/25">
      <p className={`${BODY} text-[20px] leading-[1.42] whitespace-nowrap`}>{children}</p>
    </div>
  )
}

/** The fixed backdrop: a textured plate under a rotated, blurred glow. */
function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[848px] overflow-hidden opacity-[0.78]">
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
    </div>
  )
}

function Arrow() {
  return <img alt="" src="/home/arrow-right.svg" className="size-4 shrink-0" />
}

/** 320 × 380 tile: a 3D object behind a 36px title and a small link. */
function LinkTile({ image, title, label }: { image: string; title: ReactNode; label: string }) {
  return (
    <div className="relative flex h-[380px] w-full max-w-[320px] flex-col justify-end overflow-clip rounded-[16px] border border-white/15 p-8 backdrop-blur-[12px] sm:p-10 lg:min-w-0 lg:flex-1">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-white/[0.02]">
        <img alt="" src={image} className="absolute inset-0 size-full object-cover opacity-20 mix-blend-screen" />
      </div>
      <div className="relative flex w-full flex-col items-start justify-end gap-4">
        <p className={`${MIGRA} w-full text-[clamp(30px,2.8125vw,36px)] leading-[1.14] font-extralight`}>{title}</p>
        <div className="flex items-center gap-2">
          <p className={`${BODY} text-[16px] leading-[1.42] whitespace-nowrap`}>{label}</p>
          <Arrow />
        </div>
      </div>
    </div>
  )
}

function StatementTile({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex h-[380px] w-full min-w-px flex-1 flex-col justify-end overflow-clip rounded-[16px] p-8 sm:p-10 ${className}`}>
      <p className={`${MIGRA} w-full text-[28px] leading-[1.14] font-extralight`}>{children}</p>
    </div>
  )
}

function InfoCard({
  title,
  children,
  small,
  pad = 20,
}: {
  title: ReactNode
  children: ReactNode
  small?: boolean
  pad?: 20 | 24
}) {
  return (
    <div
      className={`flex h-[200px] w-full shrink-0 flex-col gap-2 sm:w-[228px] overflow-clip border border-white/15 bg-black/40 backdrop-blur-[12px] ${pad === 24 ? "p-6" : "p-5"}`}
    >
      <p className={`${MIGRA} text-[28px] leading-[1.14] font-extralight`}>{title}</p>
      <p className={`${BODY} ${small ? "text-[14px] tracking-[-0.05em]" : "text-[16px]"} leading-[1.42]`}>{children}</p>
    </div>
  )
}

/** Italic accent used inside Migra headings. Only Extralight Italic is bundled. */
const It = ({ children }: { children: ReactNode }) => (
  <em className={`${MIGRA} font-extralight italic`}>{children}</em>
)

/** The info cards: scroll slowly down and back, stopping while the pointer is over them. Scrolling by hand still works. */
function CardScroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const SPEED = 18 // px per second
    const HOLD = 1500 // ms at each end
    let raf = 0
    let last = 0
    let pos = el.scrollTop
    let dir = 1
    let hold = 0
    let hovering = false
    const enter = () => (hovering = true)
    const leave = () => {
      hovering = false
      pos = el.scrollTop
    }
    const tick = (t: number) => {
      const dt = last ? Math.min(t - last, 64) : 0
      last = t
      if (!hovering) {
        if (Math.abs(el.scrollTop - pos) > 2) pos = el.scrollTop // moved by hand
        const max = el.scrollHeight - el.clientHeight
        if (hold > 0) hold -= dt
        else {
          pos += (dir * SPEED * dt) / 1000
          if (pos >= max) [pos, dir, hold] = [max, -1, HOLD]
          else if (pos <= 0) [pos, dir, hold] = [0, 1, HOLD]
          el.scrollTop = pos
        }
      }
      raf = requestAnimationFrame(tick)
    }
    el.addEventListener("pointerenter", enter)
    el.addEventListener("pointerleave", leave)
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener("pointerenter", enter)
      el.removeEventListener("pointerleave", leave)
    }
  }, [])
  return (
    <div
      ref={ref}
      className="relative grid h-[440px] w-full shrink-0 grid-cols-1 content-start justify-center gap-4 overflow-y-auto px-6 pt-2 pb-11 [scrollbar-width:none] sm:grid-cols-[228px_228px] min-[1100px]:h-[494px] min-[1100px]:w-[473px] min-[1100px]:self-start min-[1100px]:px-0 min-[1100px]:pt-[39px] min-[1280px]:mr-20 min-[1100px]:mr-10 [&::-webkit-scrollbar]:hidden"
    >
      {children}
    </div>
  )
}

/** A word marked with a translucent colour block. */
function Mark({ color, children, italic }: { color: string; children: ReactNode; italic?: boolean }) {
  return (
    <span
      className={`${MIGRA} flex items-center justify-center px-2 py-1 text-[28px] leading-[1.14] font-extralight whitespace-nowrap ${italic ? "italic" : ""}`}
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  )
}

const CYAN = "rgba(104,223,241,0.5)"
const PINK = "rgba(219,71,214,0.5)"
const PURPLE = "rgba(143,57,255,0.4)"
const GREEN = "rgba(135,226,116,0.5)"

const Plain = ({ children, italic }: { children: ReactNode; italic?: boolean }) => (
  <p className={`${MIGRA} text-[28px] leading-[1.14] font-extralight whitespace-nowrap ${italic ? "italic" : ""}`}>
    {children}
  </p>
)

const INTAN = "font-[family-name:Intan] text-[36px] leading-[1.14] tracking-[1.44px] text-[#f7cae7] opacity-[0.86]"
const SCRIPT = "font-[family-name:'Batang_Tebo'] text-[32px] leading-[1.42]"

/** A word placed by its centre, as the Figma's 352 × 93 slogan frames are drawn. */
function At({ x, top, className = "", children }: { x: number; top: number; className?: string; children: ReactNode }) {
  return (
    <p className={`absolute -translate-x-1/2 text-center whitespace-nowrap ${className}`} style={{ left: x, top }}>
      {children}
    </p>
  )
}

function Slogan({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="relative h-[93px] w-[352px] shrink-0">
      <At x={336.5} top={8} className="font-[family-name:'Batang_Tebo'] text-[26px] leading-[1.42]">
        {n}
      </At>
      {children}
    </div>
  )
}

const WALL = {
  script: "#fbfbfc",
  rowA: "#7b34d3",
  rowB: ["#9d3a9d", "#388a98"],
}

/** Rows of "Make it" and "SIMPLE": a script cell then purple on one row, pink then teal on the next. SIMPLE is stretched 20% because the Figma sets it in a wide cut that Inter lacks. */
function Wall() {
  return (
    <div className="relative h-[201px] w-full max-w-[988px] shrink-0 overflow-clip">
      <div className="font-[family-name:Inter] text-[20px] leading-[23.3px] font-bold whitespace-nowrap uppercase">
        {Array.from({ length: 9 }, (_, row) => (
          <div key={row} className="flex">
            {Array.from({ length: 11 }, (_, col) => {
              const script = row % 2 === 0 && col % 2 === 0
              return (
                <span
                  key={col}
                  className={`w-[91.3px] shrink-0 ${script ? "pl-[17px] font-[family-name:'Batang_Tebo'] text-[18px] font-normal normal-case" : "pl-1"}`}
                  style={{ color: row % 2 === 0 ? (col % 2 === 0 ? WALL.script : WALL.rowA) : WALL.rowB[col % 2] }}
                >
                  {script ? "Make it" : <span className="inline-block origin-left scale-x-[1.2]">SIMPLE</span>}
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Showcase() {
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
          <p className={`${BODY} text-center text-[16px] leading-[1.42] text-balance`}>
            for AI natives building products, by Luke &amp; Claude.
          </p>
        </Section>

        {/* Three link tiles */}
        <Section className="flex flex-col items-center gap-6 pt-10 pb-20 lg:flex-row lg:items-start lg:justify-center lg:gap-10">
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
          />
          <LinkTile image="/home/tile-box.png" title="Your look, feel and principles" label="Build your theme" />
          <LinkTile image="/home/tile-star.png" title="Use the system in your AI tool" label="Install package" />
        </Section>

        {/* The Test */}
        <Section className="flex flex-col items-start gap-6 pt-10 pb-[clamp(64px,9.375vw,120px)]">
          <Pill>Showcase</Pill>
          <div className="flex w-full flex-col items-start gap-6 md:flex-row md:gap-10">
            <StatementTile className="bg-[#1e1e1e] ring-1 ring-white/15 ring-inset">
              Parcel level slope analysis across the USA, in real time
            </StatementTile>
            <StatementTile className="bg-[#fffbfb] text-[#121212]">
              Peek into your soul and your friends future.
            </StatementTile>
          </div>
        </Section>

        {/* An experiment */}
        <Section className="flex flex-col items-start pt-10 pb-20">
          <div className="flex flex-col gap-4">
            <Pill>This is</Pill>
            <div className="flex flex-col gap-1">
              <p className={`${MIGRA} text-[clamp(32px,3.75vw,48px)] leading-[1.22] font-extralight`}>An experiment of </p>
              <div className="flex flex-wrap items-start gap-x-3">
                <p className={`${MIGRA} text-[clamp(32px,3.75vw,48px)] leading-[1.22] font-extralight`}>
                  <em className="font-extrabold italic">design</em> with
                </p>
                <p className={`${MIGRA} bg-linear-to-r/srgb from-[#db47d6] to-[#1bafd4] bg-clip-text text-[clamp(32px,3.75vw,48px)] leading-[1.22] font-extrabold text-transparent`}>
                  AI in its DNA,
                </p>
              </div>
            </div>
          </div>
        </Section>

        {/* The big tile */}
        <section className="w-full px-[clamp(20px,9.375vw,120px)] pb-20">
          <div className="relative mx-auto flex w-full max-w-[1040px] flex-col overflow-clip rounded-[16px] border border-white/15 backdrop-blur-[12px] min-[1100px]:h-[496px] min-[1100px]:flex-row">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-white/[0.02]">
              <img alt="" src="/home/tile-blob.png" className="absolute inset-0 size-full object-cover opacity-20 mix-blend-screen" />
            </div>
            <div className="relative flex min-w-0 flex-1 flex-col gap-10 p-6 sm:p-10">
              <Pill>The Test</Pill>
              <div className="flex flex-col gap-10">
                <p className={`${MIGRA} text-[clamp(28px,2.8125vw,36px)] leading-[1.14] font-extralight`}>
                  To build 100 product
                  <br />
                  prototypes <It>with AI</It>
                </p>
                <p className={`${MIGRA} text-[clamp(28px,2.8125vw,36px)] leading-[1.14] font-extralight`}>
                  Powered by one design
                  <br />
                  system developed <It>with AI</It>
                </p>
              </div>
            </div>
            {/* the scroller runs the full height of the tile so cards slide right up to its edge; the Figma's 24px spacer + 16px gap is the top padding */}
            <CardScroller>
              <InfoCard title="Poduct UX decisions.">Credible products from observed opportunities.</InfoCard>
              <InfoCard title="Design system usage">Posing radically diverse challenges in nature.</InfoCard>
              <InfoCard
                small
                title={
                  <>
                    Theme usage
                    <br />
                    &amp; uniqueness
                  </>
                }
              >
                Test howe unique a UI feels in comparison. Plus large scale token change is managed.
              </InfoCard>
              <InfoCard small title="Delivering wild changes">
                In founder mode XXL- serious amount of varied change, with varied forms and quality input.
              </InfoCard>
              <InfoCard title="Extend the design system">
                Add, adjust and remove many tokens, components and patterns.
              </InfoCard>
              <InfoCard title="Big fundamental changes.">
                How do core changes rollout like changing the way theming works.{" "}
              </InfoCard>
              <InfoCard
                pad={24}
                title={
                  <>
                    Versioning and
                    <br />
                    product updates
                  </>
                }
              >
                How easy and cohesive is rolling out change
              </InfoCard>
              <InfoCard
                pad={24}
                title={
                  <span className="text-[30px]">
                    Get the basics
                    <br />
                    ideas right
                  </span>
                }
              >
                Apply resolute design principles and patterns,
              </InfoCard>
            </CardScroller>
          </div>
        </section>

        {/* The mission, define, mantra */}
        <Section className="flex flex-col items-start gap-20 pb-24 md:gap-[120px] md:pb-40">
          <div className="flex w-full max-w-[988px] flex-col gap-10 pt-10">
            <Pill>The mission</Pill>
            <div className="flex w-full flex-col gap-10 md:h-[241px] md:flex-row md:items-center md:gap-20">
              <div className={`${BODY} flex min-w-px flex-1 flex-col gap-4 text-[20px] leading-[1.42] md:h-full`}>
                <p>To help AI native product builders to stay ahead, with better designed products.</p>
                <p>
                  In a future that anticipates waves of new AI built product. Many of a good design standard– that gets
                  the job done.{" "}
                </p>
                <p className="w-full max-w-[454px]">
                  Competition that all move faster. Some leaner, smarter, or bolder. In the shadows with fancy tech,
                </p>
              </div>
              <div className="flex min-w-px flex-1 flex-col gap-6 md:h-full">
                <p className={`${BODY} text-[20px] leading-[1.42]`}>
                  Where the same AI gives us power– and a guarantee of time. We play to win! with standout products and
                  pride.
                </p>
                <div className="flex w-full origin-right flex-col items-end justify-center pt-10 max-sm:[&>div]:origin-right max-sm:[&>div]:scale-90">
                  <Slogan n="#1">
                    <At x={34.5} top={45} className={SCRIPT}>
                      Play to
                    </At>
                    <At x={119.5} top={52} className={INTAN}>
                      Win
                    </At>
                    <At x={195.5} top={45} className={SCRIPT}>
                      with
                    </At>
                    <At x={293} top={52} className={INTAN}>
                      PRIDE
                    </At>
                  </Slogan>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full max-w-[988px] flex-col gap-5 border border-white/[0.12] p-6 md:p-20">
            <div className="flex flex-col gap-4">
              <div className="flex min-h-[49px] w-fit flex-wrap items-center justify-center gap-2">
                <Mark color={CYAN}>Product</Mark>
                <Plain>is the</Plain>
                <Mark color={PINK}>means</Mark>
                <Plain italic> to a</Plain>
                <Mark color={PURPLE} italic>
                  motivation
                </Mark>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:pl-10">
                <Mark color={CYAN}>Design</Mark>
                <Mark color={PINK} italic>
                  renders
                </Mark>
                <Plain>intent, to </Plain>
                <Mark color={GREEN} italic>
                  influence
                </Mark>
                <Mark color={PURPLE}>behavior</Mark>
              </div>
              <div className="flex w-full flex-wrap items-center gap-2 md:px-16">
                <Plain>Great design becomes</Plain>
                <Plain>a</Plain>
                <Mark color={PURPLE} italic>
                  motivation
                </Mark>
                <Plain> ... and great things follow.</Plain>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-10 pb-10">
            <Pill>The mantra</Pill>
            <div className="flex w-full flex-col gap-6">
              <Wall />
              {/* the Figma row is 664 + 160 + 352 wide, wider than the column, and its left end is clipped; here the slogan sits on the right edge of the column instead */}
              <div className="relative flex w-full max-w-[988px] flex-col gap-8 pt-20 pb-10">
                <div className="flex w-full max-w-[664px] flex-col gap-4">
                  <p className={`${BODY} w-full text-[16px] leading-[1.42]`}>
                    The point isn’t to be clever, or lecture. It’s an argument that...
                  </p>
                  <p className={`${MIGRA} w-full max-w-[653px] text-[clamp(28px,2.8125vw,36px)] leading-[1.14] font-extralight`}>
                    The <It>simple principles matter</It> more than ever.
                  </p>
                  <div className={`${BODY} w-full max-w-[499px] text-[18px] leading-[1.42]`}>
                    <p>People are complex. People make things complicated. </p>
                    <p>
                      The hallmarks of great design are the habits that understand people deeply, grow judgement and
                      scale great decisions.{" "}
                    </p>
                  </div>
                </div>
                <div className="self-end origin-right max-sm:scale-90 min-[1100px]:absolute min-[1100px]:right-0 min-[1100px]:bottom-10">
                  <Slogan n="#2">
                    <At x={73} top={52} className={INTAN}>
                      MAKE
                    </At>
                    <At x={160} top={45} className={SCRIPT}>
                      dont
                    </At>
                    <At x={274.5} top={52} className={INTAN}>
                      DEBATE
                    </At>
                  </Slogan>
                </div>
              </div>
            </div>
          </div>

          <div className="h-[120px] w-full max-w-[988px] md:h-[345px]" />
        </Section>
      </div>
    </div>
  )
}
