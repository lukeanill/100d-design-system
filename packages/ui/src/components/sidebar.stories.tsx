import { Sidebar as SidebarImpl, SidebarProvider, SidebarContent, SidebarHeader } from "./sidebar"

export default { title: "Components/Sidebar", component: SidebarImpl }

export const Sidebar = () => (
  <SidebarProvider>
    <SidebarImpl>
      <SidebarHeader>Design System</SidebarHeader>
      <SidebarContent>Sidebar content</SidebarContent>
    </SidebarImpl>
  </SidebarProvider>
)
