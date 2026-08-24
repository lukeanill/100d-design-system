import type { ComponentProps } from "react"
import { Crop as CropImpl } from "./crop"

export default { title: "Icon/Crop", component: CropImpl }

export const Crop = (args: ComponentProps<typeof CropImpl>) => <CropImpl {...args} />
