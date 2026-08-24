import type { ComponentProps } from "react"
import { Blur as BlurImpl } from "./blur"

export default { title: "Animation/Blur Effects", component: BlurImpl }

export const BlurEffects = (args: ComponentProps<typeof BlurImpl>) => <BlurImpl {...args} />
