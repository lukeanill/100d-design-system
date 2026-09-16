import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, fn, userEvent, within } from "storybook/test"
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
    onChange: fn(),
  },
}

export const FluidTabs = (args: ComponentProps<typeof FluidTabsImpl>) => <FluidTabsImpl {...args} />

FluidTabs.play = async ({ args, canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)

  await userEvent.click(canvas.getByRole("button", { name: "Deposits" }))
  await expect(args.onChange).toHaveBeenCalledWith("deposits")
}
