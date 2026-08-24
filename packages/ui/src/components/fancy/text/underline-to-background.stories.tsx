import type { ComponentProps } from "react"
import UnderlineToBackgroundImpl from "./underline-to-background"

export default { title: "Animation/Underline To Background", component: UnderlineToBackgroundImpl }

export const UnderlineToBackground = (args: ComponentProps<typeof UnderlineToBackgroundImpl>) => <UnderlineToBackgroundImpl {...args} />
