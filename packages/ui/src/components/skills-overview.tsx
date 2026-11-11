"use client"

import * as React from "react"

import { CheckIcon, CopyIcon } from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"
import { ThemedIcon } from "@workspace/ui/components/themed-icon"
import { Separator } from "@workspace/ui/components/separator"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

/** What you can ask the skill about, in a designer's words, with prompts to copy. */
const ANSWERS: { ask: string; file: string; prompts: string[]; note: string }[] = [
  { ask: "Themes", file: "themes.md", prompts: ["Which themes are there, and what are they like?", "Help me create a new theme"], note: "The nine themes and how each one looks and feels. Berghain is the default." },
  { ask: "Colors, fonts and styling", file: "tokens.md", prompts: ["Tell me about the colors and fonts", "Which colors can I use, and what is each one for?"], note: "Colors, fonts, corner radius, shadows and glass effects, and what each is for." },
  { ask: "Components", file: "components.md", prompts: ["What components are available?", "Can I add my own components?"], note: "The ready-made pieces, like buttons, menus, cards and dialogs, and how to use them." },
  { ask: "Animation", file: "animations.md", prompts: ["What animations are there?", "Which page transitions are there?"], note: "Page transitions, text effects and how things move." },
  { ask: "Screen sizes", file: "breakpoints.md", prompts: ["What screen sizes does it support?", "How does it change on a phone?"], note: "How layouts change from phone to desktop." },
  { ask: "What it is built with", file: "tech.md", prompts: ["What is the design system built with?"], note: "The technology behind it." },
  { ask: "Who uses it", file: "sites.md", prompts: ["Which sites are built with the design system?"], note: "Sites built with it, kept apart from ones that only say they are." },
  { ask: "Figma designs", file: "figma.md", prompts: ["Build this from my Figma design: <link>", "Check my Figma variables against what is built"], note: "Turn a design into a build, or check a build against the design." },
  { ask: "Starting something new", file: "kickoff.md", prompts: ["I'm starting a new app with this design system"], note: "Before it builds anything new, it asks you a few questions about what you need." },
  { ask: "Bringing in a component", file: "import.md", prompts: ["Add this component to the design system: <name>"], note: "Add a component from somewhere else so it follows your theme." },
  { ask: "Phones", file: "mobile-web-guidelines.md", prompts: ["Make this page work well on phones"], note: "Anything that runs in a mobile browser." },
]

const GET_STARTED: { title: string; body: string; copy?: string; copyLabel: string }[] = [
  { title: "1. Install the skill", body: "Run this in your project folder. It adds the skill to the project, in the folder where Claude Code looks for skills, and changes nothing else.", copy: "npx @lukeanill/ui install-skill", copyLabel: "Copy command" },
  { title: "2. Open your project in Claude Code", body: "Claude Code loads the skill by itself. You never switch it on or call it by name.", copyLabel: "" },
  { title: "3. Ask a question or describe what to build", body: "Ask about themes, colors, components or screen sizes, or say what you want built. To try it, ask for a new theme. Claude will point you to the Themer and take you through the choices. More to ask is listed below.", copy: "Help me create a new theme", copyLabel: "Copy prompt" },
]

/** A line of text that copies itself when you tap anywhere on it; the icon turns to a tick for a moment. */
function CopyRow({ text, label, mono }: { text: string; label: string; mono?: boolean }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <Button
      type="button"
      variant="ghost"
      aria-label={`${label}: ${text}`}
      className="h-auto w-fit max-w-full min-w-0 justify-start gap-2 py-1.5 text-left whitespace-normal"
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 2000)
        })
      }}
    >
      <span className={mono ? "min-w-0 font-mono" : "min-w-0"}>{mono ? text : `\u201c${text}\u201d`}</span>
      <ThemedIcon phosphor={copied ? CheckIcon : CopyIcon} className="size-4" />
    </Button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-10">
      <h2 className="text-h2-pri">{title}</h2>
      {children}
    </section>
  )
}

export function SkillsOverview() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-30 px-5 py-20 sm:px-10 lg:px-30 lg:py-40">
        <header className="flex flex-col gap-6">
          <h1 className="text-h1-pri-bold">Design System skill</h1>
          <p className="max-w-3xl text-h5-pri">
            New to this design system? This is where to start. A skill is a set of notes that Claude Code reads before it helps you, so it already knows this design system: its themes, colors, fonts, components and animations, and the rules for building with them.
          </p>
        </header>

        <Section title="get started">
          <Card>
            {GET_STARTED.map((step, i) => (
              <React.Fragment key={step.title}>
                {i > 0 ? <Separator /> : null}
                <CardHeader>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.body}</CardDescription>
                </CardHeader>
                {step.copy ? (
                  <CardContent>
                    <CopyRow text={step.copy} label={step.copyLabel} mono />
                  </CardContent>
                ) : null}
              </React.Fragment>
            ))}
          </Card>
        </Section>

        <Section title="what you can ask">
          <div className="flex flex-col gap-4">
            {ANSWERS.map((row) => (
              <Card key={row.ask}>
                <CardHeader>
                  <CardTitle>{row.ask}</CardTitle>
                  {row.note ? <CardDescription>{row.note}</CardDescription> : null}
                  <CardAction>
                    <Badge variant="secondary" className="font-mono">{row.file}</Badge>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col">
                  {row.prompts.map((prompt) => (
                    <CopyRow key={prompt} text={prompt} label="Copy prompt" />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
