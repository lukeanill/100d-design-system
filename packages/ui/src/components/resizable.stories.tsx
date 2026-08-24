import type { ComponentProps } from "react"
import { ResizableHandle as ResizableHandleImpl } from "./resizable"

export default { title: "Components/Resizable", component: ResizableHandleImpl }

export const Resizable = (args: ComponentProps<typeof ResizableHandleImpl>) => <ResizableHandleImpl {...args} />
