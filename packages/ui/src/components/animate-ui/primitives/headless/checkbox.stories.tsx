import type { ComponentProps } from "react"
import { Checkbox as CheckboxImpl } from "./checkbox"

export default { title: "Animation/Checkbox Headless", component: CheckboxImpl }

export const CheckboxHeadless = (args: ComponentProps<typeof CheckboxImpl>) => <CheckboxImpl {...args} />
