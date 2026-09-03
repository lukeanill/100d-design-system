import type { ComponentProps } from "react"
import { ScrollArea as ScrollAreaImpl } from "./scroll-area"

export default {
  title: "Components/Layout/Scroll Area",
  component: ScrollAreaImpl,
  parameters: { controls: { disable: true } },
}

export const ScrollArea = (args: ComponentProps<typeof ScrollAreaImpl>) => (
  <ScrollAreaImpl {...args} className="h-48 w-64 rounded-md border p-4">
    {Array.from({ length: 20 }).map((_, i) => (
      <p key={i} className="text-sm">
        Item {i + 1}
      </p>
    ))}
  </ScrollAreaImpl>
)
