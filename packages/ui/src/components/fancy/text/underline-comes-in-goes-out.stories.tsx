import type { ComponentProps } from "react"
import ComesInGoesOutUnderlineImpl from "./underline-comes-in-goes-out"

export default { title: "Animation/Underline Comes In Goes Out", component: ComesInGoesOutUnderlineImpl }

export const UnderlineComesInGoesOut = (args: ComponentProps<typeof ComesInGoesOutUnderlineImpl>) => <ComesInGoesOutUnderlineImpl {...args} />
