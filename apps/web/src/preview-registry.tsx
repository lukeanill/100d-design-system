import * as React from "react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Switch } from "@workspace/ui/components/switch"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Progress } from "@workspace/ui/components/progress"
import { Alert, AlertTitle, AlertDescription } from "@workspace/ui/components/alert"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Separator } from "@workspace/ui/components/separator"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"

// Hand-authored previews for components that need real demo data/structure to look
// meaningful (compound components, things needing specific variants shown together).
export const PREVIEW_REGISTRY: Record<string, () => React.ReactNode> = {
  "button.tsx": () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  ),
  "badge.tsx": () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
    </div>
  ),
  "avatar.tsx": () => (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarFallback>LD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    </div>
  ),
  "switch.tsx": () => (
    <div className="flex items-center gap-3">
      <Switch defaultChecked />
      <Switch />
    </div>
  ),
  "checkbox.tsx": () => (
    <div className="flex items-center gap-3">
      <Checkbox defaultChecked />
      <Checkbox />
    </div>
  ),
  "progress.tsx": () => <Progress value={68} className="w-full" />,
  "alert.tsx": () => (
    <Alert>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>This is what an alert looks like.</AlertDescription>
    </Alert>
  ),
  "skeleton.tsx": () => (
    <div className="flex w-full flex-col gap-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  ),
  "separator.tsx": () => (
    <div className="w-full">
      <div className="text-sm">Above</div>
      <Separator className="my-2" />
      <div className="text-sm">Below</div>
    </div>
  ),
  "input.tsx": () => <Input placeholder="Type something…" className="w-full" />,
  "label.tsx": () => <Label>Field label</Label>,
}

// Real source files, read at build time — not fabricated. `?raw` gives the file's
// literal text content.
const rawSources = import.meta.glob("../../../packages/ui/src/components/**/*.tsx", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

export function getSource(path: string): string | undefined {
  return rawSources[`../../../packages/ui/src/components/${path}`]
}

// Every component module, loaded for real (not raw text) so we can attempt to
// render any of them generically.
const modules = import.meta.glob("../../../packages/ui/src/components/**/*.tsx", {
  eager: true,
}) as Record<string, Record<string, unknown>>

function normalize(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "")
}

// Best-effort resolution of "the" component to preview from a module's exports:
// prefer an export whose name matches the filename, then default export, then
// the first exported function.
function resolveComponent(path: string): React.ComponentType<any> | null {
  const mod = modules[`../../../packages/ui/src/components/${path}`]
  if (!mod) return null

  const filename = path.split("/").pop()!.replace(/\.tsx$/, "")
  const targetKey = normalize(filename)

  const namedMatch = Object.entries(mod).find(
    ([key, value]) => typeof value === "function" && normalize(key) === targetKey
  )
  if (namedMatch) return namedMatch[1] as React.ComponentType<any>

  if (typeof mod.default === "function") return mod.default as React.ComponentType<any>

  const firstFn = Object.values(mod).find((value) => typeof value === "function")
  return (firstFn as React.ComponentType<any>) ?? null
}

type BoundaryState = { stage: number; exhausted: boolean }

// Renders successive fallback variants of a component, catching render errors
// (missing required props/context, etc.) and trying the next, simpler variant.
// If every variant fails, shows an honest "no live preview" message rather than
// fabricating one.
class AutoPreviewBoundary extends React.Component<
  { variants: Array<() => React.ReactNode> },
  BoundaryState
> {
  state: BoundaryState = { stage: 0, exhausted: false }

  componentDidCatch() {
    const next = this.state.stage + 1
    if (next >= this.props.variants.length) {
      this.setState({ exhausted: true })
    } else {
      this.setState({ stage: next })
    }
  }

  render() {
    if (this.state.exhausted) {
      return (
        <span className="text-muted-foreground text-sm">
          No live preview available for this component.
        </span>
      )
    }
    return <React.Fragment key={this.state.stage}>{this.props.variants[this.state.stage]()}</React.Fragment>
  }
}

export function AutoPreview({ path }: { path: string }) {
  const Component = resolveComponent(path)
  if (!Component) {
    return (
      <span className="text-muted-foreground text-sm">
        No live preview available for this component.
      </span>
    )
  }
  return (
    <AutoPreviewBoundary
      variants={[
        () => <Component />,
        () => <Component>Preview</Component>,
      ]}
    />
  )
}
