import type { ComponentProps } from "react"
import { PanelRight as PanelRightImpl } from "./panel-right"

export default { title: "Icon/Panel Right", component: PanelRightImpl }

export const PanelRight = (args: ComponentProps<typeof PanelRightImpl>) => <PanelRightImpl {...args} />
