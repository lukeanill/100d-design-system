import type { ComponentProps } from "react"
import UnderlineToBackgroundImpl from "./underline-to-background"

export default {
  title: "Animation/Text/Underlines/Underline To Background",
  component: UnderlineToBackgroundImpl,
  argTypes: {
    children: { control: "text" },
    targetTextColor: { control: "color" },
    underlineHeightRatio: { control: { type: "range", min: 0.02, max: 0.3, step: 0.01 } },
    underlinePaddingRatio: { control: { type: "range", min: 0, max: 0.05, step: 0.005 } },
  },
  args: {
    children: "Hover me",
    targetTextColor: "#ffffff",
    underlineHeightRatio: 0.1,
    underlinePaddingRatio: 0.01,
  },
}

export const UnderlineToBackground = (args: ComponentProps<typeof UnderlineToBackgroundImpl>) => <UnderlineToBackgroundImpl {...args} />
