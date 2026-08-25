import type { ComponentProps } from "react"
import VerticalCutRevealImpl from "./vertical-cut-reveal"

export default {
  title: "Animation/Vertical Cut Reveal",
  component: VerticalCutRevealImpl,
  args: { children: "Vertical cut reveal" },
}

export const VerticalCutReveal = (args: ComponentProps<typeof VerticalCutRevealImpl>) => <VerticalCutRevealImpl {...args} />
