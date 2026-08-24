import type { ComponentProps } from "react"
import { CountingNumber as CountingNumberImpl } from "./counting-number"

export default { title: "Animation/Counting Number Texts", component: CountingNumberImpl, args: { number: 1234 } }

export const CountingNumberTexts = (args: ComponentProps<typeof CountingNumberImpl>) => <CountingNumberImpl {...args} />
