import type { ComponentProps } from "react"
import { ThemeToggler as ThemeTogglerImpl } from "./theme-toggler"

export default { title: "Animation/Theme Toggler (Effects)", component: ThemeTogglerImpl }

export const ThemeToggler = (args: ComponentProps<typeof ThemeTogglerImpl>) => <ThemeTogglerImpl {...args} />
