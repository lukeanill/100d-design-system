import background from "./tokens-glass-bg.mp4"
import { GLASS_EDGE, LiquidGlass, glassProps, glassTones, glassWeights, type GlassTone, type GlassWeight } from "./liquid-glass"

/**
 * The glass sheet from the Figma file (100DS, "Glass"): three weights (Soft,
 * Medium, Heavy) across four tones (Clear, Light, Dark, Tinted).
 *
 * Each tile is a refraction glass (see liquid-glass.tsx): an SVG displacement
 * filter bends the background along the rim and a specular highlight catches
 * the edge. The weight sets how frosted and how thick the glass is; the tone is
 * the fill. SVG backdrop filters are Chromium-only; other browsers get a plain
 * blur.
 */
export default {
  title: "Tokens/Glass",
  parameters: { layout: "fullscreen" },
  argTypes: {
    edge: {
      control: { type: "range", min: 0, max: 1, step: 0.05 },
      description: "How strongly the rim catches the light: 0 is none, 1 is the Glass sheet.",
    },
  },
  args: { edge: GLASS_EDGE },
}

const Background = () => (
  <video
    src={background}
    autoPlay
    loop
    muted
    playsInline
    aria-hidden="true"
    style={{ position: "absolute", inset: 0, zIndex: -1, width: "100%", height: "100%", objectFit: "cover" }}
  />
)

export const Glass = ({ edge }: { edge: number }) => (
  <section
    style={{
      position: "relative",
      isolation: "isolate",
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: "24px clamp(12px, 4.8vw, 80px)",
      alignContent: "center",
      minHeight: "100vh",
      padding: "76px clamp(16px, 7.25vw, 120px)",
      overflow: "hidden",
    }}
  >
    <Background />
    {glassWeights.flatMap((weight) =>
      glassTones.map((tone) => (
        <LiquidGlass
          key={`${weight}-${tone}`}
          radius={16}
          edge={edge}
          {...glassProps(weight, tone)}
          style={{ height: 241 }}
        >
          <div
            className="text-body-small"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              height: "100%",
              color: "white",
              textTransform: "capitalize",
            }}
          >
            <span>{tone}</span>
            <span style={{ opacity: 0.5 }}>{weight}</span>
          </div>
        </LiquidGlass>
      ))
    )}
  </section>
)

type PlaygroundArgs = { weight: GlassWeight; tone: GlassTone; edge: number; radius: number; width: number; height: number }

/** One tile, big, with every knob: for finding the right weight, tone and rim before using it. */
export const Playground = ({ weight, tone, edge, radius, width, height }: PlaygroundArgs) => (
  <section
    style={{
      position: "relative",
      isolation: "isolate",
      display: "grid",
      placeItems: "center",
      minHeight: "100vh",
      overflow: "hidden",
    }}
  >
    <Background />
    <LiquidGlass radius={radius} edge={edge} {...glassProps(weight, tone)} style={{ width, height }}>
      <div
        className="text-body-small"
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: "100%", color: "white", textTransform: "capitalize" }}
      >
        <span>{tone}</span>
        <span style={{ opacity: 0.5 }}>{weight}</span>
      </div>
    </LiquidGlass>
  </section>
)

Playground.argTypes = {
  weight: { control: "inline-radio", options: glassWeights },
  tone: { control: "inline-radio", options: glassTones },
  radius: { control: { type: "range", min: 0, max: 64, step: 1 } },
  width: { control: { type: "range", min: 120, max: 720, step: 10 } },
  height: { control: { type: "range", min: 80, max: 480, step: 10 } },
}
Playground.args = { weight: "soft", tone: "clear", edge: GLASS_EDGE, radius: 16, width: 320, height: 380 }
