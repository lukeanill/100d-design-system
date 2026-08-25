import type { ComponentProps } from "react"
import { pathClassName as pathClassNameImpl } from "./icon"

export default {
  title: "Icon/Icon",
  component: pathClassNameImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Icon = (args: ComponentProps<typeof pathClassNameImpl>) => <pathClassNameImpl {...args} />
