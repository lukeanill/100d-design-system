import type { ComponentProps } from "react"
import {
  Tooltip as TooltipImpl,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from "./tooltip"

export default {
  title: "Animation/Tooltip Animate",
  tags: ["!dev"],
  component: TooltipImpl,
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
    sideOffset: { control: { type: "range", min: 0, max: 40, step: 1 } },
    alignOffset: { control: { type: "range", min: -40, max: 40, step: 1 } },
    children: { table: { disable: true } },
  },
  args: {
    side: "top",
    sideOffset: 8,
    align: "center",
    alignOffset: 0,
  },
}

export const TooltipAnimate = (args: ComponentProps<typeof TooltipImpl>) => (
  <TooltipProvider>
    <TooltipImpl {...args}>
      <TooltipTrigger
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "1px solid #d1d5db",
          fontSize: 14,
          cursor: "default",
          display: "inline-block",
        }}
      >
        Hover me
      </TooltipTrigger>
      <TooltipContent
        style={{
          padding: "4px 8px",
          borderRadius: 6,
          backgroundColor: "#111827",
          color: "white",
          fontSize: 12,
        }}
      >
        Tooltip content
        <TooltipArrow style={{ fill: "#111827" }} />
      </TooltipContent>
    </TooltipImpl>
  </TooltipProvider>
)
