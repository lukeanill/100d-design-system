import type { ComponentProps } from "react"
import { PostDetail as PostDetailImpl, PostDetailContent } from "./post-detail"

export default { title: "Components/Post Detail", component: PostDetailImpl }

export const PostDetail = (args: ComponentProps<typeof PostDetailImpl>) => (
  <PostDetailImpl {...args} className="max-w-2xl">
    <PostDetailContent />
  </PostDetailImpl>
)
