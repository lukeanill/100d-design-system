import type { ComponentProps } from "react"
import { Pause as PauseImpl } from "./pause"

export default { title: "Icon/Pause", component: PauseImpl }

export const Pause = (args: ComponentProps<typeof PauseImpl>) => <PauseImpl {...args} />
