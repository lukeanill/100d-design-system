import type { ComponentProps } from "react"
import CenterUnderlineImpl from "./underline-center"

export default {
  title: "Animation/Text/Underlines/Underline Center",
  component: CenterUnderlineImpl,
  argTypes: {
    children: { control: "text" },
    underlineHeightRatio: { control: { type: "range", min: 0.02, max: 0.3, step: 0.01 } },
    underlinePaddingRatio: { control: { type: "range", min: 0, max: 0.05, step: 0.005 } },
  },
  args: {
    children: "Hover me",
    underlineHeightRatio: 0.1,
    underlinePaddingRatio: 0.01,
  },
}

export const UnderlineCenter = (args: ComponentProps<typeof CenterUnderlineImpl>) => <CenterUnderlineImpl {...args} />
