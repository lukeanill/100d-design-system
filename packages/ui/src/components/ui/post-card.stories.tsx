import type { ComponentProps } from "react"
import { PostCard as PostCardImpl, PostCardContent } from "./post-card"

export default { title: "Components/Post Card", component: PostCardImpl }

export const PostCard = (args: ComponentProps<typeof PostCardImpl>) => (
  <PostCardImpl {...args} className="max-w-sm">
    <PostCardContent />
  </PostCardImpl>
)
