import type { ComponentProps } from "react"
import { Slide as SlideImpl } from "./slide"

export default { title: "Animation/Slide Effects", component: SlideImpl }

export const SlideEffects = (args: ComponentProps<typeof SlideImpl>) => <SlideImpl {...args} />
