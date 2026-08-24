import type { ComponentProps } from "react"
import { PanelBottomOpen as PanelBottomOpenImpl } from "./panel-bottom-open"

export default { title: "Icon/Panel Bottom Open", component: PanelBottomOpenImpl }

export const PanelBottomOpen = (args: ComponentProps<typeof PanelBottomOpenImpl>) => <PanelBottomOpenImpl {...args} />
