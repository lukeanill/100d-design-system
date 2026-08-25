import type { ComponentProps } from "react"
import { Pickaxe as PickaxeImpl } from "./pickaxe"

export default {
  title: "Icon/Pickaxe",
  component: PickaxeImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const Pickaxe = (args: ComponentProps<typeof PickaxeImpl>) => <PickaxeImpl {...args} />
