import type { ComponentProps } from "react"
import { Star as StarImpl } from "./star"

export default { title: "Icon/Star", component: StarImpl }

export const Star = (args: ComponentProps<typeof StarImpl>) => <StarImpl {...args} />
