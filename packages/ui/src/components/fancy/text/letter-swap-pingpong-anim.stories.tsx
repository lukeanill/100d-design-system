import type { ComponentProps } from "react"
import LetterSwapPingPongImpl from "./letter-swap-pingpong-anim"

export default { title: "Animation/Letter Swap Pingpong Anim", component: LetterSwapPingPongImpl }

export const LetterSwapPingpongAnim = (args: ComponentProps<typeof LetterSwapPingPongImpl>) => <LetterSwapPingPongImpl {...args} />
