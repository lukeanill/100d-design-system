import type { ComponentProps } from "react"
import {
  Combobox as ComboboxImpl,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "./combobox"

export default {
  title: "Components/Selects/Combobox",
  component: ComboboxImpl,
  argTypes: {
    disabled: { control: "boolean" },
    multiple: { control: "boolean" },
  },
  args: { items: ["Apple", "Banana", "Cherry"], disabled: false, multiple: false },
}

export const Combobox = (args: ComponentProps<typeof ComboboxImpl>) => (
  <ComboboxImpl {...args}>
    <ComboboxInput placeholder="Select a fruit..." />
    <ComboboxContent>
      <ComboboxList>
        {(item: string) => (
          <ComboboxItem key={item} value={item}>
            {item}
          </ComboboxItem>
        )}
      </ComboboxList>
    </ComboboxContent>
  </ComboboxImpl>
)
