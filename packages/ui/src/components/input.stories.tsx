import type { ComponentProps } from "react"
import { Input as InputImpl } from "./input"

export default { title: "Components/Input", component: InputImpl }

export const Input = (args: ComponentProps<typeof InputImpl>) => <InputImpl {...args} />
