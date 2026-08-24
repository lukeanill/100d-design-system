import type { ComponentProps } from "react"
import { Paintbrush as PaintbrushImpl } from "./paintbrush"

export default { title: "Icon/Paintbrush", component: PaintbrushImpl }

export const Paintbrush = (args: ComponentProps<typeof PaintbrushImpl>) => <PaintbrushImpl {...args} />
