import type { ComponentProps } from "react"
import { RollingText as RollingTextImpl } from "./rolling"

export default {
  title: "Animation/Text/Reveal/Rolling",
  component: RollingTextImpl,
  argTypes: {
    delay: { control: { type: "range", min: 0, max: 2000, step: 100 } },
    transition: { control: false },
  },
  args: { text: "Rolling text", delay: 0 },
}

export const RollingTexts = (args: ComponentProps<typeof RollingTextImpl>) => <RollingTextImpl {...args} />
