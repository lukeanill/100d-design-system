import type { ComponentProps } from "react"
import { InstagramPost as InstagramPostImpl } from "./instagram-post"

export default { title: "Social Posts/Instagram Post", component: InstagramPostImpl }

export const InstagramPost = (args: ComponentProps<typeof InstagramPostImpl>) => <InstagramPostImpl {...args} />
