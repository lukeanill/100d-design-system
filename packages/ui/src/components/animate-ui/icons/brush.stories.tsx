import type { ComponentProps } from "react"
import { Brush as BrushImpl } from "./brush"

export default { title: "Icon/Brush", component: BrushImpl }

export const Brush = (args: ComponentProps<typeof BrushImpl>) => <BrushImpl {...args} />
