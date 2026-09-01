import type { ComponentProps } from "react"
import { Collapsible as CollapsibleImpl, CollapsibleTrigger, CollapsiblePanel } from "./collapsible"

export default {
  title: "Animation/Collapsible Base",
  tags: ["!dev"],
  component: CollapsibleImpl,
  argTypes: {
    children: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
  },
  args: {
    defaultOpen: true,
    disabled: false,
  },
}

export const CollapsibleBase = (args: ComponentProps<typeof CollapsibleImpl>) => (
  <CollapsibleImpl {...args} style={{ width: 280 }}>
    <CollapsibleTrigger
      style={{
        padding: "8px 12px",
        borderRadius: 6,
        border: "1px solid #d1d5db",
        fontSize: 14,
        background: "white",
        cursor: "pointer",
      }}
    >
      Toggle details
    </CollapsibleTrigger>
    <CollapsiblePanel
      style={{ fontSize: 14, color: "#4b5563", padding: "8px 4px" }}
    >
      This content expands and collapses with a smooth animation.
    </CollapsiblePanel>
  </CollapsibleImpl>
)
