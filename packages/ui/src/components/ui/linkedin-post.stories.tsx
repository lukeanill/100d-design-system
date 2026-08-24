import type { ComponentProps } from "react"
import { LinkedInPost as LinkedInPostImpl } from "./linkedin-post"

export default { title: "Social Posts/Linkedin Post", component: LinkedInPostImpl }

export const LinkedinPost = (args: ComponentProps<typeof LinkedInPostImpl>) => <LinkedInPostImpl {...args} />
