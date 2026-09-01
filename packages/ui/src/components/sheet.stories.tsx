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

export default {
  title: "Components/Overlays/Sheet",
  component: SheetImpl,
  argTypes: {
    side: {
      control: "select",
      options: ["top", "right", "bottom", "left"],
    },
  },
  args: { side: "right" },
}

export const Sheet = ({
  side,
  ...args
}: ComponentProps<typeof SheetImpl> & Pick<ComponentProps<typeof SheetContent>, "side">) => (
  <SheetImpl {...args}>
    <SheetTrigger render={<Button variant="outline">Open sheet</Button>} />
    <SheetContent side={side}>
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
