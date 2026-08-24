import type { ComponentProps } from "react"
import { Slot as SlotImpl } from "./slot"

export default { title: "Animation/Slot Animate", component: SlotImpl }

export const SlotAnimate = (args: ComponentProps<typeof SlotImpl>) => <SlotImpl {...args} />
