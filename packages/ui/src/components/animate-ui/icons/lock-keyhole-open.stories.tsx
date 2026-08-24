import type { ComponentProps } from "react"
import { LockKeyholeOpen as LockKeyholeOpenImpl } from "./lock-keyhole-open"

export default { title: "Icon/Lock Keyhole Open", component: LockKeyholeOpenImpl }

export const LockKeyholeOpen = (args: ComponentProps<typeof LockKeyholeOpenImpl>) => <LockKeyholeOpenImpl {...args} />
