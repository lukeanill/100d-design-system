import type { ComponentProps } from "react"
import { Field as FieldImpl } from "./field"

export default { title: "Components/Field", component: FieldImpl }

export const Field = (args: ComponentProps<typeof FieldImpl>) => <FieldImpl {...args} />
