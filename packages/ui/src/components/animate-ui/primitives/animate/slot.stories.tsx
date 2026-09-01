import { Slot as SlotImpl } from "./slot"

export default {
  title: "Animation/Slot Animate",
  tags: ["!dev"],
  component: SlotImpl,
  argTypes: {
    children: { table: { disable: true } },
  },
}

export const SlotAnimate = () => (
  <SlotImpl>
    <span>Slot content</span>
  </SlotImpl>
)
