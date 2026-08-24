import type { ComponentProps } from "react"
import NumberTickerImpl from "./basic-number-ticker"

export default { title: "Animation/Basic Number Ticker", component: NumberTickerImpl }

export const BasicNumberTicker = (args: ComponentProps<typeof NumberTickerImpl>) => <NumberTickerImpl {...args} />
