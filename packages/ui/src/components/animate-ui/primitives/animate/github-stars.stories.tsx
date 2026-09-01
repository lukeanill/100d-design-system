import type { ComponentProps } from "react"
import {
  GithubStars as GithubStarsImpl,
  GithubStarsIcon,
  GithubStarsLogo,
  GithubStarsNumber,
} from "./github-stars"

export default {
  title: "Animation/Github Stars Animate",
  tags: ["!dev"],
  component: GithubStarsImpl,
  argTypes: {
    delay: { control: { type: "range", min: 0, max: 3000, step: 100 } },
    inViewMargin: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {
    username: "facebook",
    repo: "react",
    delay: 0,
    inView: false,
    inViewOnce: true,
  },
}

type GithubStarsArgs = Omit<ComponentProps<typeof GithubStarsImpl>, "children" | "asChild">

export const GithubStarsAnimate = (args: GithubStarsArgs) => (
  <GithubStarsImpl
    {...args}
    style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, fontWeight: 600 }}
  >
    <GithubStarsIcon icon={<GithubStarsLogo style={{ width: 20, height: 20 }} />} />
    <GithubStarsNumber />
  </GithubStarsImpl>
)
