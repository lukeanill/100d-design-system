import type { ComponentProps } from "react"
import { PostDetail as PostDetailImpl } from "./post-detail"

export default { title: "Components/Post Detail", component: PostDetailImpl }

export const PostDetail = (args: ComponentProps<typeof PostDetailImpl>) => <PostDetailImpl {...args} />
