import type { ComponentProps } from "react"
import { MorphingText as MorphingTextImpl } from "./morphing"

export default { title: "Animation/Morphing (Texts)", component: MorphingTextImpl }

export const Morphing = (args: ComponentProps<typeof MorphingTextImpl>) => <MorphingTextImpl {...args} />
