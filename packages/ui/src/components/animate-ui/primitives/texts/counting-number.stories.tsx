import type { ComponentProps } from "react"
import { CountingNumber as CountingNumberImpl } from "./counting-number"

export default { title: "Animation/Counting Number (Texts)", component: CountingNumberImpl }

export const CountingNumber = (args: ComponentProps<typeof CountingNumberImpl>) => <CountingNumberImpl {...args} />
