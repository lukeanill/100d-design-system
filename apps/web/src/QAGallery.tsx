import { Link } from "react-router"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { Switch } from "@workspace/ui/components/switch"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"
import { Alert, AlertTitle, AlertDescription } from "@workspace/ui/components/alert"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@workspace/ui/components/card"
import { Progress } from "@workspace/ui/components/progress"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Separator } from "@workspace/ui/components/separator"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@workspace/ui/components/tooltip"

const THEMES = ["light", "dark", "glass"] as const

function ThemeFrame({
  theme,
  children,
}: {
  theme: (typeof THEMES)[number]
  children: React.ReactNode
}) {
  return (
    <div
      className={`${theme} flex flex-col gap-4 rounded-2xl border bg-background p-5 text-foreground`}
    >
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {theme}
      </div>
      {children}
    </div>
  )
}

function Section({ title, render }: { title: string; render: () => React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {THEMES.map((theme) => (
          <ThemeFrame key={theme} theme={theme}>
            {render()}
          </ThemeFrame>
        ))}
      </div>
    </section>
  )
}

export function QAGallery() {
  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col gap-10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Automated Design QA</h1>
          <p className="text-muted-foreground text-sm">
            Every core component previewed across light, dark, and glass themes.
          </p>
        </div>
        <Button variant="outline" nativeButton={false} render={<Link to="/">Back to preview</Link>} />
      </div>

      <Section
        title="Buttons"
        render={() => (
          <div className="flex flex-wrap items-center gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        )}
      />

      <Section
        title="Badges"
        render={() => (
          <div className="flex flex-wrap items-center gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        )}
      />

      <Section
        title="Inputs &amp; Select"
        render={() => (
          <div className="flex flex-col gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor={`qa-input`}>Name</Label>
              <Input id="qa-input" placeholder="Luke" />
            </div>
            <div className="grid gap-1.5">
              <Label>Role</Label>
              <Select defaultValue="admin">
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      />

      <Section
        title="Checkbox, Radio &amp; Switch"
        render={() => (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Checkbox id="qa-checkbox" defaultChecked />
              <Label htmlFor="qa-checkbox">Accept terms</Label>
            </div>
            <RadioGroup defaultValue="a" className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="a" id="qa-radio-a" />
                <Label htmlFor="qa-radio-a">Option A</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="b" id="qa-radio-b" />
                <Label htmlFor="qa-radio-b">Option B</Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
              <Switch id="qa-switch" defaultChecked />
              <Label htmlFor="qa-switch">Notifications</Label>
            </div>
          </div>
        )}
      />

      <Section
        title="Tabs"
        render={() => (
          <Tabs defaultValue="one">
            <TabsList className="w-full">
              <TabsTrigger value="one">One</TabsTrigger>
              <TabsTrigger value="two">Two</TabsTrigger>
            </TabsList>
            <TabsContent value="one" className="text-sm text-muted-foreground">
              First panel content.
            </TabsContent>
            <TabsContent value="two" className="text-sm text-muted-foreground">
              Second panel content.
            </TabsContent>
          </Tabs>
        )}
      />

      <Section
        title="Alert"
        render={() => (
          <Alert>
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>This is an alert in the current theme.</AlertDescription>
          </Alert>
        )}
      />

      <Section
        title="Card &amp; Avatar"
        render={() => (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>LD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Luke</CardTitle>
                  <CardDescription>Design system</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Card content sample.
            </CardContent>
          </Card>
        )}
      />

      <Section
        title="Progress, Skeleton &amp; Separator"
        render={() => (
          <div className="flex flex-col gap-3">
            <Progress value={62} />
            <Skeleton className="h-4 w-3/4" />
            <Separator />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger render={<Button variant="outline" size="sm">Hover me</Button>} />
                <TooltipContent>Tooltip content</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      />
    </div>
  )
}
