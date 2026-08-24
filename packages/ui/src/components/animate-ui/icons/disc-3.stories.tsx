import type { ComponentProps } from "react"
import { Disc3 as Disc3Impl } from "./disc-3"

export default { title: "Icon/Disc 3", component: Disc3Impl }

export const Disc3 = (args: ComponentProps<typeof Disc3Impl>) => <Disc3Impl {...args} />
