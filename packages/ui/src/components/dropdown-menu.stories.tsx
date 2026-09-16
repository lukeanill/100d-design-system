import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import {
  DropdownMenu as DropdownMenuImpl,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./dropdown-menu"
import { Button } from "@workspace/ui/components/button"

export default { title: "Components/Shadcn/Dropdown Menu", component: DropdownMenuImpl, tags: ["!dev"] }

export const DropdownMenu = (args: ComponentProps<typeof DropdownMenuImpl>) => (
  <DropdownMenuImpl {...args}>
    <DropdownMenuTrigger render={<Button variant="outline">Open menu</Button>} />
    <DropdownMenuContent>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenuImpl>
)

DropdownMenu.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)

  await userEvent.click(canvas.getByRole("button", { name: "Open menu" }))
  await userEvent.click(await screen.findByRole("menuitem", { name: "Settings" }))
  await waitFor(() => expect(screen.queryByRole("menuitem", { name: "Settings" })).not.toBeInTheDocument())
}
