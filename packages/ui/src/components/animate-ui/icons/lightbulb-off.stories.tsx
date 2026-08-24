import type { ComponentProps } from "react"
import { LightbulbOff as LightbulbOffImpl } from "./lightbulb-off"

export default { title: "Icon/Lightbulb Off", component: LightbulbOffImpl }

export const LightbulbOff = (args: ComponentProps<typeof LightbulbOffImpl>) => <LightbulbOffImpl {...args} />
