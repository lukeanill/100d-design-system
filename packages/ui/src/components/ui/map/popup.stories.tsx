import type { ComponentProps } from "react"
import { MapPopup as MapPopupImpl } from "./popup"

export default { title: "Map/Popup", component: MapPopupImpl }

export const Popup = (args: ComponentProps<typeof MapPopupImpl>) => <MapPopupImpl {...args} />
