import type { ComponentProps } from "react"
import { Copy as CopyImpl } from "./copy"

export default { title: "Icon/Copy", component: CopyImpl }

export const Copy = (args: ComponentProps<typeof CopyImpl>) => <CopyImpl {...args} />
