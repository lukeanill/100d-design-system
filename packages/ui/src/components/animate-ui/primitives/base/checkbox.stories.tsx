import type { ComponentProps } from "react"
import { Checkbox as CheckboxImpl } from "./checkbox"

export default { title: "Animation/Checkbox Base", component: CheckboxImpl }

export const CheckboxBase = (args: ComponentProps<typeof CheckboxImpl>) => <CheckboxImpl {...args} />
