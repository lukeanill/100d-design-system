import type { ComponentProps } from "react"
import { Gavel as GavelImpl } from "./gavel"

export default { title: "Icon/Gavel", component: GavelImpl }

export const Gavel = (args: ComponentProps<typeof GavelImpl>) => <GavelImpl {...args} />
