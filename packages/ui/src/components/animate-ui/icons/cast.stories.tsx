import type { ComponentProps } from "react"
import { Cast as CastImpl } from "./cast"

export default { title: "Icon/Cast", component: CastImpl }

export const Cast = (args: ComponentProps<typeof CastImpl>) => <CastImpl {...args} />
