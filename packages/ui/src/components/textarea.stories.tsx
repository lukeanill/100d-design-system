import type { ComponentProps } from "react"
import { Textarea as TextareaImpl } from "./textarea"

export default {
  title: "Components/Inputs/Textarea",
  component: TextareaImpl,
  args: { placeholder: "Type your message here.", rows: 4 },
}

export const Textarea = (args: ComponentProps<typeof TextareaImpl>) => <TextareaImpl {...args} />
