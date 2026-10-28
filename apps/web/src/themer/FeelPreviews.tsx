import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"

import { GradientText } from "@workspace/ui/components/animate-ui/primitives/texts/gradient"
import { RollingText } from "@workspace/ui/components/animate-ui/primitives/texts/rolling"
import { ShimmeringText } from "@workspace/ui/components/animate-ui/primitives/texts/shimmering"
import { SplittingText } from "@workspace/ui/components/animate-ui/primitives/texts/splitting"
import { Click } from "@workspace/ui/components/animate-ui/primitives/effects/click"
import { GradientBackground } from "@workspace/ui/components/backgrounds/gradient-background"
import { THEME_BACKGROUND_CONFIGS, type ThemeBackgroundId } from "@workspace/ui/components/backgrounds/theme-background"
import CenterUnderline from "@workspace/ui/components/fancy/text/underline-center"
import UnderlineToBackground from "@workspace/ui/components/fancy/text/underline-to-background"
import ScrambleIn from "@workspace/ui/components/fancy/text/scramble-in"
import Typewriter from "@workspace/ui/components/fancy/text/typewriter"
import VerticalCutReveal from "@workspace/ui/components/fancy/text/vertical-cut-reveal"
import { BlindsTransition } from "@workspace/ui/components/transitions/blinds-transition"
import { CurtainTransition } from "@workspace/ui/components/transitions/curtain-transition"
import { FadeTransition } from "@workspace/ui/components/transitions/fade-transition"
import { IrisTransition } from "@workspace/ui/components/transitions/iris-transition"
import { StepCurtain } from "@workspace/ui/components/transitions/step-curtain"
import { cn } from "@workspace/ui/lib/utils"
import {
  MOTION_STYLES,
  TRANSITION_SPEEDS,
  cubicBezier,
  springEasing,
  themeStyle,
  type Motion,
  type Theme,
  type ThemeFeel,
} from "@workspace/ui/themes"

/**
 * The live pictures beside each Feel section. Each one plays the real design-system component the
 * option names, on the theme being made: the box wears the draft's tokens, so its colours, fonts
 * and the transitions' own colour are the draft's, not the Themer's.
 */

/** The frame every preview sits in: the Figma's 20-radius box with the faint light edge. */
export function PreviewBox({ theme, className, children }: { theme: Theme; className?: string; children: ReactNode }) {
  const style: CSSProperties = {
    ...(themeStyle(theme) as CSSProperties),
    background: "var(--background)",
    color: "var(--foreground)",
    fontFamily: "var(--font-body-token)",
    fontWeight: "var(--font-body-weight)",
  }
  return (
    <div className={cn("relative isolate min-w-0 flex-1 overflow-hidden rounded-[20px] border border-[rgba(246,244,244,0.12)]", className)} style={style}>
      {children}
    </div>
  )
}

/* --- Component Animations: a ball along a line --------------------------------- */

/**
 * The ball runs the length of the line and back, in the chosen motion: ease and emphatic by their
 * curve and time, springy as a spring, none by jumping. Until something is chosen it stays put.
 * Click the box to run it again.
 */
export function MotionPreview({ theme, motion }: { theme: Theme; motion: Motion | undefined }) {
  const track = useRef<HTMLDivElement>(null)
  const [length, setLength] = useState(600)
  const [end, setEnd] = useState(false)
  const [again, setAgain] = useState(0)

  useEffect(() => {
    const el = track.current
    if (!el) return
    const measure = () => setLength(el.clientWidth)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setEnd(false)
    if (!motion) return
    const style = MOTION_STYLES[motion]
    const period = Math.max(style.duration * 1000 + 900, 1200)
    const first = window.setTimeout(() => setEnd(true), 300)
    const loop = window.setInterval(() => setEnd((e) => !e), period)
    return () => {
      window.clearTimeout(first)
      window.clearInterval(loop)
    }
  }, [motion, again])

  const style = motion ? MOTION_STYLES[motion] : undefined
  const timing = !style ? "linear" : style.spring ? springEasing(style.spring, style.duration) : style.curve ? cubicBezier(style.curve) : "linear"
  const moving = style && style.duration > 0

  return (
    <PreviewBox theme={theme} className="min-h-[224px] cursor-pointer max-[1180px]:min-h-[200px]">
      <div className="absolute inset-0" onClick={() => setAgain((n) => n + 1)}>
        <div ref={track} className="absolute top-1/2 right-[119px] left-[117px] border-t border-dashed border-foreground/30" />
        <div className="absolute top-1/2 left-[117px] -mt-8 -ml-8 size-16">
          <div
            className="size-16 rounded-full bg-foreground"
            style={{ transform: `translateX(${end ? length : 0}px)`, transition: moving ? `transform ${style.duration}s ${timing}` : "none" }}
          />
        </div>
      </div>
    </PreviewBox>
  )
}

/* --- Page Transitions: a page that swaps while the transition covers it ---------- */

const TRANSITIONS = {
  blinds: BlindsTransition,
  iris: IrisTransition,
  fade: FadeTransition,
  "curtain-iris": CurtainTransition,
} as const

/**
 * The page is a ball that changes colour on every swap, so the change is seen when the cover opens.
 * The transitions are fixed to the whole window; a transform on the box makes it their containing
 * block, which keeps each one inside it. It plays whenever a choice changes, and on a click.
 */
