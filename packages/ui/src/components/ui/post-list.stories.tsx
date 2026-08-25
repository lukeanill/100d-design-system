import type { ComponentProps } from "react"
import { PostList as PostListImpl, PostListContent } from "./post-list"

export default { title: "Components/Post List", component: PostListImpl }

export const PostList = (args: ComponentProps<typeof PostListImpl>) => (
  <PostListImpl {...args}>
    <PostListContent />
  </PostListImpl>
)
