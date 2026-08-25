import type { ComponentProps } from "react"
import { Airplay as AirplayImpl } from "./airplay"

export default {
  title: "Icon/Airplay",
  component: AirplayImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Airplay = (args: ComponentProps<typeof AirplayImpl>) => <AirplayImpl {...args} />
