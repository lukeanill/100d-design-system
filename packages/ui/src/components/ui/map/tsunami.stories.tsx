import type { ComponentProps } from "react"
import { MapTsunami as MapTsunamiImpl } from "./tsunami"

export default { title: "Map/Tsunami", component: MapTsunamiImpl, args: { origin: [-122.42, 37.77], target: [-122.40, 37.79] } }

export const Tsunami = (args: ComponentProps<typeof MapTsunamiImpl>) => <MapTsunamiImpl {...args} />
