import type { ComponentProps } from "react"
import { Collapsible as CollapsibleImpl, CollapsibleTrigger, CollapsibleContent } from "./collapsible"
import { Button } from "@workspace/ui/components/button"

export default { title: "Components/Shadcn/Collapsible", component: CollapsibleImpl, args: { defaultOpen: true }, tags: ["!dev"] }

export const Collapsible = (args: ComponentProps<typeof CollapsibleImpl>) => (
  <CollapsibleImpl {...args} className="w-64">
    <CollapsibleTrigger render={<Button variant="outline">Toggle</Button>} />
    <CollapsibleContent className="mt-2 rounded-lg border p-3 text-sm">
      Collapsible content revealed here.
    </CollapsibleContent>
  </CollapsibleImpl>
)
