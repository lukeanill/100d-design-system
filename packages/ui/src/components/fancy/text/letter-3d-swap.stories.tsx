import type { ComponentProps } from "react"
import Letter3DSwapImpl from "./letter-3d-swap"

export default { title: "Animation/Letter 3d Swap", component: Letter3DSwapImpl }

export const Letter3dSwap = (args: ComponentProps<typeof Letter3DSwapImpl>) => <Letter3DSwapImpl {...args} />