export function TransitionPreview({ theme, feel, run, onRun }: { theme: Theme; feel: Pick<ThemeFeel, "transition" | "transitionColor" | "transitionSpeed">; run: number; onRun: () => void }) {
  const page = (
    <div className="grid size-full place-items-center">
      <div className={cn("size-16 rounded-full", run % 2 === 0 ? "bg-foreground" : "bg-primary")} />
    </div>
  )
  const color = feel.transitionColor === "primary" ? "var(--primary)" : "var(--foreground)"
  const duration = TRANSITION_SPEEDS[feel.transitionSpeed]
  const key = String(run)
  let content: ReactNode = page
  if (feel.transition === "curtain") {
    content = (
      <StepCurtain transitionKey={key} color={color} duration={duration} className="absolute inset-0">
        {page}
      </StepCurtain>
    )
  } else if (feel.transition !== "none") {
    const Transition = TRANSITIONS[feel.transition]
    content = (
      <Transition transitionKey={key} color={color} duration={duration}>
        {page}
      </Transition>
    )
  }
  return (
    <PreviewBox theme={theme} className="min-h-[391px] cursor-pointer [transform:translateZ(0)] max-[1180px]:min-h-[300px]">
      <div className="absolute inset-0" onClick={onRun}>
        {content}
      </div>
    </PreviewBox>
  )
}

/* --- Animated background --------------------------------------------------------- */

const BACKGROUND_IDS: Record<Exclude<ThemeFeel["animatedBackground"], "none">, ThemeBackgroundId> = {
  aurora: "aurora",
  smoke: "smoke",
  ascii: "ascii",
  holo: "holo",
  eighties: "eighties",
}

export function BackgroundPreview({ theme, feel }: { theme: Theme; feel: ThemeFeel }) {
  const id = feel.animatedBackground === "none" ? undefined : BACKGROUND_IDS[feel.animatedBackground]
  return (
    <PreviewBox theme={theme} className="min-h-[389px] max-[1180px]:min-h-[300px]">
      {id && (
        <GradientBackground
          config={THEME_BACKGROUND_CONFIGS[id]}
          useThemeColors={feel.animatedBackgroundThemeColors}
          inverse={feel.animatedBackgroundInverse}
          scrim={feel.animatedBackgroundOverlay / 100}
          scrimColor={feel.animatedBackgroundInverse ? "var(--foreground)" : "var(--background)"}
        />
      )}
    </PreviewBox>
  )
}

/* --- Hero Section ---------------------------------------------------------------- */

/** Click takes ripple and the rest as two different prop sets; this is one door for both. */
function ClickEffect({ effect, color, scope, children }: { effect: ThemeFeel["buttonClick"]; color: string; scope: React.RefObject<HTMLElement | null>; children: ReactNode }) {
  if (effect === "none") return <>{children}</>
  if (effect === "ripple") {
    return (
      <Click variant="ripple" color={color} scope={scope}>
        {children}
      </Click>
    )
  }
  return (
    <Click variant={effect} color={color} scope={scope}>
      {children}
    </Click>
  )
}

const HEADING = "The quick brown fox"
const PARAGRAPH = "The quick brown fox jumps over the lazy dog. Another quick brown fox followed."

/**
 * A small hero: a heading, a paragraph, a button and a link. Each Feel choice acts on its own part.
 * The text entries play on a pick (`run` changes), the click effect on a click of the button, and
 * the link effect on hover.
 */
export function HeroPreview({ theme, feel, run }: { theme: Theme; feel: ThemeFeel; run: number }) {
  const button = useRef<HTMLButtonElement>(null)
  const p = theme.palette
  const headingStyle: CSSProperties = { fontFamily: "var(--font-primary)", fontWeight: "var(--h5-weight)", fontSize: 36, lineHeight: 1.14 }

  const heading =
    feel.heroHeading === "gradient" ? (
      <GradientText text={HEADING} gradient={`linear-gradient(90deg, ${p.foreground} 0%, ${p.primary} 25%, ${p.foreground} 50%, ${p.primary} 75%, ${p.foreground} 100%)`} />
    ) : feel.heroHeading === "shimmering" ? (
      <ShimmeringText text={HEADING} color="var(--muted-foreground)" shimmeringColor="var(--foreground)" />
    ) : (
      HEADING
    )

  const key = `${feel.heroText}-${run}`
  const paragraph =
    feel.heroText === "rolling" ? (
      <RollingText key={key} text={PARAGRAPH} />
    ) : feel.heroText === "scramble" ? (
      <ScrambleIn key={key} text={PARAGRAPH} autoStart />
    ) : feel.heroText === "typewriter" ? (
      <Typewriter key={key} text={PARAGRAPH} loop={false} showCursor />
    ) : feel.heroText === "splitting" ? (
      <SplittingText key={key} text={PARAGRAPH} type="words" />
    ) : feel.heroText === "vertical-cut" ? (
      <VerticalCutReveal key={key} splitBy="words" staggerDuration={0.05}>
        {PARAGRAPH}
      </VerticalCutReveal>
    ) : (
      PARAGRAPH
    )

  const link =
    feel.linkHover === "underline" ? (
      <CenterUnderline>View more</CenterUnderline>
    ) : feel.linkHover === "highlight" ? (
      <UnderlineToBackground targetTextColor={p.background}>View more</UnderlineToBackground>
    ) : (
      "View more"
    )

  return (
    <PreviewBox theme={theme} className="min-h-[594px] max-[1180px]:min-h-[480px]">
      <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
        <h5 style={headingStyle}>{heading}</h5>
        <div className="mt-2 max-w-[364px] text-lg leading-[1.42]">{paragraph}</div>
        <ClickEffect effect={feel.buttonClick} color={p.primary} scope={button}>
          <button ref={button} type="button" className="mt-10 h-12 cursor-pointer rounded-lg border-2 border-foreground px-6 text-base leading-[1.42] font-bold">
            View more
          </button>
        </ClickEffect>
        <span className="mt-6 text-base leading-[1.42] font-bold">{link}</span>
      </div>
    </PreviewBox>
  )
}
