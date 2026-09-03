import type { ComponentProps } from "react"
import { LoadingState as LoadingStateImpl } from "./loading-state"

export default {
  title: "Components/AI/Loading State",
  component: LoadingStateImpl,
  argTypes: {
    "appearance.variant": { control: "select", options: ["Drive", "Dots", "Orbit"] },
    "data.label": { control: "text" },
  },
  args: {
    appearance: { variant: "Drive" },
    data: { label: "Churning" },
  },
}

export const LoadingState = (args: ComponentProps<typeof LoadingStateImpl>) => <LoadingStateImpl {...args} />
