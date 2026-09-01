import type { ComponentProps } from "react"
import { ThemeTogglerButton as ThemeTogglerButtonImpl } from "./theme-toggler"

export default {
  title: "Components/Theming/Theme Toggler",
  component: ThemeTogglerButtonImpl,
  argTypes: {
    variant: { control: "select", options: ["default", "outline", "ghost"] },
  },
  args: { variant: "outline" },
}

export const ThemeToggler = (args: ComponentProps<typeof ThemeTogglerButtonImpl>) => <ThemeTogglerButtonImpl {...args} />
