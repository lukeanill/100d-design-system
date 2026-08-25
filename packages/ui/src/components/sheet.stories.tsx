import type { ComponentProps } from "react"
import {
  Sheet as SheetImpl,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "./sheet"
import { Button } from "@workspace/ui/components/button"

export default { title: "Components/Sheet", component: SheetImpl }

export const Sheet = (args: ComponentProps<typeof SheetImpl>) => (
  <SheetImpl {...args}>
    <SheetTrigger render={<Button variant="outline">Open sheet</Button>} />
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>Make changes to your profile here.</SheetDescription>
      </SheetHeader>
      <SheetFooter>
        <Button>Save</Button>
        <SheetClose render={<Button variant="outline">Cancel</Button>} />
      </SheetFooter>
    </SheetContent>
  </SheetImpl>
)
