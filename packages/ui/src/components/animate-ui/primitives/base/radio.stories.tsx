import type { ComponentProps } from "react"
import { Radio as RadioImpl } from "./radio"

export default { title: "Animation/Radio Base", component: RadioImpl }

export const RadioBase = (args: ComponentProps<typeof RadioImpl>) => <RadioImpl {...args} />
