import type { ComponentProps } from "react"
import ScrambleInImpl from "./scramble-in"

export default { title: "Animation/Scramble In", component: ScrambleInImpl }

export const ScrambleIn = (args: ComponentProps<typeof ScrambleInImpl>) => <ScrambleInImpl {...args} />
