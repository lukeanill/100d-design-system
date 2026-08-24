import type { ComponentProps } from "react"
import { Shine as ShineImpl } from "./shine"

export default { title: "Animation/Shine (Effects)", component: ShineImpl }

export const Shine = (args: ComponentProps<typeof ShineImpl>) => <ShineImpl {...args} />
