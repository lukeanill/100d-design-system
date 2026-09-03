import type { ComponentProps } from "react"
import { Textarea as TextareaImpl } from "./textarea"

export default {
  title: "Components/Inputs/Textarea",
  component: TextareaImpl,
  argTypes: {
    disabled: { control: "boolean" },
    rows: { control: { type: "number", min: 1, max: 20 } },
    onChange: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  args: { placeholder: "Type your message here.", rows: 4, disabled: false },
}

export const Textarea = (args: ComponentProps<typeof TextareaImpl>) => <TextareaImpl {...args} />
