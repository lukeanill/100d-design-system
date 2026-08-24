import type { ComponentProps } from "react"
import { LiquidButton as LiquidButtonImpl } from "./liquid"

export default { title: "Animation/Liquid (Buttons)", component: LiquidButtonImpl }

export const Liquid = (args: ComponentProps<typeof LiquidButtonImpl>) => <LiquidButtonImpl {...args} />
