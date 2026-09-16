import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, userEvent, waitFor, within } from "storybook/test"
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

Collapsible.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)
  await expect(canvas.getByText("Collapsible content revealed here.")).toBeVisible()

  await userEvent.click(canvas.getByRole("button", { name: "Toggle" }))
  await waitFor(() => expect(canvas.queryByText("Collapsible content revealed here.")).not.toBeInTheDocument())
}
