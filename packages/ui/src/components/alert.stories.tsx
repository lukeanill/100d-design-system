import type { ComponentProps } from "react"
import { Alert as AlertImpl, AlertTitle, AlertDescription } from "./alert"

export default {
  title: "Components/Alert",
  component: AlertImpl,
  argTypes: {
    variant: { control: "select", options: ["default", "destructive"] },
  },
  args: { variant: "default" },
}

export const Alert = (args: ComponentProps<typeof AlertImpl>) => (
  <AlertImpl {...args}>
    <AlertTitle>Heads up</AlertTitle>
    <AlertDescription>This is an alert description with more detail.</AlertDescription>
  </AlertImpl>
)
