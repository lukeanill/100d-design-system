import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
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
    defaultOpen: { control: "boolean" },
    modal: { control: "boolean" },
    onOpenChange: { table: { disable: true } },
    onOpenChangeComplete: { table: { disable: true } },
    actionsRef: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: { side: "right", defaultOpen: false, modal: true },
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

Sheet.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)

  await userEvent.click(canvas.getByRole("button", { name: "Open sheet" }))
  const sheet = await screen.findByRole("dialog")
  await waitFor(() => expect(within(sheet).getByText("Edit profile")).toBeVisible())

  await userEvent.click(within(sheet).getByRole("button", { name: "Cancel" }))
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument())
}
