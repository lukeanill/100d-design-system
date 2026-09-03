import { Fragment, useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

import { colorThemes } from "@workspace/ui/lib/theme-registry"
import { cn } from "@workspace/ui/lib/utils"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@workspace/ui/components/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@workspace/ui/components/card"
import { StatCard, StatCardList } from "@workspace/ui/components/ui/stat-card"
import { StatusBadge, StatusBadgeIcon, StatusBadgeLabel, type StatusType } from "@workspace/ui/components/ui/status-badge"
import { Progress, ProgressTrack, ProgressLabel, ProgressValue } from "@workspace/ui/components/animate-ui/components/base/progress"
import { Checkbox } from "@workspace/ui/components/animate-ui/components/base/checkbox"
import { Switch } from "@workspace/ui/components/animate-ui/components/base/switch"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import { Label } from "@workspace/ui/components/label"
import { Input } from "@workspace/ui/components/input"
import { Textarea } from "@workspace/ui/components/textarea"
import { AspectRatio } from "@workspace/ui/components/aspect-ratio"
import { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@workspace/ui/components/avatar"
import { MapCarousel, MapCarouselContent } from "@workspace/ui/components/ui/map-carousel"
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group"
import { Badge } from "@workspace/ui/components/badge"
import { Tooltip, TooltipTrigger, TooltipPanel } from "@workspace/ui/components/animate-ui/components/base/tooltip"
import AnimatedPathText from "@workspace/ui/components/fancy/text/text-along-path"
import { GradientText } from "@workspace/ui/components/animate-ui/primitives/texts/gradient"
import {
  Item,
  ItemGroup,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@workspace/ui/components/item"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@workspace/ui/components/chart"
import { BookOpenIcon, ArrowDownIcon, PaletteIcon } from "@phosphor-icons/react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@workspace/ui/components/drawer"

function ThemeSelect() {
  const { theme, setTheme } = useTheme()

  return (
    <Select value={theme} onValueChange={(value) => value && setTheme(value)}>
      <SelectTrigger className="w-52 text-sm font-medium">
        <PaletteIcon />
        <SelectValue placeholder="Theme">
          {(value: string) => colorThemes.find((t) => t.id === value)?.label ?? value}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {colorThemes.map((t) => (
          <SelectItem key={t.id} value={t.id}>
            {t.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

const THEME_SWATCH_COLORS: Record<string, string> = {
  light: "#212121",
  dark: "#FFFCFA",
  "electric-pulse": "#635CFF",
  "acid-forest": "#DFFF05",
  "carbon-mint": "#01FFC2",
  "solar-violet": "#706FD3",
  "arctic-aurora": "#002BFF",
  "strawberry-matcha": "#FF8392",
  "metallic-mist": "#3D5DB3",
}

function ThemeSwatches({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {colorThemes.map((t) => (
        <Tooltip key={t.id}>
          <TooltipTrigger
            render={
              <button
                type="button"
                onClick={() => setTheme(t.id)}
                aria-label={`Switch to ${t.label} theme`}
                aria-pressed={theme === t.id}
                className="size-6 shrink-0 rounded-full border border-foreground/15 transition-transform hover:scale-110"
                style={{
                  backgroundColor: THEME_SWATCH_COLORS[t.id],
                  outline: theme === t.id ? "2px solid var(--foreground)" : "none",
                  outlineOffset: 2,
                }}
              />
            }
          />
          <TooltipPanel>{t.label}</TooltipPanel>
        </Tooltip>
      ))}
    </div>
  )
}

type TypewriterSegment =
  | { type: "text"; value: string }
  | { type: "link"; value: string; href: string }
  | { type: "break" }

const CREDITS_SEGMENTS: TypewriterSegment[] = [
  { type: "text", value: "Made by " },
  { type: "link", value: "Luke", href: "https://www.linkedin.com/in/lukeillidge/" },
  { type: "text", value: " & Claude. Crafted to back 100 prototypes in 100 days." },
  { type: "break" },
  { type: "text", value: "Want to contribute? " },
  { type: "link", value: "Hit me up", href: "https://www.linkedin.com/in/lukeillidge/" },
  { type: "text", value: "." },
]

const SCRAMBLE_CHARS = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+"

function scrambledSlice(len: number) {
  return Array.from({ length: Math.max(0, len) }, () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]).join("")
}

function RichScrambleText({
  segments,
  className,
  speed = 45,
  scrambledLetterCount = 3,
}: {
  segments: TypewriterSegment[]
  className?: string
  speed?: number
  scrambledLetterCount?: number
}) {
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(0)
  const [tick, setTick] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    const segment = segments[index]
    if (!segment) {
      setDone(true)
      return
    }

    if (segment.type === "break") {
      const id = setTimeout(() => {
        setIndex((i) => i + 1)
        setRevealed(0)
        setTick(0)
      }, speed)
      return () => clearTimeout(id)
    }

    const totalTicks = segment.value.length + scrambledLetterCount
    if (tick < totalTicks) {
      const id = setTimeout(() => {
        setTick((t) => t + 1)
        setRevealed((r) => Math.min(r + 1, segment.value.length))
      }, speed)
      return () => clearTimeout(id)
    }

    const id = setTimeout(() => {
      setIndex((i) => i + 1)
      setRevealed(0)
      setTick(0)
    }, speed)
    return () => clearTimeout(id)
  }, [segments, index, tick, done, speed, scrambledLetterCount])

  return (
    <p className={className}>
      {segments.map((segment, i) => {
        if (i > index) return null
        if (segment.type === "break") return <br key={i} />

        const isCurrent = i === index
        if (!isCurrent) {
          if (segment.type === "link") {
            return (
              <a
                key={i}
                href={segment.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-secondary-foreground"
              >
                {segment.value}
              </a>
            )
          }
          return <Fragment key={i}>{segment.value}</Fragment>
        }

        const scrambleCount = Math.min(segment.value.length - revealed, scrambledLetterCount)
        const content = (
          <>
            {segment.value.slice(0, revealed)}
            {scrambledSlice(scrambleCount)}
          </>
        )
        return segment.type === "link" ? (
          <span key={i} className="underline underline-offset-4 opacity-70">
            {content}
          </span>
        ) : (
          <Fragment key={i}>{content}</Fragment>
        )
      })}
      {!done && <span className="animate-pulse">|</span>}
    </p>
  )
}

const revenueData = [
  { month: "Apr", value: 84 },
  { month: "May", value: 91 },
  { month: "Jun", value: 88 },
  { month: "Jul", value: 103 },
  { month: "Aug", value: 112 },
  { month: "Sep", value: 128 },
]

const revenueConfig = {
  value: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig

const shipmentsData = [
  { day: "Mon", shipped: 32 },
  { day: "Tue", shipped: 41 },
  { day: "Wed", shipped: 28 },
  { day: "Thu", shipped: 47 },
  { day: "Fri", shipped: 39 },
]

const shipmentsConfig = {
  shipped: { label: "Shipped", color: "var(--chart-2)" },
} satisfies ChartConfig

const barPatternIds = ["brand-stripes", "brand-waves", "brand-crosshatch"]
const barPatternOrder = [0, 2, 1, 0, 2]

interface Shipment {
  id: string
  route: string
  carrier: string
  eta: string
  status: StatusType
  image: string
  notes: string
}

const shipments: Shipment[] = [
  {
    id: "#4821",
    route: "Portland, OR → Austin, TX",
    carrier: "FreightLine",
    eta: "Tomorrow, 2:00 PM",
    status: "shipped",
    image: "https://picsum.photos/seed/freightline-truck/200/200",
    notes: "",
  },
  {
    id: "#4820",
    route: "Reno, NV → Denver, CO",
    carrier: "SwiftHaul",
    eta: "Delivered 08:12",
    status: "delivered",
    image: "https://picsum.photos/seed/swifthaul-van/200/200",
    notes: "Left at front desk per customer request.",
  },
  {
    id: "#4819",
    route: "Boise, ID → Salt Lake City, UT",
    carrier: "FreightLine",
    eta: "Held at customer request",
    status: "cancelled",
    image: "https://picsum.photos/seed/freightline-depot/200/200",
    notes: "Customer rescheduled — awaiting new pickup window.",
  },
]

function ShipmentDrawer({ shipment, open, onOpenChange }: { shipment: Shipment | null; open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        {shipment && (
          <>
            <DrawerHeader>
              <AspectRatio ratio={16 / 9} className="mb-2 overflow-hidden rounded-lg">
                <img src={shipment.image} alt={shipment.route} className="size-full object-cover" />
              </AspectRatio>
              <DrawerTitle>{shipment.route}</DrawerTitle>
              <DrawerDescription>
                {shipment.id} &middot; {shipment.carrier} &middot; {shipment.eta}
              </DrawerDescription>
              <StatusBadge data={{ status: shipment.status }} className="mt-1 w-fit">
                <StatusBadgeIcon />
                <StatusBadgeLabel />
              </StatusBadge>
            </DrawerHeader>

            <div className="flex flex-col gap-4 overflow-y-auto px-6">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="tracking-number" className="text-xs text-foreground">
                  Tracking number
                </Label>
                <Input id="tracking-number" defaultValue={`TRK-${shipment.id.replace("#", "")}-US`} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="shipment-notes" className="text-xs text-foreground">
                  Internal notes
                </Label>
                <Textarea id="shipment-notes" defaultValue={shipment.notes} placeholder="Add a note for the fulfillment team…" rows={4} />
              </div>
            </div>

            <DrawerFooter>
              <Button>Save changes</Button>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  )
}

export function Showcase() {
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const openShipment = (shipment: Shipment) => {
    setActiveShipment(shipment)
    setDrawerOpen(true)
  }

  return (
    <div className="min-h-svh bg-background">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-muted bg-background/95 px-6 py-3 backdrop-blur">
        <Button
          variant="outline"
          nativeButton={false}
          render={
            <a href="/storybook" target="_blank" rel="noopener noreferrer" title="Open Storybook">
              <BookOpenIcon />
              Storybook
            </a>
          }
        />
        <div className="flex items-center gap-2">
          <ThemeSelect />
        </div>
      </div>

      <section className="border-b border-muted px-6 py-20 sm:py-28">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Extended shadcn/ui</Badge>
            <Badge variant="outline">9 demo themes</Badge>
          </div>

          <h1 className="text-balance">
            <GradientText
              text="100D Design System"
              neon
              gradient="linear-gradient(90deg, var(--accent-foreground) 0%, var(--muted-foreground) 20%, var(--accent-foreground) 50%, var(--muted-foreground) 80%, var(--accent-foreground) 100%)"
            />
          </h1>

          <RichScrambleText className="max-w-xl min-h-11 text-body-small text-foreground" segments={CREDITS_SEGMENTS} />

          <ThemeSwatches className="mt-6" />
        </div>

        <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 pt-16 text-center">
          <ArrowDownIcon className="size-8 animate-bounce text-secondary-foreground" />
          <p className="text-body-small text-secondary-foreground">See it in action &mdash; an example report</p>
        </div>
      </section>

      <div className="mx-auto flex max-w-3xl flex-col gap-14 p-6 py-10">
        {/* Editorial header */}
        <div className="flex flex-col gap-4">
          <h2>Fulfillment report, Q3</h2>
          <p className="text-body-lg text-foreground">
            Revenue grew for the third straight quarter, driven mostly by repeat customers rather than new
            acquisition. Warehouse throughput kept pace, though a handful of shipments are running behind
            schedule this week.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AvatarGroup>
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/64?img=5" alt="Priya Nair" />
              <AvatarFallback>PN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/64?img=15" alt="Devon Clarke" />
              <AvatarFallback>DC</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/64?img=32" alt="Mara Ito" />
              <AvatarFallback>MI</AvatarFallback>
            </Avatar>
            <AvatarGroupCount>+2</AvatarGroupCount>
          </AvatarGroup>
          <p className="text-body-small text-secondary-foreground">Report by Priya, Devon, Mara and 2 others</p>
        </div>

        <StatCard
          data={{
            stats: [
              { label: "Revenue", value: "$128,430", change: 12.4, changeLabel: "vs Q2", trend: "up" },
              { label: "Orders", value: "3,214", change: 2.1, changeLabel: "vs Q2", trend: "down" },
              { label: "Repeat rate", value: "61%", change: 8.9, changeLabel: "vs Q2", trend: "up" },
            ],
          }}
        >
          <StatCardList className="sm:grid-cols-3" />
        </StatCard>

        <blockquote className="border-l-2 border-foreground py-1 pl-6">
          <p className="text-body-lg-serif font-serif text-foreground">
            &ldquo;The repeat-purchase number is the one I keep coming back to &mdash; it&apos;s the clearest sign
            the product is earning trust, not just attention.&rdquo;
          </p>
          <p className="mt-2 text-body-small text-foreground">&mdash; Head of Growth</p>
        </blockquote>

        <Card>
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
            <CardDescription>Trailing 6 months, in thousands</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueConfig} className="h-48 w-full">
              <AreaChart data={revenueData}>
                <defs>
                  <pattern id="brand-waves" width="10" height="6" patternUnits="userSpaceOnUse">
                    <path d="M0 3 Q2.5 0 5 3 T10 3" fill="none" stroke="var(--primary)" strokeWidth="1" opacity="0.5" />
                  </pattern>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={28} />
                <ChartTooltip cursor={{ stroke: "var(--primary)", strokeWidth: 1, strokeDasharray: "4 4" }} content={<ChartTooltipContent />} />
                <Area dataKey="value" stroke="var(--primary)" strokeWidth={2} fill="url(#brand-waves)" dot={false} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <p className="text-body-small text-foreground">Figure 1. Monthly revenue, April through September.</p>
          </CardFooter>
        </Card>

        <Separator />

        {/* Operational section */}
        <div className="flex flex-col gap-2">
          <h6>Fulfillment, this week</h6>
          <p className="text-body text-foreground">
            Most orders are moving on schedule. Nine shipments are delayed &mdash; two are close to breaching SLA.
          </p>
        </div>

        <Card className="overflow-hidden p-0">
          <MapCarousel
            data={{
              center: [52.52, 13.405],
              title: "New Berlin warehouses",
              zoom: 11,
              mapStyle: "voyager",
              locations: [
                {
                  coordinates: [52.5836, 13.3325],
                  image: "https://picsum.photos/seed/berlin-warehouse-1/400/300",
                  name: "Reinickendorf Distribution Center",
                  subtitle: "Reinickendorf",
                },
                {
                  coordinates: [52.47, 13.4014],
                  image: "https://picsum.photos/seed/berlin-warehouse-2/400/300",
                  name: "Tempelhof Fulfillment Hub",
                  subtitle: "Tempelhof",
                },
                {
                  coordinates: [52.5447, 13.5859],
                  image: "https://picsum.photos/seed/berlin-warehouse-3/400/300",
                  name: "Marzahn Logistics Park",
                  subtitle: "Marzahn",
                },
              ],
            }}
            appearance={{ displayMode: "inline", mapHeight: "360px" }}
          >
            <MapCarouselContent />
          </MapCarousel>
        </Card>

        <Card>
          <CardContent className="flex flex-wrap items-end gap-4">
            <div className="flex min-w-48 flex-1 flex-col gap-1.5">
              <Label htmlFor="shipment-search" className="text-xs text-foreground">
                Search
              </Label>
              <Input id="shipment-search" placeholder="Search by route or carrier…" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-foreground">Status</Label>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Label className="pb-2">
              <Checkbox defaultChecked={false} />
              Show cancelled
            </Label>
            <Label className="pb-2">
              <Switch defaultChecked />
              Auto-refresh
            </Label>
            <Button variant="outline" size="sm" className="ml-auto">
              Export CSV
            </Button>
          </CardContent>
        </Card>

        <StatCard
          data={{
            stats: [
              { label: "Open shipments", value: "142", change: 6.2, changeLabel: "vs last week", trend: "up" },
              { label: "Delayed", value: "9", change: 3.0, changeLabel: "vs last week", trend: "down" },
              { label: "Delivered today", value: "58", change: 11.4, changeLabel: "vs last week", trend: "up" },
              { label: "SLA breaches", value: "2", change: 1.0, changeLabel: "vs last week", trend: "down" },
            ],
          }}
        >
          <StatCardList className="sm:grid-cols-2 lg:grid-cols-4" />
        </StatCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Weekly goals</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <Progress value={82} className="w-full">
                <div className="flex items-center justify-between">
                  <ProgressLabel>Fulfillment goal</ProgressLabel>
                  <ProgressValue />
                </div>
                <ProgressTrack />
              </Progress>
              <Progress value={45} className="w-full">
                <div className="flex items-center justify-between">
                  <ProgressLabel>Returns processed</ProgressLabel>
                  <ProgressValue />
                </div>
                <ProgressTrack />
              </Progress>
              <Progress value={97} className="w-full">
                <div className="flex items-center justify-between">
                  <ProgressLabel>On-time delivery</ProgressLabel>
                  <ProgressValue />
                </div>
                <ProgressTrack />
              </Progress>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipments per day</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={shipmentsConfig} className="h-40 w-full">
                <BarChart data={shipmentsData}>
                  <defs>
                    <pattern id="brand-stripes" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <rect width="4" height="4" fill="var(--card)" />
                      <line x1="0" y1="0" x2="0" y2="4" stroke="var(--primary)" strokeWidth="2" />
                    </pattern>
                    <pattern id="brand-waves" width="4.5" height="4" patternUnits="userSpaceOnUse">
                      <rect width="4.5" height="4" fill="var(--card)" />
                      <path d="M0 1 Q1.125 -0.5 2.25 1 T4.5 1" fill="none" stroke="var(--primary)" strokeWidth="1.25" />
                      <path d="M0 3 Q1.125 1.5 2.25 3 T4.5 3" fill="none" stroke="var(--primary)" strokeWidth="1.25" />
                    </pattern>
                    <pattern id="brand-crosshatch" width="4" height="4" patternUnits="userSpaceOnUse">
                      <rect width="4" height="4" fill="var(--card)" />
                      <path d="M0 0 L4 4 M4 0 L0 4" stroke="var(--primary)" strokeWidth="0.75" />
                    </pattern>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={24} />
                  <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent />} />
                  <Bar dataKey="shipped" radius={6}>
                    {shipmentsData.map((entry, index) => (
                      <Cell key={entry.day} fill={`url(#${barPatternIds[barPatternOrder[index % barPatternOrder.length]]})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Shipments</CardTitle>
            <CardDescription>Updated 4 minutes ago &middot; select one for details</CardDescription>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              {shipments.map((shipment) => (
                <Item key={shipment.id}>
                  <ItemMedia>
                    <div className="size-10 overflow-hidden rounded-md">
                      <img src={shipment.image} alt="" className="size-full object-cover" />
                    </div>
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      {shipment.route} &middot; {shipment.id}
                    </ItemTitle>
                    <ItemDescription>
                      {shipment.carrier} &middot; {shipment.eta}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="gap-2">
                    <StatusBadge data={{ status: shipment.status }}>
                      <StatusBadgeIcon />
                      <StatusBadgeLabel />
                    </StatusBadge>
                    <Button variant="outline" size="sm" onClick={() => openShipment(shipment)}>
                      View details
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <h6>Highlights</h6>
          <ItemGroup>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>Repeat customers now drive most of revenue</ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>Order volume dipped as the discount campaign wound down</ItemTitle>
              </ItemContent>
            </Item>
            <Item variant="muted" size="sm">
              <ItemContent>
                <ItemTitle>Two shipments are close to breaching SLA and need attention</ItemTitle>
              </ItemContent>
            </Item>
          </ItemGroup>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Was this report useful?</CardTitle>
            <CardDescription>Quick feedback helps us shape next quarter&apos;s report.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <RadioGroup defaultValue="very-useful" className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="very-useful" id="fb-very-useful" />
                <Label htmlFor="fb-very-useful" className="font-normal">Very useful</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="somewhat-useful" id="fb-somewhat-useful" />
                <Label htmlFor="fb-somewhat-useful" className="font-normal">Somewhat useful</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="not-useful" id="fb-not-useful" />
                <Label htmlFor="fb-not-useful" className="font-normal">Not useful</Label>
              </div>
            </RadioGroup>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="fb-email" className="text-xs text-foreground">
                Email (optional)
              </Label>
              <Input id="fb-email" type="email" placeholder="you@company.com" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Send feedback</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="w-full py-20">
        <AnimatedPathText
          path="M0,292 C96.25,220 192.5,220 288.75,236 C385,250 467.5,250 550,257 C632.5,263 687.5,280 763.125,276 C893.75,268 990,240 1100,224"
          text="I gave Claude a free pass to add one cool thing here · "
          viewBox="0 0 1100 400"
          duration={14}
          showPath={false}
          svgClassName="text-secondary-foreground"
          textClassName="text-[30px] font-mono tracking-wide"
        />
      </div>

      <ShipmentDrawer shipment={activeShipment} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  )
}
