import type { ComponentProps } from "react"
import { Lightbulb as LightbulbImpl } from "./lightbulb"

export default { title: "Icon/Lightbulb", component: LightbulbImpl }

export const Lightbulb = (args: ComponentProps<typeof LightbulbImpl>) => <LightbulbImpl {...args} />
