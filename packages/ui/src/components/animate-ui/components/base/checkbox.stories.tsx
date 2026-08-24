import type { ComponentProps } from "react"
import { Checkbox as CheckboxImpl } from "./checkbox"

export default { title: "Components/Checkbox", component: CheckboxImpl }

export const Checkbox = (args: ComponentProps<typeof CheckboxImpl>) => <CheckboxImpl {...args} />
