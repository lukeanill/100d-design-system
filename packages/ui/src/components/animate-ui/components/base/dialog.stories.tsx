import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import {
  Dialog as DialogImpl,
  DialogTrigger,
  DialogPopup,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./dialog"
import { Button } from "@workspace/ui/components/button"

export default {
  title: "Components/Overlays/Dialog",
  component: DialogImpl,
  args: { defaultOpen: false },
}

export const Dialog = (args: ComponentProps<typeof DialogImpl>) => (
  <DialogImpl {...args}>
    <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
    <DialogPopup>
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>Make changes to your profile here.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose render={<Button variant="outline">Cancel</Button>} />
        <Button>Save</Button>
      </DialogFooter>
    </DialogPopup>
  </DialogImpl>
)

Dialog.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)

  await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }))
  const dialog = await screen.findByRole("dialog")
  await waitFor(() => expect(within(dialog).getByText("Edit profile")).toBeVisible())

  await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }))
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
}
