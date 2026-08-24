import type { ComponentProps } from "react"
import BreathingTextImpl from "./breathing-text"

export default { title: "Animation/Breathing Text", component: BreathingTextImpl }

export const BreathingText = (args: ComponentProps<typeof BreathingTextImpl>) => <BreathingTextImpl {...args} />
