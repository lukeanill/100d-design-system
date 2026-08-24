import type { ComponentProps } from "react"
import RandomLetterSwapPingPongImpl from "./random-letter-swap-pingpong-anim"

export default { title: "Animation/Random Letter Swap Pingpong Anim", component: RandomLetterSwapPingPongImpl, args: { label: "Hover me" } }

export const RandomLetterSwapPingpongAnim = (args: ComponentProps<typeof RandomLetterSwapPingPongImpl>) => <RandomLetterSwapPingPongImpl {...args} />
