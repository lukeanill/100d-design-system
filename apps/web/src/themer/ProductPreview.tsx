import { Heart as LuHeart, Sparkles, Star as LuStar, Flame } from "lucide-react"
import { HeartIcon as PhHeart, StarIcon as PhStar } from "@phosphor-icons/react"
import { lazy, Suspense, useLayoutEffect, useRef, useState, type CSSProperties } from "react"

import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@workspace/ui/components/animate-ui/components/base/accordion"
import { MorphingDiscoveryBar } from "@workspace/ui/components/animate-ui/components/base/morphing-discovery-bar"
import { ShareButton } from "@workspace/ui/components/animate-ui/components/community/share-button"
import { Button } from "@workspace/ui/components/button"
import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireTitle,
} from "@workspace/ui/components/questionnaire"
import { cn } from "@workspace/ui/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { AmountInput, AmountInputDisplay } from "@workspace/ui/components/ui/amount-input"
import type { ThemeDraft } from "@workspace/ui/themes"

import { productStyle } from "./state"

/**
 * "Page Product": a booking page for Coeurdes Alpes, built entirely from the
 * design system's own components and drawn at half size. It is a picture of the
 * theme being made, but it works: the buttons, accordion, share button and
 * questionnaires can be used, so a theme can be felt as well as seen. Every
 * colour, font, edge and icon in it comes from the draft, falling back to the
 * Alpes look from the Figma until a choice is made.
 */

/** The page is laid out at this width and scaled to whatever column it is given. */
const CANVAS = 1280

/* The map pulls in Leaflet and its tiles, so it loads after everything else. */
const Map = lazy(() =>
  import("@workspace/ui/components/ui/map-carousel").then(({ MapCarousel, MapCarouselContent }) => ({
    default: () => (
      <MapCarousel
        appearance={{ mapHeight: "489px" }}
        data={{
          center: [39.1911, -106.8175],
          zoom: 12,
          // Voyager's tiles now ask for an API key and draw a watermark instead; OpenStreetMap's do not
          mapStyle: "openstreetmap",
          locations: [
            { coordinates: [39.1911, -106.8175], image: "/themer/alpes-1.jpg", name: "Coeurdes Alpes", price: 560, priceLabel: "$560 per night", priceSubtext: "Includes taxes and fees", rating: 9.1, subtitle: "Aspen" },
            { coordinates: [39.2084, -106.9490], image: "/themer/alpes-2.jpg", name: "Snowmass Lodge", price: 410, priceLabel: "$410 per night", priceSubtext: "Includes taxes and fees", rating: 8.8, subtitle: "Snowmass Village" },
          ],
        }}
      >
        <MapCarouselContent />
      </MapCarousel>
    ),
  }))
)

/* --- icons the draft chooses ------------------------------------------------- */

type IconKind = "heart" | "star"

function Icon({ kind, draft, size }: { kind: IconKind; draft: ThemeDraft; size: number }) {
  const weight = draft.iconWeight ?? "fill"
  const color = kind === "heart" ? "var(--primary)" : "currentColor"
  if (draft.iconStyle === "lucide") {
    const L = kind === "heart" ? LuHeart : LuStar
    const fill = weight === "fill" || weight === "duotone"
    return <L size={size} color={color} fill={fill ? color : "none"} strokeWidth={weight === "thin" ? 1 : weight === "light" ? 1.5 : weight === "bold" ? 3 : 2} aria-hidden />
  }
  const P = kind === "heart" ? PhHeart : PhStar
  return <P size={size} color={color} weight={weight} aria-hidden />
}

/** The price: a number in the heading face, in the primary colour. */
function TextPrice({ price, currency = "$" }: { price: number; currency?: string }) {
  return (
    <p className="text-primary" style={{ fontFamily: "var(--font-primary)", fontWeight: 700, fontSize: 64, lineHeight: 1.1 }}>
      {currency}
      {price}
    </p>
  )
}

const Q = [
  { name: "ease", title: "How easy was the booking?", choices: ["Very easy", "Fine", "Hard"] },
]

