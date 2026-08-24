import type { ComponentProps } from "react"
import { EqualNot as EqualNotImpl } from "./equal-not"

export default { title: "Icon/Equal Not", component: EqualNotImpl }

export const EqualNot = (args: ComponentProps<typeof EqualNotImpl>) => <EqualNotImpl {...args} />
