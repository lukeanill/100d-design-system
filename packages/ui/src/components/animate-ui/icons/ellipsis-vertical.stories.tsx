import type { ComponentProps } from "react"
import { EllipsisVertical as EllipsisVerticalImpl } from "./ellipsis-vertical"

export default { title: "Icon/Ellipsis Vertical", component: EllipsisVerticalImpl }

export const EllipsisVertical = (args: ComponentProps<typeof EllipsisVerticalImpl>) => <EllipsisVerticalImpl {...args} />
