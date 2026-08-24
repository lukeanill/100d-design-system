import type { ComponentProps } from "react"
import { GradientText as GradientTextImpl } from "./gradient"

export default { title: "Animation/Gradient Texts", component: GradientTextImpl }

export const GradientTexts = (args: ComponentProps<typeof GradientTextImpl>) => <GradientTextImpl {...args} />
