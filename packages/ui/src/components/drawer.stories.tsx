import type { ComponentProps } from "react"
import {
  Drawer as DrawerImpl,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "./drawer"
import { Button } from "@workspace/ui/components/button"

export default {
  title: "Components/Overlays/Drawer",
  component: DrawerImpl,
  argTypes: {
    swipeDirection: {
      control: "select",
      options: ["up", "down", "left", "right"],
    },
  },
  args: { swipeDirection: "down" },
}

export const Drawer = (args: ComponentProps<typeof DrawerImpl>) => (
  <DrawerImpl {...args}>
    <DrawerTrigger render={<Button variant="outline">Open drawer</Button>} />
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Edit profile</DrawerTitle>
        <DrawerDescription>Make changes to your profile here.</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Button>Save</Button>
        <DrawerClose render={<Button variant="outline">Cancel</Button>} />
      </DrawerFooter>
    </DrawerContent>
  </DrawerImpl>
)
