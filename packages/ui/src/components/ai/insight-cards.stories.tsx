import type { ComponentProps } from "react"
import { InsightCards as InsightCardsImpl } from "./insight-cards"

export default {
  title: "Components/AI/Insight Cards",
  component: InsightCardsImpl,
  argTypes: {
    "labels.title": { control: "text" },
    "data.pages": { table: { disable: true } },
  },
  args: {
    labels: { title: "Insights" },
  },
}

export const InsightCards = (args: ComponentProps<typeof InsightCardsImpl>) => <InsightCardsImpl {...args} />
