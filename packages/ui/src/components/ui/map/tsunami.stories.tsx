import type { ComponentProps } from "react"
import { MapTsunami as MapTsunamiImpl } from "./tsunami"

export default { title: "Map/Tsunami", component: MapTsunamiImpl }

export const Tsunami = (args: ComponentProps<typeof MapTsunamiImpl>) => <MapTsunamiImpl {...args} />
