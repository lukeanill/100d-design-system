import type { ComponentProps } from "react"
import { ThinkingState as ThinkingStateImpl } from "./thinking-state"

export default {
  title: "Components/AI/Thinking State",
  component: ThinkingStateImpl,
  argTypes: {
    "appearance.variant": { control: "select", options: ["Steps", "Reasoning", "Search", "Coding"] },
    onSettled: { table: { disable: true } },
  },
  args: {
    appearance: { variant: "Steps" },
  },
}

export const ThinkingState = (args: ComponentProps<typeof ThinkingStateImpl>) => <ThinkingStateImpl {...args} />
