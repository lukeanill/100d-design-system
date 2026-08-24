import type { ComponentProps } from "react"
import { CodeBlock as CodeBlockImpl } from "./code-block"

export default { title: "Animation/Code Block (Animate)", component: CodeBlockImpl }

export const CodeBlock = (args: ComponentProps<typeof CodeBlockImpl>) => <CodeBlockImpl {...args} />
