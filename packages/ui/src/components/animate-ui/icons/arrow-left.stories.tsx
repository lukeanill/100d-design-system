import type { ComponentProps } from "react"
import { ArrowLeft as ArrowLeftImpl } from "./arrow-left"

export default { title: "Icon/Arrow Left", component: ArrowLeftImpl }

export const ArrowLeft = (args: ComponentProps<typeof ArrowLeftImpl>) => <ArrowLeftImpl {...args} />
