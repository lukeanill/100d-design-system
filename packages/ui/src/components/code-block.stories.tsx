import type { ComponentProps } from "react"
import { TerminalWindowIcon } from "@phosphor-icons/react"

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

export const CodeBlock = (args: ComponentProps<typeof CodeBlockImpl>) => (
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
