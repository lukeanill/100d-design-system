import type { ComponentProps } from "react"
import { IconButton as IconButtonImpl } from "./icon"

export default { title: "Components/Icon", component: IconButtonImpl }

export const Icon = (args: ComponentProps<typeof IconButtonImpl>) => <IconButtonImpl {...args} />
