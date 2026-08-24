import type { ComponentProps } from "react"
import { Sparkles as SparklesImpl } from "./sparkles"

export default { title: "Icon/Sparkles", component: SparklesImpl }

export const Sparkles = (args: ComponentProps<typeof SparklesImpl>) => <SparklesImpl {...args} />
