import type { ComponentProps } from "react"
import { SlidingNumber as SlidingNumberImpl } from "./sliding-number"

export default {
  title: "Animation/Text/Numbers/Sliding Number",
  component: SlidingNumberImpl,
  argTypes: {
    decimalPlaces: { control: { type: "range", min: 0, max: 4, step: 1 } },
    decimalSeparator: { control: "text" },
    thousandSeparator: { control: "text" },
    delay: { control: { type: "range", min: 0, max: 2000, step: 100 } },
    padStart: { control: "boolean" },
  },
  args: { number: 1234, fromNumber: 0, decimalPlaces: 0, decimalSeparator: ".", padStart: false },
}

export const SlidingNumberTexts = (args: ComponentProps<typeof SlidingNumberImpl>) => <SlidingNumberImpl {...args} />
