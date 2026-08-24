import type { ComponentProps } from "react"
import { PanelRightClose as PanelRightCloseImpl } from "./panel-right-close"

export default { title: "Icon/Panel Right Close", component: PanelRightCloseImpl }

export const PanelRightClose = (args: ComponentProps<typeof PanelRightCloseImpl>) => <PanelRightCloseImpl {...args} />
