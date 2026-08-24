import type { ComponentProps } from "react"
import { Cog as CogImpl } from "./cog"

export default { title: "Icon/Cog", component: CogImpl }

export const Cog = (args: ComponentProps<typeof CogImpl>) => <CogImpl {...args} />
