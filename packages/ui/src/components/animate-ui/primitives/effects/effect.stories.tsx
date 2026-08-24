import type { ComponentProps } from "react"
import { Effect as EffectImpl } from "./effect"

export default { title: "Animation/Effect Effects", component: EffectImpl }

export const EffectEffects = (args: ComponentProps<typeof EffectImpl>) => <EffectImpl {...args} />
