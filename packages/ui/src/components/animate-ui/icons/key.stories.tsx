import type { ComponentProps } from "react"
import { Key as KeyImpl } from "./key"

export default { title: "Icon/Key", component: KeyImpl }

export const Key = (args: ComponentProps<typeof KeyImpl>) => <KeyImpl {...args} />
