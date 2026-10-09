import background from "./tokens-glass-bg.mp4"
import { LiquidGlass } from "./liquid-glass"

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
const WEIGHTS = {
  soft: { blur: 1, bezel: 12, thickness: 20, scaleRatio: 0.5, specularOpacity: 0.8, fallbackBlur: 2, fill: 0.32, light: 0.16, dark: 0.4 },
  medium: { blur: 5, bezel: 30, thickness: 60, scaleRatio: 0.6, specularOpacity: 0.8, fallbackBlur: 10, fill: 0.4, light: 0.24, dark: 0.48 },
  heavy: { blur: 14, bezel: 28, thickness: 40, scaleRatio: 1, specularOpacity: 0.5, fallbackBlur: 40, fill: 0.48, light: 0.32, dark: 0.48 },
}

type Weight = (typeof WEIGHTS)["soft"]

const TONES = {
  clear: () => undefined,
  light: (w: Weight) => `rgba(255, 255, 255, ${w.light})`,
  dark: (w: Weight) => `rgba(0, 0, 0, ${w.dark})`,
  tinted: (w: Weight) =>
    `linear-gradient(162deg, rgba(50, 205, 216, ${w.fill}) 42.7%, rgba(21, 61, 155, ${w.fill}) 93.1%)`,
}

export default {
  title: "Tokens/Glass",
  parameters: { layout: "fullscreen", controls: { disable: true } },
}

export const Glass = () => (
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
    <video
      src={background}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, zIndex: -1, width: "100%", height: "100%", objectFit: "cover" }}
    />
    {(Object.keys(WEIGHTS) as (keyof typeof WEIGHTS)[]).flatMap((weight) =>
      (Object.keys(TONES) as (keyof typeof TONES)[]).map((tone) => (
        <LiquidGlass
          key={`${weight}-${tone}`}
          radius={16}
          blur={WEIGHTS[weight].blur}
          bezel={WEIGHTS[weight].bezel}
          thickness={WEIGHTS[weight].thickness}
          scaleRatio={WEIGHTS[weight].scaleRatio}
          specularOpacity={WEIGHTS[weight].specularOpacity}
          fallbackBlur={WEIGHTS[weight].fallbackBlur}
          tint={TONES[tone](WEIGHTS[weight])}
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
