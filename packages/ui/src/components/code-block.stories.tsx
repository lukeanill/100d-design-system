import { useState, type ComponentProps } from "react"
import { ArrowBendDownLeftIcon, DownloadSimpleIcon, FileTsIcon, TerminalWindowIcon } from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"

import { ThemedIcon } from "@workspace/ui/components/themed-icon"
import { useHighlightedCode } from "@workspace/ui/hooks/use-highlighted-code"
import {
  CodeBlock as CodeBlockImpl,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "./code-block"

const route = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    system: "You are a helpful assistant. Answer in one short paragraph.",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`

const sample = `import { Button } from "@workspace/ui/components/button"

// A button in the theme's colours
export function Save({ onSave }: { onSave: () => void }) {
  const label = "Save changes"
  return <Button onClick={onSave}>{label}</Button>
}`

export default {
  title: "Components/Content/Code Block",
  component: CodeBlockImpl,
  argTypes: {
    variant: { control: "select", options: ["default", "destructive"] },
    size: { control: "select", options: ["default", "sm"] },
  },
  args: { variant: "default", size: "default" },
}

type DefaultArgs = ComponentProps<typeof CodeBlockImpl> & {
  title: string
  language: string
  code: string
  lineNumbers: boolean
  wrap: boolean
  highlightFrom: number
  highlightTo: number
}

export const Default = ({ title, language, code, lineNumbers, wrap, highlightFrom, highlightTo, ...args }: DefaultArgs) => {
  const lines = useHighlightedCode(code, language)
  const [wrapped, setWrapped] = useState(wrap)
  const download = () => {
    const url = URL.createObjectURL(new Blob([code], { type: "text/plain" }))
    const a = document.createElement("a")
    a.href = url
    a.download = title
    a.click()
    URL.revokeObjectURL(url)
  }
  return (
    <CodeBlockImpl {...args}>
      <CodeBlockHeader>
        <CodeBlockTitle>
          <ThemedIcon phosphor={FileTsIcon} />
          {title}
        </CodeBlockTitle>
        <CodeBlockActions>
          <Button variant="ghost" size="icon-xs" aria-label="Toggle wrap" aria-pressed={wrapped} onClick={() => setWrapped((w) => !w)}>
            <ThemedIcon phosphor={ArrowBendDownLeftIcon} className="size-3" />
          </Button>
          <Button variant="ghost" size="icon-xs" aria-label="Download" onClick={download}>
            <ThemedIcon phosphor={DownloadSimpleIcon} className="size-3" />
          </Button>
          <CodeBlockCopyButton value={code} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers={lineNumbers} wrap={wrapped}>
        {lines.map((line, index) => (
          <CodeBlockLine key={index} variant={index + 1 >= highlightFrom && index + 1 <= highlightTo ? "highlighted" : "default"}>
            {line}
          </CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlockImpl>
  )
}
Default.args = {
  title: "app/api/chat/route.ts",
  language: "ts",
  code: route,
  lineNumbers: true,
  wrap: false,
  highlightFrom: 6,
  highlightTo: 10,
}
Default.argTypes = {
  language: { control: "select", options: ["ts", "tsx", "js", "json", "css", "html", "bash", "python", "sql", "yaml", "markdown"] },
  code: { control: "text" },
  highlightFrom: { control: { type: "number", min: 0 } },
  highlightTo: { control: { type: "number", min: 0 } },
}

export const Terminal = (args: ComponentProps<typeof CodeBlockImpl>) => (
  <CodeBlockImpl {...args}>
    <CodeBlockHeader>
      <CodeBlockTitle>
        <ThemedIcon phosphor={TerminalWindowIcon} />
        Terminal
      </CodeBlockTitle>
      <CodeBlockActions>
        <CodeBlockCopyButton value="pnpm dlx shadcn@latest add code-block" />
      </CodeBlockActions>
    </CodeBlockHeader>
    <CodeBlockContent>pnpm dlx shadcn@latest add code-block</CodeBlockContent>
  </CodeBlockImpl>
)

export const Highlighted = (args: ComponentProps<typeof CodeBlockImpl>) => {
  const lines = useHighlightedCode(sample, "tsx")
  return (
    <CodeBlockImpl {...args}>
      <CodeBlockHeader>
        <CodeBlockTitle>save.tsx</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={sample} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent lineNumbers>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
      <CodeBlockFooter>tsx · 7 lines</CodeBlockFooter>
    </CodeBlockImpl>
  )
}

export const Diff = (args: ComponentProps<typeof CodeBlockImpl>) => (
  <CodeBlockImpl {...args}>
    <CodeBlockHeader>
      <CodeBlockTitle>package.json</CodeBlockTitle>
    </CodeBlockHeader>
    <CodeBlockContent>
      <CodeBlockLine>{`"dependencies": {`}</CodeBlockLine>
      <CodeBlockLine variant="removed">{`  "react": "^18.2.0",`}</CodeBlockLine>
      <CodeBlockLine variant="added">{`  "react": "^19.0.0",`}</CodeBlockLine>
      <CodeBlockLine variant="highlighted">{`  "shiki": "^4.4.3"`}</CodeBlockLine>
      <CodeBlockLine>{`}`}</CodeBlockLine>
    </CodeBlockContent>
  </CodeBlockImpl>
)

export const Destructive = (args: ComponentProps<typeof CodeBlockImpl>) => (
  <CodeBlockImpl {...args} variant="destructive" size="sm">
    <CodeBlockHeader>
      <CodeBlockTitle>Error</CodeBlockTitle>
    </CodeBlockHeader>
    <CodeBlockContent wrap>{`TypeError: Cannot read properties of undefined (reading 'map')\n    at render (app.tsx:42:11)`}</CodeBlockContent>
  </CodeBlockImpl>
)
