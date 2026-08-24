import type { ComponentProps } from "react"
import { Airplay as AirplayImpl } from "./airplay"

export default { title: "Icon/Airplay", component: AirplayImpl }

export const Airplay = (args: ComponentProps<typeof AirplayImpl>) => <AirplayImpl {...args} />
