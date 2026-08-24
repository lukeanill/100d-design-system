import type { ComponentProps } from "react"
import { Cctv as CctvImpl } from "./cctv"

export default { title: "Icon/Cctv", component: CctvImpl }

export const Cctv = (args: ComponentProps<typeof CctvImpl>) => <CctvImpl {...args} />
