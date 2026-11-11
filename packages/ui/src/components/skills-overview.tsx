"use client"

import * as React from "react"

import { CopyButton } from "@workspace/ui/components/animate-ui/components/buttons/copy"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Item, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "@workspace/ui/components/item"

/** What you can ask the skill about, in a designer's words, with prompts to copy. */
const ANSWERS: { ask: string; prompts: string[]; note: string }[] = [
  { ask: "Themes", prompts: ["Which themes are there, and what are they like?", "Help me create a new theme"], note: "The nine themes and how each one looks and feels. Berghain is the default." },
  { ask: "Colours, fonts and styling", prompts: ["Tell me about the colours and fonts", "Which colours can I use, and what is each one for?"], note: "Colours, fonts, corner radius, shadows and glass effects, and what each is for." },
  { ask: "Components", prompts: ["What components are available?", "Can I add my own components?"], note: "The ready-made pieces, like buttons, menus, cards and dialogs, and how to use them." },
  { ask: "Animation", prompts: ["What animations are there?", "Which page transitions are there?"], note: "Page transitions, text effects and how things move." },
  { ask: "Rules for designing with it", prompts: ["What are the rules for using the design system?", "What isn't finished yet?"], note: "What to do and not to do, and what is still missing." },
  { ask: "Screen sizes", prompts: ["What screen sizes does it support?", "How does it change on a phone?"], note: "How layouts change from phone to desktop." },
  { ask: "What it is built with", prompts: ["What is the design system built with?"], note: "The technology behind it." },
  { ask: "Who uses it", prompts: ["Which sites are built with the design system?"], note: "Sites built with it, kept apart from ones that only say they are." },
  { ask: "Figma designs", prompts: ["Build this from my Figma design: <link>", "Check my Figma variables against what is built"], note: "Turn a design into a build, or check a build against the design." },
  { ask: "Starting something new", prompts: ["I'm starting a new app with this design system"], note: "Before it builds anything new, it asks you a few questions about what you need." },
  { ask: "Bringing in a component", prompts: ["Add this component to the design system: <name>"], note: "Add a component from somewhere else so it follows your theme." },
  { ask: "Phones", prompts: ["Make this page work well on phones"], note: "Anything that runs in a mobile browser." },
]

const GET_STARTED: { title: string; body: string }[] = [
  { title: "1. Install the skill", body: "Run the install command below in your project folder. It adds the skill to the project so Claude Code can find it." },
  { title: "2. Open your project in Claude Code", body: "Claude Code loads the skill by itself. You never switch it on or call it by name." },
  { title: "3. Ask a question or describe what to build", body: "Ask about themes, colours, components or screen sizes, or say what you want built. It answers from the design system, not from guesswork." },
]

const RULES: { title: string; body: string }[] = [
  { title: "Use the design system first", body: "Before building anything it checks whether a component, colour, style or theme setting already does the job, and copies the closest thing that exists." },
  { title: "Never fake what the system provides", body: "No hand-made gradients, blurs, shadows, rounded corners or colours when the design system already has one." },
  { title: "Reads your Figma first", body: "With a Figma link it reads the design in detail, points out anything that is not part of the design system, and asks its questions before it builds." },
  { title: "Numbered points", body: "Every question, option, assumption and finding is numbered, so you can answer by number." },
  { title: "Questions before a new build", body: "For something new it asks twelve questions first: theme, devices, what gets saved, hosting, speed, sign-in, scope and how you want to work together." },
  { title: "Says what is missing", body: "“There is no example for that yet” is a real answer. If it does not know, it says so instead of guessing." },
  { title: "Finishes with a report", body: "What it reused, what is new and why, what was tested and what was not, then it asks you to check it, with links and what to look for." },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-10">
      <h2 className="text-h2-pri">{title}</h2>
      {children}
    </section>
  )
}

function Command({ children, note }: { children: string; note: string }) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center justify-between gap-4">
        <code className="min-w-0 overflow-x-auto font-mono text-md whitespace-nowrap">{children}</code>
        <CopyButton content={children} variant="ghost" size="xs" aria-label="Copy command" />
      </CardContent>
      <CardDescription className="px-(--card-spacing)">{note}</CardDescription>
    </Card>
  )
}

export function SkillsOverview() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-30 px-5 py-20 sm:px-10 lg:px-30 lg:py-40">
        <header className="flex flex-col gap-6">
          <h1 className="text-h1-pri-bold">Design System skill</h1>
          <p className="max-w-3xl text-h5-pri">
            New to this design system? This is where to start. A skill is a set of notes that Claude Code reads before it helps you, so it already knows this design system: its themes, colours, fonts, components and animations, and the rules for building with them. It comes with the @lukeanill/ui package, and you do not need to learn any of it first.
          </p>
        </header>

        <Section title="get started">
          <div className="grid gap-4 md:grid-cols-3">
            {GET_STARTED.map((step) => (
              <Card key={step.title}>
                <CardHeader>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Section>

        <Section title="install">
          <Command note="Run this in your project folder. It adds the skill to the project, in the folder where Claude Code looks for skills, and changes nothing else.">
            npx @lukeanill/ui install-skill
          </Command>
        </Section>

        <Section title="make your first theme">
          <Command note="Ask Claude to do it with you. It will point you to the Themer and take you through the choices.">Help me create a new theme</Command>
        </Section>

        <Section title="what you can ask">
          <ItemGroup>
            {ANSWERS.map((row, i) => (
              <React.Fragment key={row.ask}>
                {i > 0 ? <ItemSeparator /> : null}
                <Item>
                  <ItemContent>
                    <ItemTitle>{row.ask}</ItemTitle>
                    {row.note ? <ItemDescription>{row.note}</ItemDescription> : null}
                    <div className="mt-2 flex flex-col gap-1">
                      {row.prompts.map((prompt) => (
                        <div key={prompt} className="flex items-center gap-2">
                          <p className="text-sm">&ldquo;{prompt}&rdquo;</p>
                          <CopyButton content={prompt} variant="ghost" size="xs" aria-label={`Copy: ${prompt}`} />
                        </div>
                      ))}
                    </div>
                  </ItemContent>
                </Item>
              </React.Fragment>
            ))}
          </ItemGroup>
        </Section>

        <Section title="how it works">
          <div className="grid gap-4 md:grid-cols-2">
            {RULES.map((rule) => (
              <Card key={rule.title}>
                <CardHeader>
                  <CardTitle>{rule.title}</CardTitle>
                  <CardDescription>{rule.body}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
