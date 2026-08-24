import type { ComponentProps } from "react"
import { PanelTop as PanelTopImpl } from "./panel-top"

export default { title: "Icon/Panel Top", component: PanelTopImpl }

export const PanelTop = (args: ComponentProps<typeof PanelTopImpl>) => <PanelTopImpl {...args} />
