import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { ArrowFatRightIcon, SparkleIcon } from "@phosphor-icons/react"

import { cn } from "@workspace/ui/lib/utils"
import { Button } from "@workspace/ui/components/button"
import { Slider } from "@workspace/ui/components/slider"
import { TaskRows } from "@workspace/ui/components/ai/task-rows"
import { CurtainTransition } from "@workspace/ui/components/transitions/curtain-transition"
import { Blur } from "@workspace/ui/components/animate-ui/primitives/effects/blur"
import { GradientText } from "@workspace/ui/components/animate-ui/primitives/texts/gradient"
import {
  RotatingText,
  RotatingTextContainer,
} from "@workspace/ui/components/animate-ui/primitives/texts/rotating"
import { SlidingNumber } from "@workspace/ui/components/animate-ui/primitives/texts/sliding-number"
import ScrambleIn from "@workspace/ui/components/fancy/text/scramble-in"
import UnderlineToBackground from "@workspace/ui/components/fancy/text/underline-to-background"
import { SplitToEdit } from "@workspace/ui/components/watermelon/split-to-edit"

import {
  ACTIVITIES,
  DEFAULT_MISSION,
  missionContent,
  type Mission,
} from "./content"
import { PreviewMenus } from "./Menus"
import {
  Analysis,
  Ask,
  CheckIn,
  Faqs,
  PracticeList,
  Performance,
  Shop,
} from "./pieces"
import { DEFAULT_STYLING, themeScope, type Styling } from "./styling"

/** Below this the section is not shown at all, and nothing in it is mounted. */
const MIN_WIDTH = "(min-width: 1000px)"

/** The stage is taller than the Figma draws it, so full-size components have room; content sits this much lower to stay centred. */
const STAGE_H = 720
const DY = (STAGE_H - 600) / 2

/** The curtain covers the stage for this long before the content underneath swaps. */
const COVER_MS = 700
/** How long the AI is shown working: "show loading for 5 secs". */
const LOADING_MS = 5000

/** What the AI says it is doing, one after another, as the loading runs. */
const STAGES = [
  "Crafting the story",
  "Generating content",
  "Choosing components",
]

type Phase = "idle" | "loading" | "ready"

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia(MIN_WIDTH).matches)
  useEffect(() => {
    const query = window.matchMedia(MIN_WIDTH)
    const update = () => setWide(query.matches)
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  return wide
}

/**
 * Display type: the theme's own heading style (its H3 face and weight),
 * capitalised, so choosing a theme changes the words as well as the colours.
 * The pieces flow with a gap rather than sitting at fixed positions, so a
 * wider face just makes a column wider.
 */
const HEADING_FONT =
  "font-[family-name:var(--h3-family,var(--font-heading))] [font-weight:var(--h3-weight,400)]"
const DISPLAY = `${HEADING_FONT} uppercase leading-none whitespace-nowrap text-foreground`

/** Places something on the stage at the Figma's own coordinates. */
function At({
  x,
  y,
  className,
  children,
}: {
  x: number
  y: number
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("absolute", className)} style={{ left: x, top: y + DY }}>
      {children}
    </div>
  )
}

/** One piece of the final strip, fading in out of a blur as it scrolls into view. */
function Reveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Blur inView inViewMargin="-40px" className={className}>
      {children}
    </Blur>
  )
}

