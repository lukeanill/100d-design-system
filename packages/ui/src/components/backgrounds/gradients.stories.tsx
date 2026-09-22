import type { BalsaBackgroundConfig } from "./gradient-background/gradient-background"
import { GradientBackground } from "./gradient-background"
import { animatedBackground80 } from "./gradients/animated-background-80"
import { animatedBackgroundAscii } from "./gradients/animated-background-ascii"
import { animatedBackgroundAurora } from "./gradients/animated-background-aurora"
import { animatedBackgroundHolo } from "./gradients/animated-background-holo"
import { animatedBackgroundSmoke } from "./gradients/animated-background-smoke"

export default {
  title: "Animation/Backgrounds/Gradients",
  component: GradientBackground,
  parameters: { layout: "fullscreen" },
  argTypes: {
    paused: { control: "boolean" },
    useThemeColors: {
      control: "boolean",
      description: "Paint with the active theme's colours (switch themes in the toolbar)",
    },
    scrim: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
  },
  args: { paused: false, useThemeColors: false, scrim: 0 },
}

type Args = { paused: boolean; useThemeColors: boolean; scrim: number }

/** A background with content above it, as it is meant to be used. */
function Scene({
  config,
  title,
  dark = false,
  paused,
  useThemeColors,
  scrim,
}: Args & { config: BalsaBackgroundConfig; title: string; dark?: boolean }) {
  return (
    <section className="relative isolate min-h-screen overflow-hidden">
      <GradientBackground
        config={config}
        paused={paused}
        useThemeColors={useThemeColors}
        scrim={scrim}
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
        <h1
          className={
            useThemeColors
              ? "text-5xl font-light text-foreground"
              : dark
                ? "text-5xl font-light text-neutral-900"
                : "text-5xl font-light text-white"
          }
        >
          {title}
        </h1>
      </div>
    </section>
  )
}

export const Aurora = (args: Args) => <Scene {...args} config={animatedBackgroundAurora} title="Aurora" />

export const Smoke = (args: Args) => <Scene {...args} config={animatedBackgroundSmoke} title="Smoke" />

export const Ascii = (args: Args) => <Scene {...args} config={animatedBackgroundAscii} title="ASCII" />
Ascii.storyName = "ASCII"

// near-white stops, so the type is dark
export const Holo = (args: Args) => <Scene {...args} config={animatedBackgroundHolo} title="Holo" dark />

export const Eighty = (args: Args) => <Scene {...args} config={animatedBackground80} title="80" />
Eighty.storyName = "80"
