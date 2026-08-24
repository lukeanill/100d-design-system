import type { ComponentProps } from "react"
import { useLightningControl as useLightningControlImpl } from "./lightning"

export default { title: "Map/Lightning", component: useLightningControlImpl }

export const Lightning = (args: ComponentProps<typeof useLightningControlImpl>) => <useLightningControlImpl {...args} />
