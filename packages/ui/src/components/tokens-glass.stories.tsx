import background from "./tokens-glass-bg.mp4"
import { LiquidGlass, glassProps, glassTones, glassWeights } from "./liquid-glass"

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
    {glassWeights.flatMap((weight) =>
      glassTones.map((tone) => (
        <LiquidGlass
          key={`${weight}-${tone}`}
          radius={16}
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
