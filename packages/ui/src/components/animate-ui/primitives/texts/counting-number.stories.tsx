import type { ComponentProps } from "react"
import { CountingNumber as CountingNumberImpl } from "./counting-number"

export default {
  title: "Animation/Text/Numbers/Counting Number",
  component: CountingNumberImpl,
  argTypes: {
    fromNumber: { control: "number" },
    decimalPlaces: { control: { type: "range", min: 0, max: 4, step: 1 } },
    decimalSeparator: { control: "text" },
    delay: { control: { type: "range", min: 0, max: 2000, step: 100 } },
    transition: { control: false },
  },
  args: { number: 1234, fromNumber: 0, decimalPlaces: 0, decimalSeparator: ".", delay: 0 },
}

export const CountingNumberTexts = (args: ComponentProps<typeof CountingNumberImpl>) => <CountingNumberImpl {...args} />
