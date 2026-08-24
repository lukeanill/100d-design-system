import type { ComponentProps } from "react"
import { Forklift as ForkliftImpl } from "./forklift"

export default { title: "Icon/Forklift", component: ForkliftImpl }

export const Forklift = (args: ComponentProps<typeof ForkliftImpl>) => <ForkliftImpl {...args} />
