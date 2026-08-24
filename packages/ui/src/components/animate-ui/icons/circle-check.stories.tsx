import type { ComponentProps } from "react"
import { CircleCheck as CircleCheckImpl } from "./circle-check"

export default { title: "Icon/Circle Check", component: CircleCheckImpl }

export const CircleCheck = (args: ComponentProps<typeof CircleCheckImpl>) => <CircleCheckImpl {...args} />
