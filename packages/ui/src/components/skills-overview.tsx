"use client"

import * as React from "react"

import { CopyButton } from "@workspace/ui/components/animate-ui/components/buttons/copy"
import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemSeparator, ItemTitle } from "@workspace/ui/components/item"

/** What the design-system skill can answer, and the reference file that holds the answer. */
const ANSWERS: { ask: string; file: string; note: string }[] = [
  { ask: "The nine themes, their settings, palettes, fonts and UX direction", file: "themes.md", note: "Fixed order, Berghain is the default." },
  { ask: "What a custom property is in a theme", file: "themes-resolved.md", note: "Every --name for every theme." },
  { ask: "A design token: meaning, value, where it is used", file: "tokens.md", note: "Colour, alpha, type, radius, shadow, motion, glass and the text styles." },
  { ask: "A component: props, where it is used, its Storybook link", file: "components.md", note: "An index, then one file per Storybook group." },
  { ask: "An animation, transition or text effect", file: "animations.md", note: "An index, then one file per group." },
  { ask: "Direction, rules, what to do and not do", file: "guidance.md", note: "Working rules, theming rules, known gaps." },
  { ask: "Breakpoints", file: "breakpoints.md", note: "The standard widths and the fixed widths in code." },
  { ask: "Tech stack, commands, hosting, publishing", file: "tech.md", note: "" },
  { ask: "Which sites are built with it", file: "sites.md", note: "Verified and claimed, kept apart." },
  { ask: "Building or checking anything from a Figma design", file: "figma.md", note: "Dev mode, annotations, non-token values, questions first." },
  { ask: "Starting a new build on the package", file: "kickoff.md", note: "Twelve questions, asked before any code." },
  { ask: "Adding or importing a component", file: "import.md", note: "Step by step, starting with a question to you." },
  { ask: "Anything that runs in a mobile web browser", file: "mobile-web-guidelines.md", note: "Applied by default." },
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
            A Claude Code skill that knows this design system: the themes, tokens, components and animations, and the rules for building with them. It ships inside the package, so anyone using @lukeanill/ui can have Claude work from it.
          </p>
        </header>

        <Section title="install">
          <Command note="Run in your project folder. It copies the skill to .claude/skills/design-system, where Claude Code looks for skills, and touches nothing else.">
            npx @lukeanill/ui install-skill
          </Command>
          <Command note="For every project on your machine instead of one.">npx @lukeanill/ui install-skill --global</Command>
          <Command note="For another project folder.">npx @lukeanill/ui install-skill --dir ../my-app</Command>
          <p className="text-md opacity-60">Run it again after you update the package to refresh the skill.</p>
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

        <Section title="keeping it current">
          <p className="max-w-3xl text-md opacity-60">
            Most of the references are generated from the source: the themes, tokens, components and animations. In this repository, regenerate them after changing any of those.
          </p>
          <Command note="Rewrites the generated references from packages/ui/src and the stories. The hand-written ones (guidance, breakpoints, tech, sites, import) are updated by hand.">
            node .claude/skills/design-system/scripts/generate.mjs
          </Command>
        </Section>
      </div>
    </div>
  )
}
