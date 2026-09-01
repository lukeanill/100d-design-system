import { useRef } from "react"
import type { ComponentProps } from "react"
import VariableFontAndCursorImpl from "./variable-font-and-cursor"

export default {
  title: "Animation/Text/Hover/Variable Font And Cursor",
  component: VariableFontAndCursorImpl,
  argTypes: {
    children: { control: "text" },
  },
  args: {
    children: "Move your cursor near this text",
  },
}

export const VariableFontAndCursor = (args: ComponentProps<typeof VariableFontAndCursorImpl>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={containerRef} className="p-8">
      <VariableFontAndCursorImpl
        {...args}
        containerRef={containerRef}
        fontVariationMapping={{
          x: { name: "wght", min: 400, max: 900 },
          y: { name: "slnt", min: 0, max: -10 },
        }}
      />
    </div>
  )
}
