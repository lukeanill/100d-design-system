import type { ComponentProps } from "react"
import { Lock as LockImpl } from "./lock"

export default { title: "Icon/Lock", component: LockImpl }

export const Lock = (args: ComponentProps<typeof LockImpl>) => <LockImpl {...args} />
