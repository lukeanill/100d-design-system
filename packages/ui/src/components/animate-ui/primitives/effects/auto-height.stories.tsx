import type { ComponentProps } from "react"
import { AutoHeight as AutoHeightImpl } from "./auto-height"

export default { title: "Animation/Auto Height Effects", component: AutoHeightImpl }

export const AutoHeightEffects = (args: ComponentProps<typeof AutoHeightImpl>) => <AutoHeightImpl {...args} />
