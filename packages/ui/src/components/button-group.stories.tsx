import type { ComponentProps } from "react"
import { ButtonGroup as ButtonGroupImpl } from "./button-group"

export default { title: "Components/Button Group", component: ButtonGroupImpl }

export const ButtonGroup = (args: ComponentProps<typeof ButtonGroupImpl>) => <ButtonGroupImpl {...args} />
