import type { ComponentProps } from "react"
import { SplittingText as SplittingTextImpl } from "./splitting"

export default {
  title: "Animation/Text/Reveal/Splitting",
  component: SplittingTextImpl,
  argTypes: {
    type: { control: "select", options: ["chars", "words"] },
    stagger: { control: { type: "range", min: 0.01, max: 0.5, step: 0.01 } },
    delay: { control: { type: "range", min: 0, max: 2000, step: 100 } },
    disableAnimation: { control: "boolean" },
    transition: { control: false },
  },
  args: { text: "Splitting text reveals itself", type: "chars", delay: 0, disableAnimation: false },
}

export const SplittingTexts = (args: ComponentProps<typeof SplittingTextImpl>) => <SplittingTextImpl {...args} />
