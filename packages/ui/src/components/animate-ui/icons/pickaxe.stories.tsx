import type { ComponentProps } from "react"
import { Pickaxe as PickaxeImpl } from "./pickaxe"

export default { title: "Icon/Pickaxe", component: PickaxeImpl }

export const Pickaxe = (args: ComponentProps<typeof PickaxeImpl>) => <PickaxeImpl {...args} />
