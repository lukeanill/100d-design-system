import type { ComponentProps } from "react"
import { ButtonGroup as ButtonGroupImpl } from "./button-group"
import { Button } from "./button"

export default {
  title: "Components/Actions/Button Group",
  component: ButtonGroupImpl,
  argTypes: {
    orientation: { control: "select", options: ["horizontal", "vertical"] },
  },
  args: { orientation: "horizontal" },
}

export const ButtonGroup = (args: ComponentProps<typeof ButtonGroupImpl>) => (
  <ButtonGroupImpl {...args}>
    <Button variant="default">One</Button>
    <Button variant="default">Two</Button>
    <Button variant="default">Three</Button>
  </ButtonGroupImpl>
)
