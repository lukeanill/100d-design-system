import type { ComponentProps } from "react"
import { Heart as HeartImpl } from "./heart"

export default { title: "Icon/Heart", component: HeartImpl }

export const Heart = (args: ComponentProps<typeof HeartImpl>) => <HeartImpl {...args} />
