import type { ComponentProps } from "react"
import { XPost as XPostImpl } from "./x-post"

export default { title: "Social Posts/X Post", component: XPostImpl }

export const XPost = (args: ComponentProps<typeof XPostImpl>) => <XPostImpl {...args} />
