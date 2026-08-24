import type { ComponentProps } from "react"
import { ThumbsDown as ThumbsDownImpl } from "./thumbs-down"

export default { title: "Icon/Thumbs Down", component: ThumbsDownImpl }

export const ThumbsDown = (args: ComponentProps<typeof ThumbsDownImpl>) => <ThumbsDownImpl {...args} />
