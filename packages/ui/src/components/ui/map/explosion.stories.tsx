import type { ComponentProps } from "react"
import { MapExplosion as MapExplosionImpl } from "./explosion"

export default { title: "Map/Explosion", component: MapExplosionImpl }

export const Explosion = (args: ComponentProps<typeof MapExplosionImpl>) => <MapExplosionImpl {...args} />
