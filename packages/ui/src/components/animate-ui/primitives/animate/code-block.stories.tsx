import type { ComponentProps } from "react"
import { CodeBlock as CodeBlockImpl } from "./code-block"

export default { title: "Animation/Code Block Animate", component: CodeBlockImpl, args: { code: "console.log(\"hello world\")", lang: "ts" } }

export const CodeBlockAnimate = (args: ComponentProps<typeof CodeBlockImpl>) => <CodeBlockImpl {...args} />
