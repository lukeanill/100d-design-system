import type { ComponentProps } from "react"
import { PostCard as PostCardImpl } from "./post-card"

export default { title: "Components/Post Card", component: PostCardImpl }

export const PostCard = (args: ComponentProps<typeof PostCardImpl>) => <PostCardImpl {...args} />
