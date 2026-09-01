import type { ComponentProps } from "react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./resizable"

export default {
  title: "Components/Layout/Resizable",
  component: ResizablePanelGroup,
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  args: { orientation: "horizontal" },
}

export const Resizable = (args: ComponentProps<typeof ResizablePanelGroup>) => (
  <ResizablePanelGroup {...args} className="h-32 rounded-lg border">
    <ResizablePanel defaultSize={50}>
      <div className="flex h-full items-center justify-center">One</div>
    </ResizablePanel>
    <ResizableHandle withHandle />
    <ResizablePanel defaultSize={50}>
      <div className="flex h-full items-center justify-center">Two</div>
    </ResizablePanel>
  </ResizablePanelGroup>
)
