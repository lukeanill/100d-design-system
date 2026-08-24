import type { ComponentProps } from "react"
import { Layers as LayersImpl } from "./layers"

export default { title: "Icon/Layers", component: LayersImpl }

export const Layers = (args: ComponentProps<typeof LayersImpl>) => <LayersImpl {...args} />
