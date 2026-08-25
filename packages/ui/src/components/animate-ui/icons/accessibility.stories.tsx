import type { ComponentProps } from "react"
import { Accessibility as AccessibilityImpl } from "./accessibility"

export default {
  title: "Icon/Accessibility",
  component: AccessibilityImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Accessibility = (args: ComponentProps<typeof AccessibilityImpl>) => <AccessibilityImpl {...args} />
