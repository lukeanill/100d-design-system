import type { ComponentProps } from "react"
import {
  Command as CommandImpl,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./command"

export default { title: "Components/Command", component: CommandImpl }

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
