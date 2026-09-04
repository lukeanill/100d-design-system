import type { ComponentProps } from "react"
import { Dock as DockImpl } from "./dock"

export default {
  title: "Components/Navigation/Dock",
  component: DockImpl,
  parameters: { controls: { disable: true } },
}

export const Dock = (args: ComponentProps<typeof DockImpl>) => <DockImpl {...args} />
