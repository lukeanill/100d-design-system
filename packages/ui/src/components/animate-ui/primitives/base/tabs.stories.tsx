import type { ComponentProps } from "react"
import { Tabs as TabsImpl } from "./tabs"

export default { title: "Animation/Tabs (Base)", component: TabsImpl }

export const Tabs = (args: ComponentProps<typeof TabsImpl>) => <TabsImpl {...args} />
