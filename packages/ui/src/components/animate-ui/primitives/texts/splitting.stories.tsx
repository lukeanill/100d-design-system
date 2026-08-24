import type { ComponentProps } from "react"
import { SplittingText as SplittingTextImpl } from "./splitting"

export default { title: "Animation/Splitting Texts", component: SplittingTextImpl, args: { text: "Splitting text" } }

export const SplittingTexts = (args: ComponentProps<typeof SplittingTextImpl>) => <SplittingTextImpl {...args} />
