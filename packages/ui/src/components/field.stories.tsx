import type { ComponentProps } from "react"
import { Field as FieldImpl, FieldContent, FieldLabel, FieldDescription } from "./field"
import { Input } from "@workspace/ui/components/input"

export default {
  title: "Components/Field",
  component: FieldImpl,
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "responsive"],
    },
  },
  args: { orientation: "vertical" },
}

export const Field = (args: ComponentProps<typeof FieldImpl>) => (
  <FieldImpl {...args}>
    <FieldContent>
      <FieldLabel>Email</FieldLabel>
      <Input placeholder="you@example.com" />
      <FieldDescription>We'll never share your email.</FieldDescription>
    </FieldContent>
  </FieldImpl>
)
