import type { ComponentProps } from "react"
import { MapControls as MapControlsImpl } from "./controls"

export default { title: "Map/Controls", component: MapControlsImpl }

export const Controls = (args: ComponentProps<typeof MapControlsImpl>) => <MapControlsImpl {...args} />
