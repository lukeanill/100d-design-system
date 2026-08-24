import type { ComponentProps } from "react"
import { ManagementBar as ManagementBarImpl } from "./management-bar"

export default { title: "Components/Management Bar", component: ManagementBarImpl }

export const ManagementBar = (args: ComponentProps<typeof ManagementBarImpl>) => <ManagementBarImpl {...args} />
