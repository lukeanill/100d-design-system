import type { ComponentProps } from "react"
import { PanelBottom as PanelBottomImpl } from "./panel-bottom"

export default {
  title: "Icon/Panel Bottom",
  component: PanelBottomImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PanelBottom = (args: ComponentProps<typeof PanelBottomImpl>) => <PanelBottomImpl {...args} />