function Page({ draft }: { draft: ThemeDraft }) {
  const body: CSSProperties = { fontFamily: "var(--font-body-token)", fontWeight: "var(--font-body-weight)" }
  return (
    <div className="bg-background text-foreground flex flex-col gap-20 px-16 py-12" style={{ ...body, width: CANVAS }}>
      <div className="flex gap-10">
        {/* the left half of the row is where the AI prompt bar was; it is not drawn, and the discovery bar keeps its place */}
        <div className="min-w-0 flex-1" />
        <div className="flex min-w-0 flex-1 justify-center">
          <MorphingDiscoveryBar
            defaultActive="new"
            categories={[
              { icon: <Sparkles size={16} />, id: "new", label: "New" },
              { icon: <Flame size={16} />, id: "popular", label: "Popular" },
              { icon: <LuHeart size={16} />, id: "favorites", label: "Favorites" },
            ]}
          />
        </div>
      </div>

      <div className="flex items-start gap-16">
        <div className="flex w-[510px] shrink-0 flex-col gap-6">
          {["alpes-1", "alpes-2"].map((name) => (
            <img key={name} src={`/themer/${name}.jpg`} alt="" className="h-[460px] w-full rounded-(--radius) border border-border object-cover" />
          ))}
          <Suspense fallback={<div className="h-[489px] rounded-(--radius) bg-muted" />}>
            <Map />
          </Suspense>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-16">
          <div className="flex flex-col gap-10">
            <div className="flex justify-end">
              <Button variant="secondary" size="icon-lg" className="rounded-full" aria-label="Favourite">
                <Icon kind="heart" draft={draft} size={18} />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 text-sm font-bold">
                <Icon kind="star" draft={draft} size={14} />
                4.5
              </div>
              <h2 style={{ fontFamily: "var(--font-primary)", fontWeight: "var(--h2-weight)", fontSize: 89, lineHeight: 1.2 }}>Coeurdes Alpes</h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Aspen Snowmass is a resort that feels unlike anywhere else in the United States. Sitting in the heart of Colorado's Rocky Mountains, the
                town of Aspen itself carries a certain elegance - historic Victorian buildings line streets where you'll find world-class restaurants
                alongside local coffee shops, and there's a genuine sense of community beneath the glamour.
              </p>
            </div>
          </div>

          <div className="bg-card flex flex-col gap-6 rounded-(--radius) p-7 shadow-md">
            <TextPrice price={560} />
            <AmountInput appearance={{ label: "Guests", min: 1, max: 12, step: 1, currency: "" }} control={{ value: 8 }}>
              <AmountInputDisplay />
            </AmountInput>
            <div className="flex flex-col gap-3">
              <Button size="lg">Reserve your space</Button>
              <Button size="lg" variant="outline" className="border-primary text-primary">
                More info
              </Button>
            </div>
          </div>

          {/* the Share group sits closer to the card above it than the page's other sections do */}
          <div className="-mt-8 flex flex-col gap-10">
            <div className="flex justify-center">
              <ShareButton>Share</ShareButton>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Breakfast</TableHead>
                  <TableHead>Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Monday to Friday</TableCell>
                  <TableCell>7:00 – 10:30</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Weekends</TableCell>
                  <TableCell>8:00 – 11:30</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Accordion defaultValue={["faq-1"]}>
              <AccordionItem value="faq-1">
                <AccordionTrigger>Is there parking?</AccordionTrigger>
                <AccordionPanel>Yes, a heated garage under the lodge, free for guests.</AccordionPanel>
              </AccordionItem>
              <AccordionItem value="faq-2">
                <AccordionTrigger>Can I bring a dog?</AccordionTrigger>
                <AccordionPanel>Dogs are welcome in the ground-floor rooms.</AccordionPanel>
              </AccordionItem>
            </Accordion>
            {/* extra room between the FAQs and the questionnaire */}
            {Q.map((q) => (
              <Questionnaire key={q.name} className="mt-10">
                <QuestionnaireItem name={q.name}>
                  <QuestionnaireTitle>{q.title}</QuestionnaireTitle>
                  <QuestionnaireChoices>
                    {q.choices.map((c) => (
                      <QuestionnaireChoice key={c} value={c}>
                        {c}
                      </QuestionnaireChoice>
                    ))}
                  </QuestionnaireChoices>
                </QuestionnaireItem>
              </Questionnaire>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * What the preview does not do. It is for feeling a theme, so nothing in it may
 * take the visitor out of the Themer: links never navigate, and the controls
 * that open a menu, dialog, popover, tooltip or map marker stay shut (those
 * open outside the scaled page, in Berghain rather than the draft's look).
 * Caught on the way in, so the controls themselves never see the click.
 */
const POPUPS = [
  "[aria-haspopup]",
  ".leaflet-marker-icon",
  '[data-slot^="popover"]',
  '[data-slot^="menu"]',
  '[data-slot^="dropdown"]',
  '[data-slot^="dialog"]',
  '[data-slot^="tooltip"]',
  '[data-slot^="select"]',
].join(",")

function guard(e: React.SyntheticEvent) {
  const target = e.target as Element
  if (target.closest("a[href]") && !target.closest(".leaflet-control-zoom")) e.preventDefault()
  if (target.closest(POPUPS)) {
    e.preventDefault()
    e.stopPropagation()
  }
}

/** The page at whatever width its column has: laid out at 1280 and scaled down to fit. */
export function ProductPreview({ draft, className }: { draft: ThemeDraft; className?: string }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ scale: 0.5, height: 0 })

  useLayoutEffect(() => {
    const measure = () => {
      if (!outer.current || !inner.current) return
      const scale = outer.current.clientWidth / CANVAS
      setFit({ scale, height: inner.current.offsetHeight * scale })
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (outer.current) observer.observe(outer.current)
    if (inner.current) observer.observe(inner.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={outer} className={cn("relative", className)} style={{ height: fit.height || undefined, overflow: "hidden" }}>
      {/* the theme's own variables, so the components inside read the draft and not the page around them */}
      <div ref={inner} onClickCapture={guard} onKeyDownCapture={(e) => (e.key === "Enter" || e.key === " ") && guard(e)} style={{ ...(productStyle(draft) as CSSProperties), position: "absolute", top: 0, left: 0, width: CANVAS, transform: `scale(${fit.scale})`, transformOrigin: "top left" }}>
        <Page draft={draft} />
      </div>
    </div>
  )
}
