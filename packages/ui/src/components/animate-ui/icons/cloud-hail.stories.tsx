import type { ComponentProps } from "react"
import { CloudHail as CloudHailImpl } from "./cloud-hail"

export default {
  title: "Icon/Cloud Hail",
  component: CloudHailImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CloudHail = (args: ComponentProps<typeof CloudHailImpl>) => <CloudHailImpl {...args} />
