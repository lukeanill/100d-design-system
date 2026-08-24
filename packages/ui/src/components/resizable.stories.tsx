import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./resizable"

export default { title: "Components/Resizable", component: ResizablePanelGroup }

export const Resizable = () => (
  <ResizablePanelGroup direction="horizontal" className="h-32 rounded-lg border">
    <ResizablePanel defaultSize={50}>
      <div className="flex h-full items-center justify-center">One</div>
    </ResizablePanel>
    <ResizableHandle withHandle />
    <ResizablePanel defaultSize={50}>
      <div className="flex h-full items-center justify-center">Two</div>
    </ResizablePanel>
  </ResizablePanelGroup>
)
