import type { ComponentProps } from "react"
import { Bell as BellImpl } from "./bell"

export default { title: "Icon/Bell", component: BellImpl }

export const Bell = (args: ComponentProps<typeof BellImpl>) => <BellImpl {...args} />
