import type { ComponentProps } from "react"
import { Link2 as Link2Impl } from "./link-2"

export default {
  title: "Icon/Link 2",
  component: Link2Impl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Link2 = (args: ComponentProps<typeof Link2Impl>) => <Link2Impl {...args} />
