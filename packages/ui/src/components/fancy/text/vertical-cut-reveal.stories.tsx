import type { ComponentProps } from "react"
import VerticalCutRevealImpl from "./vertical-cut-reveal"

export default {
  title: "Animation/Text/Reveal/Vertical Cut Reveal",
  component: VerticalCutRevealImpl,
  argTypes: {
    children: { control: "text" },
    splitBy: { control: "select", options: ["words", "characters", "lines"] },
    staggerFrom: { control: "select", options: ["first", "last", "center", "random"] },
    staggerDuration: { control: { type: "range", min: 0, max: 0.5, step: 0.02 } },
    reverse: { control: "boolean" },
    autoStart: { control: "boolean" },
  },
  args: {
    children: "Design with intention",
    splitBy: "words",
    staggerFrom: "first",
    staggerDuration: 0.2,
    reverse: false,
    autoStart: true,
  },
}

export const VerticalCutReveal = (args: ComponentProps<typeof VerticalCutRevealImpl>) => <VerticalCutRevealImpl {...args} />
