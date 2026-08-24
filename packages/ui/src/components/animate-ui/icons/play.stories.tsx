import type { ComponentProps } from "react"
import { Play as PlayImpl } from "./play"

export default { title: "Icon/Play", component: PlayImpl }

export const Play = (args: ComponentProps<typeof PlayImpl>) => <PlayImpl {...args} />
