import type { ComponentProps } from "react"
import { Pause as PauseImpl } from "./pause"

export default {
  title: "Icon/Pause",
  component: PauseImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Pause = (args: ComponentProps<typeof PauseImpl>) => <PauseImpl {...args} />
