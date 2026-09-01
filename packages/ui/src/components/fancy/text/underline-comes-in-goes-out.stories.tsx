import type { ComponentProps } from "react"
import ComesInGoesOutUnderlineImpl from "./underline-comes-in-goes-out"

export default {
  title: "Animation/Text/Underlines/Underline Comes In Goes Out",
  component: ComesInGoesOutUnderlineImpl,
  argTypes: { direction: { control: "select", options: ["left", "right"] } },
  args: { children: "Hover me", direction: "left" },
}

export const UnderlineComesInGoesOut = (args: ComponentProps<typeof ComesInGoesOutUnderlineImpl>) => <ComesInGoesOutUnderlineImpl {...args} />
