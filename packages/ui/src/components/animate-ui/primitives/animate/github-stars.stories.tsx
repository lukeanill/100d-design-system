import type { ComponentProps } from "react"
import { GithubStars as GithubStarsImpl } from "./github-stars"

export default { title: "Animation/Github Stars (Animate)", component: GithubStarsImpl }

export const GithubStars = (args: ComponentProps<typeof GithubStarsImpl>) => <GithubStarsImpl {...args} />
