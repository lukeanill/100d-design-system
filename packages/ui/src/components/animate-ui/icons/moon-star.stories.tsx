import type { ComponentProps } from "react"
import { MoonStar as MoonStarImpl } from "./moon-star"

export default { title: "Icon/Moon Star", component: MoonStarImpl }

export const MoonStar = (args: ComponentProps<typeof MoonStarImpl>) => <MoonStarImpl {...args} />
