import { Slot as SlotImpl } from "./slot"

export default { title: "Animation/Slot Animate", component: SlotImpl }

export const SlotAnimate = () => (
  <SlotImpl>
    <span>Slot content</span>
  </SlotImpl>
)
