import type { ComponentProps } from "react"
import { CodeBlock as CodeBlockImpl } from "./code-block"

export default { title: "Animation/Code Block Animate", component: CodeBlockImpl }

export const CodeBlockAnimate = (args: ComponentProps<typeof CodeBlockImpl>) => <CodeBlockImpl {...args} />
