import type { ComponentProps } from "react"
import { MapSteam as MapSteamImpl } from "./steam"

export default { title: "Map/Steam", component: MapSteamImpl }

export const Steam = (args: ComponentProps<typeof MapSteamImpl>) => <MapSteamImpl {...args} />
