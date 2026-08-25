import type { ComponentProps } from "react"
import { Item as ItemImpl, ItemContent, ItemTitle, ItemDescription } from "./item"

export default {
  title: "Components/Item",
  component: ItemImpl,
  argTypes: {
    variant: { control: "select", options: ["default", "outline", "muted"] },
    size: { control: "select", options: ["default", "sm", "xs"] },
  },
  args: { variant: "outline", size: "default" },
}

export const Item = (args: ComponentProps<typeof ItemImpl>) => (
  <ItemImpl {...args}>
    <ItemContent>
      <ItemTitle>Item title</ItemTitle>
      <ItemDescription>A short description of this item.</ItemDescription>
    </ItemContent>
  </ItemImpl>
)
