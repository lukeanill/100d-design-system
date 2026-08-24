import { Link } from "react-router"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"
import { Switch } from "@workspace/ui/components/switch"
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar"
import { Separator } from "@workspace/ui/components/separator"
import { Progress } from "@workspace/ui/components/progress"
import { Alert, AlertTitle, AlertDescription } from "@workspace/ui/components/alert"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@workspace/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@workspace/ui/components/dropdown-menu"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@workspace/ui/components/table"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@workspace/ui/components/tooltip"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@workspace/ui/components/popover"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@workspace/ui/components/sheet"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionPanel,
} from "@workspace/ui/components/animate-ui/components/base/accordion"
import { CopyButton } from "@workspace/ui/components/animate-ui/components/buttons/copy"
import { IconButton } from "@workspace/ui/components/animate-ui/components/buttons/icon"
import { RippleButton, RippleButtonRipples } from "@workspace/ui/components/animate-ui/components/buttons/ripple"
import { ThemeTogglerButton } from "@workspace/ui/components/animate-ui/components/buttons/theme-toggler"
import { BubbleBackgroundBrand } from "@workspace/ui/components/animate-ui/components/backgrounds/bubble-brand"
import { Heart } from "@workspace/ui/components/animate-ui/icons/heart"
import { ManagementBar } from "@workspace/ui/components/animate-ui/components/community/management-bar"
import { NotificationList } from "@workspace/ui/components/animate-ui/components/community/notification-list"
import { PlayfulTodolist } from "@workspace/ui/components/animate-ui/components/community/playful-todolist"
import { ShareButton } from "@workspace/ui/components/animate-ui/components/community/share-button"
import { StatCard, StatCardList } from "@workspace/ui/components/ui/stat-card"
import { Map } from "@workspace/ui/components/ui/map/map"
import { MapMarker } from "@workspace/ui/components/ui/map/marker"
import { MapControls, MapZoom } from "@workspace/ui/components/ui/map/controls"

const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN as string | undefined

const invoices = [
  { id: "INV-001", status: "Paid", amount: "$250.00" },
  { id: "INV-002", status: "Pending", amount: "$150.00" },
  { id: "INV-003", status: "Overdue", amount: "$350.00" },
]

export function App() {
  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-8 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Design System</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link to="/tokens">Tokens</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/qa">QA</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/history">History</Link>
          </Button>
          <ThemeTogglerButton variant="outline" modes={["light", "dark", "glass"]} />
        </div>
      </div>

      <section className="flex flex-wrap items-center gap-3">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Badge>Badge</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
      </section>

      <Separator />

      <section className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>LD</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">Luke</div>
                <div className="text-muted-foreground">luke@breezy.com</div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Luke" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select defaultValue="admin">
                <SelectTrigger id="role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notifs">Email notifications</Label>
              <Switch id="notifs" defaultChecked />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Storage</CardTitle>
            <CardDescription>68% used of 100 GB</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Progress value={68} />
            <Tabs defaultValue="files">
              <TabsList className="w-full">
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="shared">Shared</TabsTrigger>
                <TabsTrigger value="trash">Trash</TabsTrigger>
              </TabsList>
              <TabsContent value="files" className="text-muted-foreground text-sm">
                124 files across 12 folders.
              </TabsContent>
              <TabsContent value="shared" className="text-muted-foreground text-sm">
                8 items shared with your team.
              </TabsContent>
              <TabsContent value="trash" className="text-muted-foreground text-sm">
                Trash is empty.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      <Separator />

      <section className="flex flex-col gap-4">
        <Alert>
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>
            Your subscription renews in 3 days. Update your payment method to avoid interruption.
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap items-center gap-3">
          <Dialog>
            <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete project</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the project.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="outline">Cancel</Button>} />
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline">Open menu</Button>} />
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
            <PopoverContent className="text-sm">
              Set your preferences and click save.
            </PopoverContent>
          </Popover>

          <Sheet>
            <SheetTrigger render={<Button variant="outline">Open sheet</Button>} />
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>Make changes to your profile here.</SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <Button>Save changes</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
              <TooltipContent>Tooltip content</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex flex-wrap items-start gap-8">
          <div className="flex items-center gap-2">
            <Checkbox id="terms" defaultChecked />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>

          <RadioGroup defaultValue="comfortable" className="flex gap-4">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="compact" id="compact" />
              <Label htmlFor="compact">Compact</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="comfortable" id="comfortable" />
              <Label htmlFor="comfortable">Comfortable</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.status}</TableCell>
                  <TableCell className="text-right">{invoice.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="mt-2 h-20 w-full" />
          </div>
        </div>

        <Accordion className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is this animated?</AccordionTrigger>
            <AccordionPanel>
              Yes — this accordion uses the animate-ui Base UI component with animated height.
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What powers it?</AccordionTrigger>
            <AccordionPanel>
              Motion (Framer Motion) on top of Base UI primitives, matching our design system.
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </section>

      <Separator />

      <section className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <CopyButton content="npx shadcn add @workspace/ui" />
          <IconButton variant="outline">
            <Heart />
          </IconButton>
          <RippleButton variant="outline">
            Ripple
            <RippleButtonRipples />
          </RippleButton>
          <ShareButton size="sm">Share</ShareButton>
        </div>

        <div className="relative h-48 w-full overflow-hidden rounded-2xl border">
          <BubbleBackgroundBrand className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
            Bubble background — brand colors
          </BubbleBackgroundBrand>
        </div>

        <StatCard>
          <StatCardList />
        </StatCard>

        <div className="grid gap-6 sm:grid-cols-2">
          <ManagementBar />
          <NotificationList />
        </div>

        <PlayfulTodolist />

        <div className="h-72 w-full overflow-hidden rounded-2xl border">
          {mapboxToken ? (
            <Map accessToken={mapboxToken} center={[-122.4194, 37.7749]} zoom={10}>
              <MapControls>
                <MapZoom />
              </MapControls>
              <MapMarker coordinates={[-122.4194, 37.7749]} />
            </Map>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-center text-sm text-muted-foreground p-4">
              Set VITE_MAPBOX_ACCESS_TOKEN in apps/web/.env.local to preview the map.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
