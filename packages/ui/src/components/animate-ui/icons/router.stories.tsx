import type { ComponentProps } from "react"
import { Router as RouterImpl } from "./router"

export default {
  title: "Icon/Router",
  component: RouterImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Router = (args: ComponentProps<typeof RouterImpl>) => <RouterImpl {...args} />