function Sentence({
  mission,
  onChange,
  onStart,
}: {
  mission: Mission
  onChange: (next: Partial<Mission>) => void
  onStart: () => void
}) {
  const row = "flex h-[86px] items-center"
  return (
    <div
      className="absolute left-[100px] flex flex-col"
      style={{ top: 96 + DY }}
    >
      <div className={cn(row, "gap-9")}>
        <span className={cn(DISPLAY, "text-[72px]")}>I will</span>
        <div
          className="flex items-center gap-1"
          role="radiogroup"
          aria-label="Activity"
        >
          {ACTIVITIES.map((a) => (
            <button
              key={a.id}
              type="button"
              role="radio"
              aria-checked={mission.activity === a.id}
              onClick={() => onChange({ activity: a.id })}
              className={cn(
                "h-9 cursor-pointer rounded-full border border-primary px-[13px] text-[16px] leading-none font-medium transition-colors",
                mission.activity === a.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-primary/5"
              )}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className={cn(row, "gap-2.5")}>
        {/* a fixed box: the slider fills whatever it is given, so left to the row it
            would stretch to the widest line, and the km figure would move whenever
            the time picker below opens and gets wider */}
        <div className="w-[219px] shrink-0">
          <Slider
            value={[mission.km]}
            min={0}
            max={99}
            step={1}
            onValueChange={(value) =>
              onChange({ km: Array.isArray(value) ? value[0] : value })
            }
            className="w-full"
            aria-label="Distance in kilometres"
          />
        </div>
        <span className={cn(DISPLAY, "flex items-baseline gap-3 text-[72px]")}>
          <SlidingNumber number={mission.km} padStart />
          km
        </span>
      </div>

      <div className={cn(row, "gap-8")}>
        <span className={cn(DISPLAY, "text-[72px]")}>In under</span>
        <SplitToEdit
          hours={mission.hours}
          minutes={mission.minutes}
          maxHours={23}
          onSave={(hours, minutes) => onChange({ hours, minutes })}
        />
      </div>

      <Button className="mt-8 h-10 w-fit rounded-full px-5" onClick={onStart}>
        Set your mission
      </Button>
    </div>
  )
}

/** The recap line, set small, that stays with the story once the sentence has been used. */
function Recap({ lines, scramble }: { lines: string[]; scramble?: boolean }) {
  return (
    <div
      className={cn(DISPLAY, "flex flex-col gap-1 text-[34px] leading-[38px]")}
    >
      {lines.map((line) =>
        scramble ? (
          <ScrambleIn
            key={line}
            text={line.toUpperCase()}
            autoStart
            scrambledLetterCount={4}
          />
        ) : (
          <span key={line}>{line}</span>
        )
      )}
    </div>
  )
}

function Loading({
  mission,
  done,
  rows,
}: {
  mission: Mission
  done: number
  rows: ReturnType<typeof missionContent>["tasks"]
}) {
  const content = useMemo(() => missionContent(mission), [mission])
  const shown = rows.slice(0, Math.min(3, done + 1)).map((task, i) => ({
    ...task,
    status: i < done ? ("done" as const) : ("running" as const),
    step: i + 1,
  }))
  return (
    <>
      <At x={100} y={105}>
        <Recap lines={content.recap} scramble />
      </At>
      <At x={100} y={240} className="w-[440px]">
        <TaskRows appearance={{ variant: "Capsules" }} data={{ rows: shown }} />
      </At>
      <At x={620} y={122} className="flex items-center gap-2">
        <SparkleIcon weight="fill" size={52} className="text-[#7c5cff]" />
        <GradientText
          text="AI"
          className={cn(HEADING_FONT, "text-[92px] leading-none")}
        />
      </At>
      <At x={620} y={232} className="w-[600px]">
        {/* the Rotating text effect, moved on as each task completes so the words keep pace with the work */}
        <RotatingTextContainer
          text={STAGES[Math.min(done, STAGES.length - 1)]}
          y={-60}
          className={cn(
            DISPLAY,
            "text-[104px] leading-[118px] whitespace-normal"
          )}
        >
          <RotatingText />
        </RotatingTextContainer>
      </At>
    </>
  )
}

/** A column of the strip: pieces stacked from the top, at the height the Figma starts them. */
function Column({
  top,
  className,
  children,
}: {
  top: number
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn("flex shrink-0 flex-col", className)}
      style={{ paddingTop: top + DY }}
    >
      {children}
    </div>
  )
}

/**
 * The final strip. Every component is at its own size, so the columns flow
 * left to right with a gap rather than sitting at fixed positions.
 */
function Strip({ mission }: { mission: Mission }) {
  const content = useMemo(() => missionContent(mission), [mission])
  // leading-none comes last: tailwind-merge drops an earlier one when a font size follows it
  const heading = cn(DISPLAY, "text-[70px] leading-none")
  return (
    <div className="flex h-full w-max items-start gap-[90px] pr-[200px] pl-[100px]">
      <Column top={109}>
        <Reveal className={heading}>How</Reveal>
        <Reveal className="mt-px">
          <Recap lines={content.recap} />
        </Reveal>
        <Reveal className="mt-[33px]">
          <PracticeList content={content} />
        </Reveal>
      </Column>

      <Column top={109}>
        <Reveal className={heading}>Performance</Reveal>
        <div className="mt-2 flex items-start gap-5">
          <Reveal>
            <Analysis content={content} />
          </Reveal>
          <Reveal>
            <Performance content={content} />
          </Reveal>
        </div>
      </Column>

      <Column top={109}>
        <Reveal className={heading}>Check-in</Reveal>
        <Reveal className="mt-8">
          <CheckIn content={content} />
        </Reveal>
      </Column>

      <div
        className="flex shrink-0 items-start gap-10"
        style={{ paddingTop: 105 + DY }}
      >
        <Reveal
          className={cn(
            heading,
            "rotate-180 text-[88px] leading-none [writing-mode:vertical-rl]"
          )}
        >
          Guidance?
        </Reveal>
        <div className="flex flex-col gap-6">
          <Reveal>
            <Ask />
          </Reveal>
          <Reveal>
            <Faqs content={content} />
          </Reveal>
        </div>
      </div>

      <Column top={150}>
        <Reveal className={cn(heading, "text-[72px] leading-[78px]")}>
          {["Get", "your", "self", "ready"].map((word) => (
            <div key={word}>{word}</div>
          ))}
        </Reveal>
      </Column>
      <Column top={40}>
        <Reveal>
          <Shop activity={mission.activity} content={content} />
        </Reveal>
      </Column>

      <Column top={186}>
        <Reveal>
          <a
            href="/storybook"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-10 text-foreground"
          >
            <span
              className={cn(
                DISPLAY,
                "flex flex-col text-[106px] leading-[118px]"
              )}
            >
              <UnderlineToBackground targetTextColor="var(--background)">
                Check the
              </UnderlineToBackground>
              <UnderlineToBackground targetTextColor="var(--background)">
                Storybook
              </UnderlineToBackground>
            </span>
            <span className="mt-2.5 flex flex-col gap-5">
              {[0, 1, 2].map((i) => (
                <ArrowFatRightIcon key={i} weight="fill" size={52} />
              ))}
            </span>
          </a>
        </Reveal>
      </Column>
    </div>
  )
}

export function Explore() {
  const wide = useWide()
  const [mission, setMission] = useState<Mission>(DEFAULT_MISSION)
  // what the AI is working from: the sentence as it was when the button was pressed
  const [launched, setLaunched] = useState<Mission>(DEFAULT_MISSION)
  const [phase, setPhase] = useState<Phase>("idle")
  const [run, setRun] = useState(0)
  const [done, setDone] = useState(0)

  // the preview's own look, and the triggers that act on it
  const [themeId, setThemeId] = useState<string | null>(null)
  const [styling, setStyling] = useState<Styling>(DEFAULT_STYLING)

  const scroller = useRef<HTMLDivElement>(null)
  const tasks = useMemo(() => missionContent(launched).tasks, [launched])
  const scope = themeScope(themeId, styling)

  const start = () => {
    setLaunched(mission)
    setPhase("loading")
    setDone(0)
    setRun((n) => n + 1)
  }

  // After the press: the curtain falls, the AI is shown working for five
  // seconds, then the strip of components is revealed.
  useEffect(() => {
    if (run === 0) return
    const timers: ReturnType<typeof setTimeout>[] = []
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms))
    at(COVER_MS - 100, () => scroller.current?.scrollTo({ left: 0 }))
    for (let i = 1; i <= 3; i++)
      at(COVER_MS + (LOADING_MS / 3) * i - 400, () => setDone(i))
    at(COVER_MS + LOADING_MS, () => setPhase("ready"))
    return () => timers.forEach(clearTimeout)
  }, [run])

  if (!wide) return null

  return (
    <section className="pb-[157px]">
      <div className="mx-auto flex w-full max-w-[956px] flex-col px-6">
        <h4 className="font-serif text-foreground">Explore the system</h4>
        <div className="mt-10 flex h-[76px] items-start">
          <PreviewMenus
            themeId={themeId}
            onTheme={setThemeId}
            styling={styling}
            onStyling={setStyling}
          />
        </div>
      </div>

      {/* the preview: it alone wears the chosen theme and styling */}
      <div
        className={cn(
          scope.className,
          "relative h-[720px] w-full overflow-hidden text-foreground [contain:layout_paint]"
        )}
        style={{
          ...scope.style,
          // as measured in the Figma: a base of 5% ink over the page colour (#f5f2f0 in
          // Lighten Up), with a band 2.7% darker every 80px across, 45° bottom-left to top-right
          backgroundColor:
            "color-mix(in srgb, var(--foreground) 5%, var(--background))",
          backgroundImage:
            "repeating-linear-gradient(135deg, transparent 0 56.57px, color-mix(in srgb, var(--foreground) 2.7%, transparent) 56.57px 113.14px)",
        }}
      >
        {/* its own curtain, for the story: scoped to the stage */}
        <CurtainTransition transitionKey={String(run)}>
          <div
            ref={scroller}
            className="h-[720px] overflow-x-auto overflow-y-hidden [scrollbar-width:thin]"
          >
            {phase === "ready" ? (
              <Strip mission={launched} />
            ) : (
              <div className="relative h-full w-full min-w-[1278px]">
                {phase === "idle" ? (
                  <Sentence
                    mission={mission}
                    onChange={(next) => setMission((m) => ({ ...m, ...next }))}
                    onStart={start}
                  />
                ) : (
                  <Loading mission={launched} done={done} rows={tasks} />
                )}
              </div>
            )}
          </div>
        </CurtainTransition>
      </div>
    </section>
  )
}
