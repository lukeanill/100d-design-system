import { useState, type CSSProperties, type ReactNode } from "react"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@workspace/ui/components/drawer"
import { CopyButton } from "@workspace/ui/components/animate-ui/components/buttons/copy"
import { BODY, LinkTile, MIGRA } from "./LinkTile"
import { Pill } from "./Pill"
import { Preview } from "./Preview"

/* The homepage, built to the Figma "HOME" frame (Themes file, node 94:3232).
 * Sizes, gaps and colours are the frame's own values, not theme tokens. */

// Storybook is built into the site at /storybook/; in dev it is its own server
const STORYBOOK_URL = import.meta.env.DEV ? "http://localhost:6006" : "/storybook/"
const GITHUB_URL = "https://github.com/lukeanill/100d-design-system"

const PAD = "px-[clamp(20px,9.375vw,120px)]"

/** A section: 1280 wide, the 1040 column held by 120 of padding either side. */
function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`w-full ${PAD}`}>
      <div className={`mx-auto w-full max-w-[1040px] ${className}`}>{children}</div>
    </section>
  )
}

/** The page's footer (Figma "section", node 425:4324): who made it, with the name linking to Luke's site. */
function Footer() {
  return (
    <footer className={`w-full ${PAD}`}>
      <div className="mx-auto flex w-full max-w-[1040px] items-center justify-center pt-[clamp(48px,6.25vw,80px)] pb-[clamp(96px,12.5vw,160px)]">
        <p className="text-lg flex items-center gap-1 whitespace-nowrap text-primary">
          <span>made by</span>
          <a
            href="https://luke.lukeai.space"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg-bold flex items-center gap-1 rounded-sm outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span className="relative size-[22px] shrink-0 rounded-full border border-primary">
              <img alt="" src="/home/luke.png" className="absolute inset-0 size-full rounded-full object-cover" />
            </span>
            Luke
          </a>
          <span>and</span>
          <span className="text-lg-bold flex items-center gap-0.5">
            <img alt="" src="/home/claude.svg" className="size-6" />
            Claude
          </span>
        </p>
      </div>
    </footer>
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

/** What someone pastes into Claude (or another AI tool) to get started: Claude installs the package and the skill, and the skill takes over. */
const START_PROMPT =
  "Set up the design system from https://ds.lukeai.space in this project: install @lukeanill/ui, run npx @lukeanill/ui install-skill, then use the design-system skill to get me started. If anything needs a login, walk me through it step by step."

/** The prompt in the install panel: a solid dark fill (alpha/dark/lg), the text in the theme's body face, and the design system's CopyButton. */
function PromptBox({ children }: { children: string }) {
  return (
    <div className="relative isolate flex w-full flex-col gap-4 rounded-[16px] bg-(--alpha-dark-lg) p-6">
      <p className={`${BODY} text-[16px] leading-[1.5]`}>{children}</p>
      <CopyButton content={children} variant="secondary" className="self-end" aria-label="Copy the prompt" />
    </div>
  )
}

/**
 * The install panel the third tile opens, in the design system's Drawer: it rises from the bottom
 * with its own glass, handle and overlay, and closes on Escape, a click outside or a drag down.
 */
function InstallDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent overlayClassName="bg-(--alpha-dark-md)" className="data-[vaul-drawer-direction=bottom]:border-t-0">
        <div className="mx-auto flex w-full max-w-[571px] flex-col gap-6 px-6 pb-10 sm:px-10">
          <DrawerHeader className="px-0">
            <DrawerTitle>Use the system in your AI tool</DrawerTitle>
            <DrawerDescription className="sr-only">Copy the prompt and paste it into Claude. It installs the design system and gets you started.</DrawerDescription>
          </DrawerHeader>
          <div className="flex w-full flex-col gap-4">
            <p className={`${BODY} text-[18px] leading-[1.42]`}>Paste this into Claude</p>
            <PromptBox>{START_PROMPT}</PromptBox>
          </div>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="flex w-full items-center justify-end gap-2 py-2">
            <span className={`${BODY} text-[16px] leading-[1.42] whitespace-nowrap`}>View on Github</span>
            <img alt="" src="/home/arrow-right.svg" className="size-4 shrink-0" />
          </a>
        </div>
      </DrawerContent>
    </Drawer>
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
const H28 = `${MIGRA} text-[clamp(22px,2.1875vw,28px)] leading-[1.22] font-extralight`
const BODY_LG = `${BODY} text-lg leading-[1.42]`

export function Showcase() {
  const [installOpen, setInstallOpen] = useState(false)

  return (
    <div className="relative isolate flex min-h-svh flex-col items-center overflow-x-clip bg-black text-[#fbfbfc]">
      <Backdrop />

      <div className="relative z-10 flex w-full flex-col gap-[clamp(40px,6.25vw,80px)]">
        {/* Hero */}
        <Section className="flex flex-col items-center gap-10 pt-[clamp(96px,12.5vw,160px)]">
          {/* Figma 436:8485: 36 / 60 / 48 on a 1.4 line, each line pulled 6px into the next; "design system" carries a double space */}
          <div className="flex flex-col items-center text-center leading-[1.4]">
            <p className="text-h4-pri mb-[-6px]">A themeable AI</p>
            <p className="text-h2-pri-bold mb-[-6px] whitespace-pre">{"design  system"}</p>
            <p className="text-h3-sec">on a mission.</p>
          </div>
          {/* Figma 436:8489: the line, then who made it, with Luke's photo and the Claude mark */}
          <div className={`${BODY} flex flex-col items-center leading-[1.6]`}>
            <p className="text-md opacity-75">for AI Product Builders,</p>
            <p className="text-lg flex items-center gap-1 whitespace-nowrap">
              <span className="opacity-75">by</span>
              <span className="flex items-center gap-1">
                <span className="relative size-5 shrink-0 rounded-full border-[0.909px] border-primary">
                  <img alt="" src="/home/luke.png" className="absolute inset-0 size-full rounded-full object-cover" />
                </span>
                <span className="text-md text-primary">Luke</span>
              </span>
              <span className="opacity-75">and</span>
              <span className="flex items-center gap-0.5">
                <img alt="" src="/home/claude.svg" className="size-[22px]" />
                <span className="text-secondary-foreground">Claude</span>
              </span>
            </p>
          </div>
        </Section>

        {/* Three link tiles */}
        <Section className="pt-10 pb-[clamp(40px,6.25vw,80px)]">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-4 lg:gap-10">
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
            title="Use the system in your AI tool"
            label="Install package"
            onClick={() => setInstallOpen(true)}
          />
          </div>
          <InstallDrawer open={installOpen} onOpenChange={setInstallOpen} />
        </Section>

        {/* Preview */}
        <Section className="flex flex-col items-start gap-10 pt-[clamp(12px,1.875vw,24px)] pb-[clamp(40px,6.25vw,80px)]">
          <Preview />
        </Section>

        {/* This is */}
        <Section className="flex flex-col items-start gap-8">
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
        <Section className="flex flex-col items-start gap-10 pt-[clamp(12px,1.875vw,24px)]">
          <Pill>Problem</Pill>
          <div className="flex w-full flex-col gap-10 min-[1100px]:flex-row min-[1100px]:gap-20">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className={H36}>AI can build a</p>
              <p className={H36}>
                <Wash angle={4.74}>very useful, yet generic</Wash>
              </p>
              <p className={H36}>prototype in minutes.</p>
            </div>
            <div className={`${BODY_LG} flex w-full flex-col gap-6 opacity-90 min-[1100px]:w-[435px] min-[1100px]:shrink-0`}>
              <p>Moving AI from generic outputs to custom ones takes significant time and effort – chipping away at the time benefit offered.</p>
              <p>
                This explores how effective an AI built design system can be – that’s easily customized, extended, and
                effective in driving cohesive product level decisions.
              </p>
            </div>
          </div>
        </Section>

        {/* Change */}
        <Section className="flex flex-col items-start gap-10 pt-[clamp(12px,1.875vw,24px)]">
          <Pill>Change</Pill>
          <div className="flex w-full flex-col gap-6 min-[1100px]:flex-row min-[1100px]:gap-0">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className={`${H28} flex flex-wrap gap-x-2`}>
                <span>AI can use a</span>
                <Wash angle={14.28}>purpose built</Wash>
                <span>system</span>
              </p>
              <p className={`${H28} flex flex-wrap gap-x-2`}>
                <span>to produce </span>
                <Wash angle={13.31}>highly credible</Wash>
              </p>
              <p className={H28}>prototypes in minutes.</p>
            </div>
            <p className={`${BODY_LG} w-full min-[1100px]:w-[435px] min-[1100px]:shrink-0`}>
              How? to walk the walk. Building the system and many diverse prototypes with it – Iterating to the point of
              marginal utility.
            </p>
          </div>
        </Section>

        {/* Mission */}
        <Section className="flex flex-col items-start gap-10 pt-[clamp(20px,3.125vw,40px)] pb-[clamp(96px,12.5vw,160px)]">
          <Pill>Mission</Pill>
          <div className="flex w-full flex-col gap-10 pb-6 min-[1100px]:flex-row min-[1100px]:gap-20">
            <div className="flex min-w-0 flex-1 flex-col justify-center pb-[6px]">
              <div className={`${H36} [text-box:trim-both_cap_alphabetic]`}>
                <p>
                  Helping <It>product builders</It>
                </p>
                <p>
                  to lead the way with <It>better-designed</It> products.
                </p>
              </div>
            </div>
            <p className={`${BODY_LG} w-full min-[1100px]:w-[435px] min-[1100px]:shrink-0`}>
              In a new AI world of product, by crafting specialist AI design tools that outperform<br className="max-[1099px]:hidden" /> general AI tools. Read more.
            </p>
          </div>
        </Section>

        <Footer />
      </div>
    </div>
  )
}
