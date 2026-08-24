import type { ComponentProps } from "react"
import { TypingText as TypingTextImpl } from "./typing"

export default { title: "Animation/Typing (Texts)", component: TypingTextImpl }

export const Typing = (args: ComponentProps<typeof TypingTextImpl>) => <TypingTextImpl {...args} />
