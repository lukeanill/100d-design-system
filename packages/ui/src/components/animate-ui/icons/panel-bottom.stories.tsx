import type { ComponentProps } from "react"
import { PanelBottom as PanelBottomImpl } from "./panel-bottom"

export default { title: "Icon/Panel Bottom", component: PanelBottomImpl }

export const PanelBottom = (args: ComponentProps<typeof PanelBottomImpl>) => <PanelBottomImpl {...args} />
