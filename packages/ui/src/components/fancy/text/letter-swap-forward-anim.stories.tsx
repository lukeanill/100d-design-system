import type { ComponentProps } from "react"
import LetterSwapForwardImpl from "./letter-swap-forward-anim"

export default { title: "Animation/Letter Swap Forward Anim", component: LetterSwapForwardImpl, args: { label: "Hover me" } }

export const LetterSwapForwardAnim = (args: ComponentProps<typeof LetterSwapForwardImpl>) => <LetterSwapForwardImpl {...args} />
