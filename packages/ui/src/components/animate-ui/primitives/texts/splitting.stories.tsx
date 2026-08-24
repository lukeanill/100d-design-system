import type { ComponentProps } from "react"
import { SplittingText as SplittingTextImpl } from "./splitting"

export default { title: "Animation/Splitting Texts", component: SplittingTextImpl }

export const SplittingTexts = (args: ComponentProps<typeof SplittingTextImpl>) => <SplittingTextImpl {...args} />
