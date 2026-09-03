import type { ComponentProps } from "react"
import { ContextCards as ContextCardsImpl } from "./context-cards"

export default {
  title: "Components/AI/Context Cards",
  component: ContextCardsImpl,
  argTypes: {
    "labels.header": { control: "text" },
    "labels.count": { control: "text" },
    "data.chunks": { table: { disable: true } },
  },
  args: {
    labels: { count: "32", header: "All chunks" },
  },
}

export const ContextCards = (args: ComponentProps<typeof ContextCardsImpl>) => <ContextCardsImpl {...args} />
