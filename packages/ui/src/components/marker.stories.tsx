import type { ComponentProps } from "react"
import { Marker as MarkerImpl } from "./marker"

export default { title: "Components/Marker", component: MarkerImpl }

export const Marker = (args: ComponentProps<typeof MarkerImpl>) => <MarkerImpl {...args} />
