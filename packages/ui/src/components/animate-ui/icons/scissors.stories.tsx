import type { ComponentProps } from "react"
import { Scissors as ScissorsImpl } from "./scissors"

export default { title: "Icon/Scissors", component: ScissorsImpl }

export const Scissors = (args: ComponentProps<typeof ScissorsImpl>) => <ScissorsImpl {...args} />
