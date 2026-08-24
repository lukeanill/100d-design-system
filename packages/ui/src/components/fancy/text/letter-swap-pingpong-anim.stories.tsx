import type { ComponentProps } from "react"
import LetterSwapPingPongImpl from "./letter-swap-pingpong-anim"

export default { title: "Animation/Letter Swap Pingpong Anim", component: LetterSwapPingPongImpl, args: { label: "Hover me" } }

export const LetterSwapPingpongAnim = (args: ComponentProps<typeof LetterSwapPingPongImpl>) => <LetterSwapPingPongImpl {...args} />
