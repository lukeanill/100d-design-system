import type { ComponentProps } from "react"
import { Blocks as BlocksImpl } from "./blocks"

export default { title: "Icon/Blocks", component: BlocksImpl }

export const Blocks = (args: ComponentProps<typeof BlocksImpl>) => <BlocksImpl {...args} />
