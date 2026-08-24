import type { ComponentProps } from "react"
import { VolumeOff as VolumeOffImpl } from "./volume-off"

export default { title: "Icon/Volume Off", component: VolumeOffImpl }

export const VolumeOff = (args: ComponentProps<typeof VolumeOffImpl>) => <VolumeOffImpl {...args} />
