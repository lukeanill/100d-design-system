import type { ComponentProps } from "react"
import { LockKeyhole as LockKeyholeImpl } from "./lock-keyhole"

export default { title: "Icon/Lock Keyhole", component: LockKeyholeImpl }

export const LockKeyhole = (args: ComponentProps<typeof LockKeyholeImpl>) => <LockKeyholeImpl {...args} />
