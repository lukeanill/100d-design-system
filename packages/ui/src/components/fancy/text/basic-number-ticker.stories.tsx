import type { ComponentProps } from "react"
import NumberTickerImpl from "./basic-number-ticker"

export default {
  title: "Animation/Text/Numbers/Basic Number Ticker",
  component: NumberTickerImpl,
  argTypes: {
    from: { control: "number" },
    target: { control: "number" },
    autoStart: { control: "boolean" },
    transition: { control: false },
  },
  args: { from: 0, target: 100, autoStart: true },
}

export const BasicNumberTicker = (args: ComponentProps<typeof NumberTickerImpl>) => <NumberTickerImpl {...args} />
