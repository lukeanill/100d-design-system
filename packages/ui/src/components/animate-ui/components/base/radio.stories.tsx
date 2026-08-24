import type { ComponentProps } from "react"
import { Radio as RadioImpl } from "./radio"

export default { title: "Components/Radio", component: RadioImpl }

export const Radio = (args: ComponentProps<typeof RadioImpl>) => <RadioImpl {...args} />
