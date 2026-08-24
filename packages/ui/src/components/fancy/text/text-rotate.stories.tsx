import type { ComponentProps } from "react"
import TextRotateImpl from "./text-rotate"

export default { title: "Animation/Text Rotate", component: TextRotateImpl }

export const TextRotate = (args: ComponentProps<typeof TextRotateImpl>) => <TextRotateImpl {...args} />
