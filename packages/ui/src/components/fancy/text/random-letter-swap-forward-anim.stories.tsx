import type { ComponentProps } from "react"
import RandomLetterSwapForwardImpl from "./random-letter-swap-forward-anim"

export default { title: "Animation/Random Letter Swap Forward Anim", component: RandomLetterSwapForwardImpl }

export const RandomLetterSwapForwardAnim = (args: ComponentProps<typeof RandomLetterSwapForwardImpl>) => <RandomLetterSwapForwardImpl {...args} />
