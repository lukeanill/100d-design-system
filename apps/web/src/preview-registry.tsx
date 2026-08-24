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

// Live previews for components that render sensibly with no required props/children.
// Most of the 200+ components in the library need specific props, triggers, or
// context providers, so this registry is intentionally a curated subset — everything
// else falls back to showing its source only.
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
