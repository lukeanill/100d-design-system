import type { ComponentProps } from "react"
import { Tabs as TabsImpl, TabsList, TabsTab, TabsPanels, TabsPanel } from "./tabs"

export default {
  title: "Components/Navigation/Tabs",
  component: TabsImpl,
  args: { defaultValue: "tab1" },
}

export const Tabs = (args: ComponentProps<typeof TabsImpl>) => (
  <TabsImpl {...args}>
    <TabsList>
      <TabsTab value="tab1">Account</TabsTab>
      <TabsTab value="tab2">Password</TabsTab>
    </TabsList>
    <TabsPanels>
      <TabsPanel value="tab1">Account settings content.</TabsPanel>
      <TabsPanel value="tab2">Password settings content.</TabsPanel>
    </TabsPanels>
  </TabsImpl>
)
