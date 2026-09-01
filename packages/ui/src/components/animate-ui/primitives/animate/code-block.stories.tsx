import type { ComponentProps } from "react"
import { CodeBlock as CodeBlockImpl } from "./code-block"

export default {
  title: "Animation/Text/Reveal/Code Block",
  component: CodeBlockImpl,
  argTypes: {
    theme: { control: "select", options: ["light", "dark"] },
    duration: { control: { type: "range", min: 500, max: 10000, step: 100 } },
    delay: { control: { type: "range", min: 0, max: 5000, step: 100 } },
    themes: { table: { disable: true } },
    onDone: { table: { disable: true } },
    onWrite: { table: { disable: true } },
    scrollContainerRef: { table: { disable: true } },
    inViewMargin: { table: { disable: true } },
  },
  args: {
    code: "console.log(\"hello world\")",
    lang: "ts",
    theme: "light",
    writing: true,
    duration: 3000,
    delay: 0,
    inView: false,
    inViewOnce: true,
  },
}

export const CodeBlockAnimate = (args: ComponentProps<typeof CodeBlockImpl>) => <CodeBlockImpl {...args} />
