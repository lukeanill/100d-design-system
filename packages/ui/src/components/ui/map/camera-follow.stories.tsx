import type { ComponentProps } from "react"
import { MapCameraFollow as MapCameraFollowImpl } from "./camera-follow"

export default { title: "Map/Camera Follow", component: MapCameraFollowImpl }

export const CameraFollow = (args: ComponentProps<typeof MapCameraFollowImpl>) => <MapCameraFollowImpl {...args} />
