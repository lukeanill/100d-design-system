import type { ComponentProps } from "react"
import { YouTubePost as YouTubePostImpl } from "./youtube-post"

export default { title: "Social Posts/Youtube Post", component: YouTubePostImpl }

export const YoutubePost = (args: ComponentProps<typeof YouTubePostImpl>) => <YouTubePostImpl {...args} />
