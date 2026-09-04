import type { ComponentProps } from "react"
import { FluidTabs as FluidTabsImpl } from "./fluid-tabs"

export default {
  title: "Components/Navigation/Fluid Tabs",
  component: FluidTabsImpl,
  argTypes: {
    defaultActive: { control: "select", options: ["accounts", "deposits", "funds"] },
    tabs: { table: { disable: true } },
    onChange: { table: { disable: true } },
  },
  args: {
    defaultActive: "accounts",
  },
}

export const FluidTabs = (args: ComponentProps<typeof FluidTabsImpl>) => <FluidTabsImpl {...args} />
