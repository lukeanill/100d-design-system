import { useState } from "react"

import { Backdrop, HeroLine, LoadIn, Section } from "../Showcase"
import { BODY, LinkTile, MIGRA } from "../LinkTile"

/* The Design System skill page, in the homepage's style (Showcase.tsx): the same backdrop, the Migra headline that cuts
 * in line by line, and the glass link tiles with their 3D artwork. Each tile that can be copied copies on a tap. */

const INSTALL_COMMAND = "npx @lukeanill/ui install-skill"

type Ask = { group: "Build with it" | "Explore the system"; ask: string; file: string; prompt: string; note: string }

/** What you can ask the skill about, in a designer's words, with one prompt to copy each. */
const ASKS: Ask[] = [
  { group: "Build with it", ask: "Starting something new", file: "kickoff.md", prompt: "How do I start something new?", note: "Before it builds anything new, it asks you a few questions about what you need." },
  { group: "Build with it", ask: "Figma designs", file: "figma.md", prompt: "How do I build from a Figma design?", note: "Turn a design into a build, or check a build against the design." },
  { group: "Build with it", ask: "Bringing in a component", file: "import.md", prompt: "How do I bring in a component?", note: "Add a component from somewhere else so it follows your theme." },
  { group: "Explore the system", ask: "Themes", file: "themes.md", prompt: "Tell me about the themes", note: "The nine themes and how each one looks and feels. Berghain is the default." },
  { group: "Explore the system", ask: "Design tokens", file: "tokens.md", prompt: "Tell me about the design tokens", note: "Everything you can style: colors, type, corner radius, shadows, motion and glass, and what each is for." },
  { group: "Explore the system", ask: "Components", file: "components.md", prompt: "Tell me about the components", note: "The ready-made pieces, like buttons, menus, cards and dialogs, and how to use them." },
  { group: "Explore the system", ask: "Animation", file: "animations.md", prompt: "Tell me about the animations", note: "Page transitions, text effects and how things move." },
  { group: "Explore the system", ask: "Screen sizes", file: "breakpoints.md", prompt: "Tell me about the screen sizes", note: "How layouts change from phone to desktop." },
  { group: "Explore the system", ask: "What it is built with", file: "tech.md", prompt: "Tell me what it is built with", note: "The technology behind it." },
]

const IMAGES = ["/home/tile-blob.png", "/home/tile-box.png", "/home/tile-star.png"]

const H48 = `${MIGRA} text-[clamp(32px,3.75vw,48px)] leading-[1.22] font-extralight`
const H28 = `${MIGRA} text-[clamp(22px,2.1875vw,28px)] leading-[1.22] font-extralight`

/** Copies `text` and says so on the tile for a couple of seconds. */
function useCopy(text: string) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    void navigator.clipboard?.writeText(text).then(() => {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    })
  }
  return { copied, copy }
}

function CopyTile({ image, title, description, badge, text, label, step }: { image: string; title: string; description: string; badge?: string; text: string; label: string; step: number }) {
  const { copied, copy } = useCopy(text)
  return (
    <LoadIn step={step} className="flex w-full max-w-[320px] sm:min-w-0 sm:flex-1">
      <LinkTile image={image} title={title} description={description} badge={badge} label={copied ? "Copied" : label} onClick={copy} />
    </LoadIn>
  )
}

export function SkillsPage() {
  const groups = ["Build with it", "Explore the system"] as const
  return (
    <div className="relative isolate flex min-h-svh flex-col items-center overflow-x-clip bg-black text-[#fbfbfc]">
      <Backdrop />

      <div className="relative z-10 flex w-full flex-col gap-[clamp(40px,6.25vw,80px)]">
        <Section className="flex flex-col items-center gap-10 pt-[clamp(96px,12.5vw,160px)]">
          <div className="flex flex-col items-center text-center leading-[1.4]">
            <p className="text-h4-pri mb-[-6px]"><HeroLine step={0}>Claude already knows</HeroLine></p>
            <p className="text-h2-pri-bold mb-[-6px] whitespace-pre"><HeroLine step={1}>{"the design  system"}</HeroLine></p>
            <p className="text-h3-sec"><HeroLine step={2}>from the first prompt.</HeroLine></p>
          </div>
          <div className={`${BODY} flex max-w-[560px] flex-col items-center text-center leading-[1.6]`}>
            <p className="text-md opacity-75"><HeroLine step={3}>A skill is a set of notes Claude Code reads before it helps you: the themes, colors, fonts, components and animations.</HeroLine></p>
          </div>
        </Section>

        <Section className="flex flex-col gap-10 pt-10">
          <h2 className={H48}>Get started</h2>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-center sm:gap-4 lg:gap-10">
            <CopyTile
              step={4}
              image={IMAGES[0]}
              title="Install the skill"
              description="Run this in your project folder. It adds the skill so Claude Code can find it."
              text={INSTALL_COMMAND}
              label="Copy command"
            />
            <LoadIn step={5} className="flex w-full max-w-[320px] sm:min-w-0 sm:flex-1">
              <LinkTile inert image={IMAGES[1]} title="Open your project in Claude Code" description="Claude Code loads the skill by itself. You never switch it on or call it by name." showArrow={false} />
            </LoadIn>
            <CopyTile
              step={6}
              image={IMAGES[2]}
              title="Ask a question or describe what to build"
              description="To try it, ask for a new theme. Claude will take you through the choices."
              text="Help me create a new theme"
              label="Copy prompt"
            />
          </div>
        </Section>

        <Section className="flex flex-col gap-16 pt-10 pb-[clamp(96px,12.5vw,160px)]">
          <h2 className={H48}>What you can ask</h2>
          {groups.map((group) => (
            <div key={group} className="flex flex-col gap-8">
              <h3 className={H28}>{group}</h3>
              <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-3 sm:gap-4 lg:gap-10">
                {ASKS.filter((a) => a.group === group).map((a, i) => (
                  <CopyTile key={a.ask} step={0} image={IMAGES[i % 3]} title={a.ask} description={a.note} badge={a.file} text={a.prompt} label={`“${a.prompt}”`} />
                ))}
              </div>
            </div>
          ))}
        </Section>
      </div>
    </div>
  )
}
