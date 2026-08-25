import type { ComponentProps } from "react"
import { ExternalLink as ExternalLinkImpl } from "./external-link"

export default {
  title: "Icon/External Link",
  component: ExternalLinkImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const ExternalLink = (args: ComponentProps<typeof ExternalLinkImpl>) => <ExternalLinkImpl {...args} />
