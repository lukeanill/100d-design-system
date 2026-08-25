import type { ComponentProps } from "react"
import CenterUnderlineImpl from "./underline-center"

export default {
  title: "Animation/Underline Center",
  component: CenterUnderlineImpl,
  args: { children: "Hover me" },
}

export const UnderlineCenter = (args: ComponentProps<typeof CenterUnderlineImpl>) => <CenterUnderlineImpl {...args} />
