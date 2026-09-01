import type { ComponentProps } from "react"
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
