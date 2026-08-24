import type { ComponentProps } from "react"
import { ThumbsUp as ThumbsUpImpl } from "./thumbs-up"

export default { title: "Icon/Thumbs Up", component: ThumbsUpImpl }

export const ThumbsUp = (args: ComponentProps<typeof ThumbsUpImpl>) => <ThumbsUpImpl {...args} />
