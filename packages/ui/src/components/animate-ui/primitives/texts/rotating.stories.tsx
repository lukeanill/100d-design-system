import type { ComponentProps } from "react"
import { RotatingTextContainer as RotatingTextContainerImpl } from "./rotating"

export default { title: "Animation/Rotating (Texts)", component: RotatingTextContainerImpl }

export const Rotating = (args: ComponentProps<typeof RotatingTextContainerImpl>) => <RotatingTextContainerImpl {...args} />
