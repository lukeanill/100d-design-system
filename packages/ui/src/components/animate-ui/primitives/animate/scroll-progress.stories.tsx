import type { ComponentProps } from "react"
import { ScrollProgress as ScrollProgressImpl } from "./scroll-progress"

export default { title: "Animation/Scroll Progress Animate", component: ScrollProgressImpl }

export const ScrollProgressAnimate = (args: ComponentProps<typeof ScrollProgressImpl>) => <ScrollProgressImpl {...args} />
