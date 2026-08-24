import type { ComponentProps } from "react"
import { useFireControl as useFireControlImpl } from "./fire"

export default { title: "Map/Fire", component: useFireControlImpl }

export const Fire = (args: ComponentProps<typeof useFireControlImpl>) => <useFireControlImpl {...args} />
