import type { ComponentProps } from "react"
import { Button as ButtonImpl } from "./button"

export default { title: "Components/Button (Animated)", component: ButtonImpl }

export const Button = (args: ComponentProps<typeof ButtonImpl>) => <ButtonImpl {...args} />
