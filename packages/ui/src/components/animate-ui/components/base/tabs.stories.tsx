import type { ComponentProps } from "react"
import { Tabs as TabsImpl } from "./tabs"

export default { title: "Components/Tabs", component: TabsImpl }

export const Tabs = (args: ComponentProps<typeof TabsImpl>) => <TabsImpl {...args} />
