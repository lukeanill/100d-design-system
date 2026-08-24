import type { ComponentProps } from "react"
import { Accessibility as AccessibilityImpl } from "./accessibility"

export default { title: "Icon/Accessibility", component: AccessibilityImpl }

export const Accessibility = (args: ComponentProps<typeof AccessibilityImpl>) => <AccessibilityImpl {...args} />
