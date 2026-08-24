import type { ComponentProps } from "react"
import { PanelLeftClose as PanelLeftCloseImpl } from "./panel-left-close"

export default { title: "Icon/Panel Left Close", component: PanelLeftCloseImpl }

export const PanelLeftClose = (args: ComponentProps<typeof PanelLeftCloseImpl>) => <PanelLeftCloseImpl {...args} />
