import type { ComponentProps } from "react"
import { Nfc as NfcImpl } from "./nfc"

export default {
  title: "Icon/Nfc",
  component: NfcImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Nfc = (args: ComponentProps<typeof NfcImpl>) => <NfcImpl {...args} />
