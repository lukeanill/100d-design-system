import type { ComponentProps } from "react"
import { Unplug as UnplugImpl } from "./unplug"

export default { title: "Icon/Unplug", component: UnplugImpl }

export const Unplug = (args: ComponentProps<typeof UnplugImpl>) => <UnplugImpl {...args} />
