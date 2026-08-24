import type { ComponentProps } from "react"
import { PanelTopOpen as PanelTopOpenImpl } from "./panel-top-open"

export default { title: "Icon/Panel Top Open", component: PanelTopOpenImpl }

export const PanelTopOpen = (args: ComponentProps<typeof PanelTopOpenImpl>) => <PanelTopOpenImpl {...args} />
