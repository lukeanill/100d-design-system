import type { ComponentProps } from "react"
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
