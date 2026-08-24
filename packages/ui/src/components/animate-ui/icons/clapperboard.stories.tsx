import type { ComponentProps } from "react"
import { Clapperboard as ClapperboardImpl } from "./clapperboard"

export default { title: "Icon/Clapperboard", component: ClapperboardImpl }

export const Clapperboard = (args: ComponentProps<typeof ClapperboardImpl>) => <ClapperboardImpl {...args} />
