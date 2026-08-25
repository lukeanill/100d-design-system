import type { ComponentProps } from "react"
import { PanelTop as PanelTopImpl } from "./panel-top"

export default {
  title: "Icon/Panel Top",
  component: PanelTopImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const PanelTop = (args: ComponentProps<typeof PanelTopImpl>) => <PanelTopImpl {...args} />
