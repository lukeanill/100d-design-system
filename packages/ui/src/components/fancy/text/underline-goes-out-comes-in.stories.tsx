import type { ComponentProps } from "react"
import GoesOutComesInUnderlineImpl from "./underline-goes-out-comes-in"

export default { title: "Animation/Underline Goes Out Comes In", component: GoesOutComesInUnderlineImpl }

export const UnderlineGoesOutComesIn = (args: ComponentProps<typeof GoesOutComesInUnderlineImpl>) => <GoesOutComesInUnderlineImpl {...args} />
