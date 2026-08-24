import type { ComponentProps } from "react"
import { PanelBottomClose as PanelBottomCloseImpl } from "./panel-bottom-close"

export default { title: "Icon/Panel Bottom Close", component: PanelBottomCloseImpl }

export const PanelBottomClose = (args: ComponentProps<typeof PanelBottomCloseImpl>) => <PanelBottomCloseImpl {...args} />
