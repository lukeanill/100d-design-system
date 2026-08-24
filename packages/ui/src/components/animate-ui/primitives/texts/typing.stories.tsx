import type { ComponentProps } from "react"
import { TypingText as TypingTextImpl } from "./typing"

export default { title: "Animation/Typing Texts", component: TypingTextImpl }

export const TypingTexts = (args: ComponentProps<typeof TypingTextImpl>) => <TypingTextImpl {...args} />
