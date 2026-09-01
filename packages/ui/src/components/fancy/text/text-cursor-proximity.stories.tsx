import { useRef } from "react"
import type { ComponentProps } from "react"
import TextCursorProximityImpl from "./text-cursor-proximity"

export default {
  title: "Animation/Text/Hover/Text Cursor Proximity",
  component: TextCursorProximityImpl,
  argTypes: {
    radius: { control: { type: "range", min: 20, max: 300, step: 10 } },
    falloff: { control: "select", options: ["linear", "exponential", "gaussian"] },
  },
  args: {
    children: "Move your cursor near this text",
    radius: 100,
    falloff: "linear",
  },
}

export const TextCursorProximity = (args: ComponentProps<typeof TextCursorProximityImpl>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={containerRef} className="p-8">
      <TextCursorProximityImpl
        {...args}
        containerRef={containerRef}
        styles={{ scale: { from: 1, to: 1.5 }, opacity: { from: 0.5, to: 1 } }}
      />
    </div>
  )
}
