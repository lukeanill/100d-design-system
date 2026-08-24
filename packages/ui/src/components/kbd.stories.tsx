import type { ComponentProps } from "react"
import { Kbd as KbdImpl } from "./kbd"

export default { title: "Components/Kbd", component: KbdImpl }

export const Kbd = (args: ComponentProps<typeof KbdImpl>) => <KbdImpl {...args} />
