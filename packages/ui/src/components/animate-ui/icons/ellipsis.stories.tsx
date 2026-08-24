import type { ComponentProps } from "react"
import { Ellipsis as EllipsisImpl } from "./ellipsis"

export default { title: "Icon/Ellipsis", component: EllipsisImpl }

export const Ellipsis = (args: ComponentProps<typeof EllipsisImpl>) => <EllipsisImpl {...args} />
