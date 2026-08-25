import type { ComponentProps } from "react"
import { Fingerprint as FingerprintImpl } from "./fingerprint"

export default {
  title: "Icon/Fingerprint",
  component: FingerprintImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Fingerprint = (args: ComponentProps<typeof FingerprintImpl>) => <FingerprintImpl {...args} />
