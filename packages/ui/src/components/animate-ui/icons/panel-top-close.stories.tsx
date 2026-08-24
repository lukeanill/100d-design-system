import type { ComponentProps } from "react"
import { PanelTopClose as PanelTopCloseImpl } from "./panel-top-close"

export default { title: "Icon/Panel Top Close", component: PanelTopCloseImpl }

export const PanelTopClose = (args: ComponentProps<typeof PanelTopCloseImpl>) => <PanelTopCloseImpl {...args} />
