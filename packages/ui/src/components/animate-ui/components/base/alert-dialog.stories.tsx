import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import {
  AlertDialog as AlertDialogImpl,
  AlertDialogTrigger,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog"
import { Button } from "@workspace/ui/components/button"

export default {
  title: "Components/Animate UI/Alert Dialog",
  tags: ["!dev"],
  component: AlertDialogImpl,
  args: { defaultOpen: false },
}

export const AlertDialog = (args: ComponentProps<typeof AlertDialogImpl>) => (
  <AlertDialogImpl {...args}>
    <AlertDialogTrigger render={<Button variant="outline">Delete account</Button>} />
    <AlertDialogPopup>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel render={<Button variant="outline">Cancel</Button>} />
        <AlertDialogAction render={<Button variant="destructive">Continue</Button>} />
      </AlertDialogFooter>
    </AlertDialogPopup>
  </AlertDialogImpl>
)

AlertDialog.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)

  await userEvent.click(canvas.getByRole("button", { name: "Delete account" }))
  const dialog = await screen.findByRole("alertdialog")
  await waitFor(() => expect(within(dialog).getByText("Are you absolutely sure?")).toBeVisible())

  await userEvent.click(within(dialog).getByRole("button", { name: "Cancel" }))
  await waitFor(() => expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument())
}
