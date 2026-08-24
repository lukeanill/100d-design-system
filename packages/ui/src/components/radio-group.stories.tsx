import type { ComponentProps } from "react"
import { RadioGroup as RadioGroupImpl } from "./radio-group"

export default { title: "Components/Radio Group", component: RadioGroupImpl }

export const RadioGroup = (args: ComponentProps<typeof RadioGroupImpl>) => <RadioGroupImpl {...args} />
