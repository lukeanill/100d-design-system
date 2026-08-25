import type { ComponentProps } from "react"
import { Link as LinkImpl } from "./link"

export default {
  title: "Icon/Link",
  component: LinkImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Link = (args: ComponentProps<typeof LinkImpl>) => <LinkImpl {...args} />
