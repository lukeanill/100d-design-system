import type { ComponentProps } from "react"
import { Sparkle as SparkleImpl } from "./sparkle"

export default { title: "Icon/Sparkle", component: SparkleImpl }

export const Sparkle = (args: ComponentProps<typeof SparkleImpl>) => <SparkleImpl {...args} />
