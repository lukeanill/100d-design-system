import { useRef } from "react"
import type { ComponentProps } from "react"
import VariableFontCursorProximityImpl from "./variable-font-cursor-proximity"

export default {
  title: "Animation/Text/Hover/Variable Font Cursor Proximity",
  component: VariableFontCursorProximityImpl,
  argTypes: {
    children: { control: "text" },
    radius: { control: { type: "range", min: 20, max: 300, step: 10 } },
    falloff: { control: "select", options: ["linear", "exponential", "gaussian"] },
  },
  args: {
    children: "Move your cursor near this text",
    radius: 120,
    falloff: "linear",
  },
}

export const VariableFontCursorProximity = (args: ComponentProps<typeof VariableFontCursorProximityImpl>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={containerRef} className="p-8">
      <VariableFontCursorProximityImpl
        {...args}
        containerRef={containerRef}
        fromFontVariationSettings="'wght' 400, 'slnt' 0"
        toFontVariationSettings="'wght' 900, 'slnt' -10"
      />
    </div>
  )
}
