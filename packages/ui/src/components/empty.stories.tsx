import type { ComponentProps } from "react"
import { Empty as EmptyImpl } from "./empty"

export default { title: "Components/Empty", component: EmptyImpl }

export const Empty = (args: ComponentProps<typeof EmptyImpl>) => <EmptyImpl {...args} />
