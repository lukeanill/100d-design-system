import type { ComponentProps } from "react"
import { AspectRatio as AspectRatioImpl } from "./aspect-ratio"

export default { title: "Components/Aspect Ratio", component: AspectRatioImpl }

export const AspectRatio = (args: ComponentProps<typeof AspectRatioImpl>) => <AspectRatioImpl {...args} />
