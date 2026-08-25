import type { ComponentProps } from "react"
import { CloudLightning as CloudLightningImpl } from "./cloud-lightning"

export default {
  title: "Icon/Cloud Lightning",
  component: CloudLightningImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const CloudLightning = (args: ComponentProps<typeof CloudLightningImpl>) => <CloudLightningImpl {...args} />
