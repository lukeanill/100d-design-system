import type { ComponentProps } from "react"
import { PanelLeft as PanelLeftImpl } from "./panel-left"

export default { title: "Icon/Panel Left", component: PanelLeftImpl }

export const PanelLeft = (args: ComponentProps<typeof PanelLeftImpl>) => <PanelLeftImpl {...args} />
