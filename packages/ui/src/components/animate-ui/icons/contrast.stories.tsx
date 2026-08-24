import type { ComponentProps } from "react"
import { Contrast as ContrastImpl } from "./contrast"

export default { title: "Icon/Contrast", component: ContrastImpl }

export const Contrast = (args: ComponentProps<typeof ContrastImpl>) => <ContrastImpl {...args} />
