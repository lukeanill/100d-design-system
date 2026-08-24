import type { ComponentProps } from "react"
import { LockOpen as LockOpenImpl } from "./lock-open"

export default { title: "Icon/Lock Open", component: LockOpenImpl }

export const LockOpen = (args: ComponentProps<typeof LockOpenImpl>) => <LockOpenImpl {...args} />
