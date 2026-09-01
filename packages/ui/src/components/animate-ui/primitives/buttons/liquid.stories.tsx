import type { ComponentProps } from "react"
import { LiquidButton as LiquidButtonImpl } from "./liquid"

export default {
  title: "Animation/Liquid Buttons",
  tags: ["!dev"],
  component: LiquidButtonImpl,
  argTypes: {
    delay: { control: "text" },
    fillHeight: { control: "text" },
    hoverScale: { control: { type: "range", min: 0.8, max: 1.5, step: 0.05 } },
    tapScale: { control: { type: "range", min: 0.5, max: 1, step: 0.05 } },
    asChild: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  args: {
    delay: "0.3s",
    fillHeight: "3px",
    hoverScale: 1.05,
    tapScale: 0.95,
    children: "Liquid Button",
    style: {
      padding: "8px 16px",
      borderRadius: 6,
      border: "1px solid #2563eb",
      color: "#2563eb",
      cursor: "pointer",
      "--liquid-button-color": "#2563eb",
      "--liquid-button-background-color": "transparent",
    },
  },
}

export const LiquidButtons = (args: ComponentProps<typeof LiquidButtonImpl>) => <LiquidButtonImpl {...args} />
