"use client"

import * as React from "react"

import { CopyButton } from "@workspace/ui/components/animate-ui/components/buttons/copy"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "@workspace/ui/components/item"

/** What the design-system skill can answer, and the reference file that holds the answer. */
const ANSWERS: { ask: string; file: string; prompts: string[]; note: string }[] = [
  { ask: "The nine themes, their settings, palettes, fonts and UX direction", file: "themes.md", prompts: ["Which themes are there, and what are their settings?", "Which theme has glass?", "Help me create a new theme"], note: "Fixed order, Berghain is the default." },
  { ask: "What a custom property is in a theme", file: "themes-resolved.md", prompts: ["What is --primary in Fabrik?", "What does --radius-button resolve to in each theme?"], note: "Every --name for every theme." },
  { ask: "A design token: meaning, value, where it is used", file: "tokens.md", prompts: ["Tell me about the tokens", "What is --control-edge and where is it used?"], note: "Colour, alpha, type, radius, shadow, motion, glass and the text styles." },
  { ask: "A component: props, where it is used, its Storybook link", file: "components.md", prompts: ["How do I use the Dialog? Give me its props and a link to its story", "Which components use glass?"], note: "An index, then one file per Storybook group." },
  { ask: "An animation, transition or text effect", file: "animations.md", prompts: ["What animations does the Splitting text effect have?", "Which page transitions are there?"], note: "An index, then one file per group." },
  { ask: "Direction, rules, what to do and not do", file: "guidance.md", prompts: ["What are the rules for theming a component?", "What are the known gaps?"], note: "Working rules, theming rules, known gaps." },
  { ask: "Breakpoints", file: "breakpoints.md", prompts: ["What are the breakpoints?", "Which components use fixed widths?"], note: "The standard widths and the fixed widths in code." },
  { ask: "Tech stack, commands, hosting, publishing", file: "tech.md", prompts: ["What is the tech stack?", "How do I publish the package?"], note: "" },
  { ask: "Which sites are built with it", file: "sites.md", prompts: ["Which sites are built with the design system?"], note: "Verified and claimed, kept apart." },
  { ask: "Building or checking anything from a Figma design", file: "figma.md", prompts: ["Build this from Figma: <link>", "Check the Themes file variables against the code"], note: "Dev mode, annotations, non-token values, questions first." },
  { ask: "Starting a new build on the package", file: "kickoff.md", prompts: ["I'm starting a new app with this design system"], note: "Twelve questions, asked before any code." },
  { ask: "Adding or importing a component", file: "import.md", prompts: ["Import this shadcn component into the design system: <name>"], note: "Step by step, starting with a question to you." },
  { ask: "Anything that runs in a mobile web browser", file: "mobile-web-guidelines.md", prompts: ["Make this page work well on phones"], note: "Applied by default." },
]

const GET_STARTED: { title: string; body: string }[] = [
  { title: "1. Install the skill", body: "Run the install command below in your project folder. It adds the skill to the project so Claude Code can find it." },
  { title: "2. Open your project in Claude Code", body: "Claude Code loads the skill by itself. You never switch it on or call it by name." },
  { title: "3. Ask a question or describe what to build", body: "Ask about themes, tokens, components or breakpoints, or say what you want built. It answers from the design system, not from guesswork." },
]

const RULES: { title: string; body: string }[] = [
  { title: "Use the design system first", body: "Before writing UI it looks for the component, token, glass layer or theme setting that already does the job, and copies the closest thing already built." },
  { title: "Never fake what the system provides", body: "No hand-made gradients, blurs, shadows, radii or colours where a token, a glass weight or a component exists." },
  { title: "Figma gate", body: "With a Figma link it reads the guide first, then dev mode specs, variables, annotations and comments, lists every non-token value, and asks its questions before building." },
  { title: "Numbered points", body: "Every question, option, assumption and finding is numbered, so you can answer by number." },
  { title: "Kickoff before a new build", body: "It asks the twelve kickoff questions (theme, devices, storage, hosting, performance, sign-in, scope and how to work together) before writing code." },
  { title: "Say what is missing", body: "“No story yet” and “not used in the app” are real answers. If a fact is not in the references or the source, it says it is unknown." },
  { title: "Finish with a report", body: "What was reused, what is new and why, what was tested and what was not, then a request for you to QA with URLs and what to check." },
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
            New to this design system? This is where to start. A skill is a set of notes that Claude Code reads before it helps you, so it already knows this design system: its themes, tokens, components and animations, and the rules for building with them. It comes with the @lukeanill/ui package, and you do not need to learn any of it first.
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

        <Section title="what it answers">
          <ItemGroup>
            {ANSWERS.map((row, i) => (
              <React.Fragment key={row.file}>
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
                  <ItemActions>
                    <Badge variant="secondary" className="font-mono">{row.file}</Badge>
                  </ItemActions>
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
