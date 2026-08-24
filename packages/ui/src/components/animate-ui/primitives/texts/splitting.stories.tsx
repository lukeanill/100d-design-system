import type { ComponentProps } from "react"
import { SplittingText as SplittingTextImpl } from "./splitting"

export default { title: "Animation/Splitting (Texts)", component: SplittingTextImpl }

export const Splitting = (args: ComponentProps<typeof SplittingTextImpl>) => <SplittingTextImpl {...args} />
