import type { ComponentProps } from "react"
import { Combobox as ComboboxImpl } from "./combobox"

export default { title: "Components/Combobox", component: ComboboxImpl }

export const Combobox = (args: ComponentProps<typeof ComboboxImpl>) => <ComboboxImpl {...args} />
