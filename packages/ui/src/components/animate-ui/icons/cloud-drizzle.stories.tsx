import type { ComponentProps } from "react"
import { CloudDrizzle as CloudDrizzleImpl } from "./cloud-drizzle"

export default {
  title: "Icon/Cloud Drizzle",
  component: CloudDrizzleImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CloudDrizzle = (args: ComponentProps<typeof CloudDrizzleImpl>) => <CloudDrizzleImpl {...args} />
