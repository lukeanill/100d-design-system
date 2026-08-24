import type { ComponentProps } from "react"
import { ThemeTogglerButton as ThemeTogglerButtonImpl } from "./theme-toggler"

export default { title: "Components/Theme Toggler", component: ThemeTogglerButtonImpl }

export const ThemeToggler = (args: ComponentProps<typeof ThemeTogglerButtonImpl>) => <ThemeTogglerButtonImpl {...args} />
