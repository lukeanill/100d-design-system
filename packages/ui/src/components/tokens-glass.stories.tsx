import * as React from "react"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { GradientBackground } from "@workspace/ui/components/backgrounds/gradient-background"
import { animatedBackgroundAurora } from "@workspace/ui/components/backgrounds/gradients/animated-background-aurora"

/**
 * Glass is a per-theme setting: a weight, a tone, and which groups it covers
 * (cards always, then actions, inputs, selects and overlays). The controls here
 * stand in for a theme's choice so the recipe can be seen without saving one.
 *
 * The blur needs something behind it, so the sampler sits on a paused
 * background.
 */
const WEIGHTS = {
  light: { blur: "16px", saturate: "125%", surface: "85%" },
  medium: { blur: "40px", saturate: "150%", surface: "70%" },
  heavy: { blur: "64px", saturate: "180%", surface: "55%" },
}

const TONES = { light: "oklch(1 0 0)", dark: "oklch(0 0 0)" }

const GROUPS = ["card", "action", "input", "select", "overlay"] as const

export default {
  title: "Tokens/Glass",
  parameters: { layout: "fullscreen" },
  argTypes: {
    style: { control: "inline-radio", options: ["solid", "glass"] },
    weight: { control: "inline-radio", options: Object.keys(WEIGHTS) },
    tone: { control: "inline-radio", options: Object.keys(TONES) },
  },
  args: { style: "glass", weight: "medium", tone: "light" },
}

type Args = { style: "solid" | "glass"; weight: keyof typeof WEIGHTS; tone: keyof typeof TONES }

/** The declarations a theme would carry, as inline properties. */
function glassStyle({ style, weight, tone }: Args) {
  if (style === "solid") return {}
  const { blur, saturate, surface } = WEIGHTS[weight]
  const base = { card: "--card", action: "--primary", input: "--card", select: "--popover", overlay: "--popover" }
  return Object.fromEntries(
    GROUPS.flatMap((group) => [
      [`--glass-${group}-layer`, '""'],
      [`--glass-${group}-blur`, blur],
      [`--glass-${group}-saturate`, saturate],
      [
        `--glass-${group}-surface`,
        `color-mix(in oklab, color-mix(in oklab, var(${base[group]}) 90%, ${TONES[tone]}) ${surface}, transparent)`,
      ],
    ])
  ) as React.CSSProperties
}

export const Glass = (args: Args) => (
  <section className="relative isolate min-h-screen overflow-hidden" style={glassStyle(args)}>
    <GradientBackground config={animatedBackgroundAurora} paused />
    <div className="relative z-10 flex flex-col gap-6 p-10">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Card</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm">
          <p>Cards are glass whenever the theme is, whatever else is ticked.</p>
          <Input placeholder="Input" aria-label="Input" />
          <div className="flex gap-2">
            <Button>Action</Button>
            <Button variant="secondary">Secondary</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>
)
