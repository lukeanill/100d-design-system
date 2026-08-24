import type { ComponentProps } from "react"
import { Button as ButtonImpl } from "./button"

export default { title: "Components/Button Animated", component: ButtonImpl }

export const ButtonAnimated = (args: ComponentProps<typeof ButtonImpl>) => <ButtonImpl {...args} />
