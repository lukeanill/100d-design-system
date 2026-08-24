import type { ComponentProps } from "react"
import { CircleCheckBig as CircleCheckBigImpl } from "./circle-check-big"

export default { title: "Icon/Circle Check Big", component: CircleCheckBigImpl }

export const CircleCheckBig = (args: ComponentProps<typeof CircleCheckBigImpl>) => <CircleCheckBigImpl {...args} />
