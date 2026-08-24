import type { ComponentProps } from "react"
import { ScrollArea as ScrollAreaImpl } from "./scroll-area"

export default { title: "Components/Scroll Area", component: ScrollAreaImpl }

export const ScrollArea = (args: ComponentProps<typeof ScrollAreaImpl>) => <ScrollAreaImpl {...args} />
