import type { ComponentType } from "react"
import type { EffectBackgroundProps } from "./effect-background"
import { AcidSquaresBackground } from "./effects/acid-squares"
import { DitherCanvasBackground } from "./effects/dither-canvas"
import { DotFieldBackground } from "./effects/dot-field"
import { FerrofluidBackground } from "./effects/ferrofluid"
import { IridescenceBackground } from "./effects/iridescence"
import { LetterGlitchBackground } from "./effects/letter-glitch"
import { LightningBackground } from "./effects/lightning"
import { LiquidChromeBackground } from "./effects/liquid-chrome"
import { MagnetLinesBackground } from "./effects/magnet-lines"
import { PatternWavesBackground } from "./effects/pattern-waves"
import { PrismBackground } from "./effects/prism"
import { TopographyBackground } from "./effects/topography"
import { WavesBackground } from "./effects/waves"

// The same args as the gradient backgrounds (Animation / Backgrounds / FX): hold the frame, paint with the
// theme's colours, swap them round, and lay a scrim over the top.
export default {
  title: "Animation/Backgrounds/Effects",
  parameters: { layout: "fullscreen" },
  argTypes: {
    paused: { control: "boolean" },
    useThemeColors: {
      control: "boolean",
      description: "Paint with the active theme's colours (switch themes in the toolbar)",
    },
    inverse: {
      control: "boolean",
      description: "With theme colours: the foreground is the base and the background the highlight",
    },
    scrim: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
  },
  args: { paused: false, useThemeColors: false, inverse: false, scrim: 0 },
}

type Args = { paused: boolean; useThemeColors: boolean; inverse: boolean; scrim: number }

/** The background on its own, filling the canvas. */
function Scene({ Background, paused, useThemeColors, inverse, scrim }: Args & { Background: ComponentType<EffectBackgroundProps> }) {
  return (
    <section className="relative isolate min-h-screen overflow-hidden">
      <Background
        paused={paused}
        useThemeColors={useThemeColors}
        inverse={inverse}
        scrim={scrim}
        scrimColor={useThemeColors && inverse ? "var(--foreground)" : undefined}
      />
    </section>
  )
}

export const DitherCanvas = (args: Args) => <Scene {...args} Background={DitherCanvasBackground} />
export const PatternWaves = (args: Args) => <Scene {...args} Background={PatternWavesBackground} />
export const Topography = (args: Args) => <Scene {...args} Background={TopographyBackground} />
export const AcidSquares = (args: Args) => <Scene {...args} Background={AcidSquaresBackground} />
export const Ferrofluid = (args: Args) => <Scene {...args} Background={FerrofluidBackground} />
export const Prism = (args: Args) => <Scene {...args} Background={PrismBackground} />
export const Lightning = (args: Args) => <Scene {...args} Background={LightningBackground} />
export const DotField = (args: Args) => <Scene {...args} Background={DotFieldBackground} />
export const Iridescence = (args: Args) => <Scene {...args} Background={IridescenceBackground} />
export const Waves = (args: Args) => <Scene {...args} Background={WavesBackground} />
export const MagnetLines = (args: Args) => <Scene {...args} Background={MagnetLinesBackground} />
export const LetterGlitch = (args: Args) => <Scene {...args} Background={LetterGlitchBackground} />
export const LiquidChrome = (args: Args) => <Scene {...args} Background={LiquidChromeBackground} />
