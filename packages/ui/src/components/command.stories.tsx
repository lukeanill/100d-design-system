import type { ComponentProps } from "react"
import type { StoryContext } from "@storybook/react"
import { expect, userEvent, waitFor, within } from "storybook/test"
import {
  Command as CommandImpl,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./command"

export default {
  title: "Components/Navigation/Command",
  component: CommandImpl,
  parameters: { controls: { disable: true } },
}

export const Command = (args: ComponentProps<typeof CommandImpl>) => (
  <CommandImpl {...args} className="w-80 rounded-lg border shadow-md">
    <CommandInput placeholder="Type a command..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>Calendar</CommandItem>
        <CommandItem>Search Emoji</CommandItem>
        <CommandItem>Calculator</CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandImpl>
)

Command.play = async ({ canvasElement }: StoryContext) => {
  const canvas = within(canvasElement)

  await userEvent.type(canvas.getByPlaceholderText("Type a command..."), "cal")
  await waitFor(() => expect(canvas.queryByText("Search Emoji")).not.toBeInTheDocument())
  await expect(canvas.getByText("Calendar")).toBeVisible()
  await expect(canvas.getByText("Calculator")).toBeVisible()
}
