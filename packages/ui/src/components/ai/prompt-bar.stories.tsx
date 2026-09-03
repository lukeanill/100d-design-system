import type { ComponentProps } from "react"
import { PromptBar as PromptBarImpl } from "./prompt-bar"

export default {
  title: "Components/AI/Prompt Bar",
  component: PromptBarImpl,
  argTypes: {
    "appearance.variant": { control: "select", options: ["Rounded", "Pill"] },
    "appearance.demo": { control: "boolean" },
    "appearance.tall": { control: "boolean" },
    "data.placeholder": { control: "text" },
    actions: { table: { disable: true } },
  },
  args: {
    appearance: { demo: true, tall: false, variant: "Rounded" },
  },
}

export const PromptBar = (args: ComponentProps<typeof PromptBarImpl>) => <PromptBarImpl {...args} />
