import type { ComponentProps } from "react"
import TypewriterImpl from "./typewriter"

export default { title: "Animation/Typewriter", component: TypewriterImpl }

export const Typewriter = (args: ComponentProps<typeof TypewriterImpl>) => <TypewriterImpl {...args} />
