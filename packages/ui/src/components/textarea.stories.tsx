import type { ComponentProps } from "react"
import { Textarea as TextareaImpl } from "./textarea"

export default { title: "Components/Textarea", component: TextareaImpl }

export const Textarea = (args: ComponentProps<typeof TextareaImpl>) => <TextareaImpl {...args} />
