import type { ComponentProps } from "react"
import { Button as ButtonImpl } from "./button"

export default { title: "Components/Button", component: ButtonImpl }

export const Button = (args: ComponentProps<typeof ButtonImpl>) => <ButtonImpl {...args} />
