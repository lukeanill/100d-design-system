import type { ComponentProps } from "react"
import { PanelRightOpen as PanelRightOpenImpl } from "./panel-right-open"

export default { title: "Icon/Panel Right Open", component: PanelRightOpenImpl }

export const PanelRightOpen = (args: ComponentProps<typeof PanelRightOpenImpl>) => <PanelRightOpenImpl {...args} />
