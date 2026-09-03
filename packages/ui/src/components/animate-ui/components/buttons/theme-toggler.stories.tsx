import type { ComponentProps } from "react"
import { ThemeTogglerButton as ThemeTogglerButtonImpl } from "./theme-toggler"

export default {
  title: "Components/Theming/Theme Toggler",
  component: ThemeTogglerButtonImpl,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "accent", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: { control: "select", options: ["default", "xs", "sm", "lg"] },
    direction: { control: "radio", options: ["ltr", "rtl"] },
    modes: { table: { disable: true } },
    onImmediateChange: { table: { disable: true } },
  },
  args: { variant: "outline", size: "default", direction: "ltr" },
}

export const ThemeToggler = (args: ComponentProps<typeof ThemeTogglerButtonImpl>) => <ThemeTogglerButtonImpl {...args} />
