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
  title: "Animation/Backgrounds/Interactive",
  parameters: { layout: "fullscreen" },
  argTypes: {
    paused: { control: "boolean" },
    useThemeColors: {
      control: "boolean",
      description: "Paint with the active theme's colours (switch themes in the toolbar)",
    },
    inverse: {
      control: "boolean",
      description: "Swap base and highlight: the theme's foreground and background with theme colours, the effect's first and last colours without",
    },
    scrim: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
  },
  args: { paused: false, useThemeColors: false, inverse: false, scrim: 0 },
}

type Args = { paused: boolean; useThemeColors: boolean; inverse: boolean; scrim: number }

/** The background on its own, filling the canvas. */
function Scene({ Background, paused, useThemeColors, inverse, scrim, ...effect }: Args & { Background: ComponentType<any> } & Record<string, unknown>) {
  return (
    <section className="relative isolate min-h-screen overflow-hidden">
      <Background
        paused={paused}
        useThemeColors={useThemeColors}
        inverse={inverse}
        scrim={scrim}
        scrimColor={useThemeColors && inverse ? "var(--foreground)" : undefined}
        {...effect}
      />
    </section>
  )
}

export const DitherCanvas = (args: Args & Record<string, unknown>) => <Scene {...args} Background={DitherCanvasBackground} />
DitherCanvas.argTypes = { pixelSize: { control: { type: "range", min: 1, max: 8, step: 1 } }, speed: { control: { type: "range", min: 0, max: 3, step: 0.1 } }, pointerStrength: { control: { type: "range", min: 0, max: 3, step: 0.1 } } }
DitherCanvas.args = { pixelSize: 3, speed: 1, pointerStrength: 1 }

export const PatternWaves = (args: Args & Record<string, unknown>) => <Scene {...args} Background={PatternWavesBackground} />
PatternWaves.argTypes = { speed: { control: { type: "range", min: 0, max: 2, step: 0.05 } }, scale: { control: { type: "range", min: 0.5, max: 3, step: 0.1 } }, spacing: { control: { type: "range", min: 6, max: 20, step: 1 } } }

export const Topography = (args: Args & Record<string, unknown>) => <Scene {...args} Background={TopographyBackground} />
Topography.argTypes = { speed: { control: { type: "range", min: 0, max: 1, step: 0.05 } }, lineCount: { control: { type: "range", min: 8, max: 48, step: 1 } }, glow: { control: { type: "range", min: 0, max: 2, step: 0.1 } } }
Topography.args = { speed: 0.25, lineCount: 22, glow: 0.6 }

export const AcidSquares = (args: Args & Record<string, unknown>) => <Scene {...args} Background={AcidSquaresBackground} />
AcidSquares.argTypes = { speed: { control: { type: "range", min: 0, max: 2, step: 0.05 } }, tileSize: { control: { type: "range", min: 0.5, max: 2, step: 0.1 } }, bulge: { control: { type: "range", min: 0, max: 1, step: 0.05 } } }
AcidSquares.args = { speed: 0.6, tileSize: 1, bulge: 0.3 }

export const Ferrofluid = (args: Args & Record<string, unknown>) => <Scene {...args} Background={FerrofluidBackground} />
Ferrofluid.argTypes = { speed: { control: { type: "range", min: 0, max: 2, step: 0.05 } }, spikeHeight: { control: { type: "range", min: 0, max: 2, step: 0.1 } }, turbulence: { control: { type: "range", min: 0, max: 2, step: 0.1 } } }
Ferrofluid.args = { speed: 0.5, spikeHeight: 1, turbulence: 1 }

export const Prism = (args: Args & Record<string, unknown>) => <Scene {...args} Background={PrismBackground} />
Prism.argTypes = { glow: { control: { type: "range", min: 0, max: 3, step: 0.1 } }, timeScale: { control: { type: "range", min: 0, max: 2, step: 0.05 } }, noise: { control: { type: "range", min: 0, max: 1, step: 0.05 } } }
Prism.args = { glow: 1, timeScale: 0.5, noise: 0 }

export const Lightning = (args: Args & Record<string, unknown>) => <Scene {...args} Background={LightningBackground} />
Lightning.argTypes = { speed: { control: { type: "range", min: 0, max: 3, step: 0.1 } }, intensity: { control: { type: "range", min: 0, max: 3, step: 0.1 } }, bolts: { control: { type: "range", min: 1, max: 4, step: 1 } } }
Lightning.args = { speed: 1, intensity: 1, bolts: 1 }

export const DotField = (args: Args & Record<string, unknown>) => <Scene {...args} Background={DotFieldBackground} />
DotField.argTypes = { dotSpacing: { control: { type: "range", min: 8, max: 32, step: 1 } }, bulgeStrength: { control: { type: "range", min: 0, max: 2, step: 0.1 } }, waveAmplitude: { control: { type: "range", min: 0, max: 2, step: 0.1 } }, sparkle: { control: "boolean" } }
DotField.args = { dotSpacing: 14, bulgeStrength: 0.6, waveAmplitude: 0, sparkle: true }

export const Iridescence = (args: Args & Record<string, unknown>) => <Scene {...args} Background={IridescenceBackground} />
Iridescence.argTypes = { speed: { control: { type: "range", min: 0, max: 3, step: 0.1 } }, amplitude: { control: { type: "range", min: 0, max: 0.5, step: 0.01 } }, themedSpectrum: { control: { type: "range", min: 0, max: 1, step: 0.05 } } }
Iridescence.args = { speed: 1, amplitude: 0.1, themedSpectrum: 0.45 }

export const Waves = (args: Args & Record<string, unknown>) => <Scene {...args} Background={WavesBackground} />
Waves.argTypes = { speed: { control: { type: "range", min: 0, max: 3, step: 0.1 } }, amplitude: { control: { type: "range", min: 0, max: 80, step: 1 } }, spacing: { control: { type: "range", min: 6, max: 30, step: 1 } } }
Waves.args = { speed: 1, amplitude: 32, spacing: 10 }

export const MagnetLines = (args: Args & Record<string, unknown>) => <Scene {...args} Background={MagnetLinesBackground} />
MagnetLines.argTypes = { spacing: { control: { type: "range", min: 16, max: 60, step: 1 } }, baseAngle: { control: { type: "range", min: -90, max: 90, step: 1 } }, idle: { control: "boolean" } }
MagnetLines.args = { spacing: 30, baseAngle: -10, idle: true }

export const LetterGlitch = (args: Args & Record<string, unknown>) => <Scene {...args} Background={LetterGlitchBackground} />
LetterGlitch.argTypes = { speed: { control: { type: "range", min: 0, max: 3, step: 0.1 } }, glitchAmount: { control: { type: "range", min: 0, max: 1, step: 0.05 } }, density: { control: { type: "range", min: 0.2, max: 1, step: 0.05 } } }
LetterGlitch.args = { speed: 1, glitchAmount: 0.5, density: 0.9 }

export const LiquidChrome = (args: Args & Record<string, unknown>) => <Scene {...args} Background={LiquidChromeBackground} />
LiquidChrome.argTypes = { speed: { control: { type: "range", min: 0, max: 1, step: 0.05 } }, amplitude: { control: { type: "range", min: 0, max: 1, step: 0.05 } }, thickness: { control: { type: "range", min: 0.2, max: 3, step: 0.1 } } }
LiquidChrome.args = { speed: 0.2, amplitude: 0.3, thickness: 1 }

