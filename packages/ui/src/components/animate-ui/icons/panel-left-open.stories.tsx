import type { ComponentProps } from "react"
import { PanelLeftOpen as PanelLeftOpenImpl } from "./panel-left-open"

export default { title: "Icon/Panel Left Open", component: PanelLeftOpenImpl }

export const PanelLeftOpen = (args: ComponentProps<typeof PanelLeftOpenImpl>) => <PanelLeftOpenImpl {...args} />
