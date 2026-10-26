import { useMemo, useState, type ReactNode } from "react"
import {
  MapTrifoldIcon,
  PersonSimpleRunIcon,
  PersonSimpleSwimIcon,
  TShirtIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react"
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts"

import { Calendar } from "@workspace/ui/components/calendar"
import { InsightCards } from "@workspace/ui/components/ai/insight-cards"
import { PromptBar } from "@workspace/ui/components/ai/prompt-bar"
import { StreamingText } from "@workspace/ui/components/ai/streaming-text"
import {
  MapCarousel,
  MapCarouselContent,
} from "@workspace/ui/components/ui/map-carousel"
import { MorphingDiscoveryBar } from "@workspace/ui/components/animate-ui/components/base/morphing-discovery-bar"
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@workspace/ui/components/animate-ui/components/base/accordion"
import { PlayfulTodolist } from "@workspace/ui/components/animate-ui/components/community/playful-todolist"

import type { Activity, MissionContent } from "./content"

/** A component at its own size, in a column of a set width. */
export function Sized({
  width,
  className,
  children,
}: {
  width: number
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className} style={{ width }}>
      {children}
    </div>
  )
}

export const PracticeList = ({ content }: { content: MissionContent }) => (
  <Sized width={290}>
    <PlayfulTodolist items={content.practice} />
  </Sized>
)

export const Analysis = ({ content }: { content: MissionContent }) => (
  <Sized width={320}>
    <StreamingText
      appearance={{ loop: false }}
      data={{
        content: [...content.analysis, { cite: true, text: "" }],
        followUps: content.followUps,
        sources: [
          { name: "Activity log", domain: "activitylog.app", href: "#" },
        ],
      }}
      labels={{ sources: "1 source" }}
    />
  </Sized>
)

function PaceCard({ series }: { series: number[] }) {
  return (
    <div className="min-h-[200px] rounded-lg bg-card p-3 ring-1 ring-foreground/10">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-foreground">
          Total performance
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10.5px] font-medium text-foreground/75">
          Snapshot
        </span>
      </div>
      <div className="mt-2 h-[150px] rounded-md bg-muted ring-1 ring-foreground/10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={series.map((value) => ({ value }))}
            margin={{ bottom: 12, left: 8, right: 8, top: 12 }}
          >
            <YAxis hide domain={["dataMin - 0.3", "dataMax + 0.3"]} reversed />
            <Line
              dataKey="value"
              type="monotone"
              stroke="var(--color-primary)"
              strokeWidth={2.25}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function Performance({ content }: { content: MissionContent }) {
  const pages = useMemo(
    () => [
      {
        key: "pace",
        pill: `Can I hold ${content.pace}?`,
        prose: (
          <>
            Your pace should drop by about 20% over eight weeks, ending at{" "}
            {content.pace}.
          </>
        ),
        Card: () => <PaceCard series={content.paceSeries} />,
      },
    ],
    [content]
  )
  return (
    <Sized width={320}>
      <InsightCards data={{ pages }} />
    </Sized>
  )
}

export const CheckIn = ({ content }: { content: MissionContent }) => (
  <Sized width={290} className="w-fit">
    <Calendar
      mode="multiple"
      selected={content.days}
      defaultMonth={content.days[0]}
    />
  </Sized>
)

export const Ask = () => (
  <Sized width={400}>
    <PromptBar
      appearance={{ variant: "Pill", demo: false }}
      data={{ placeholder: "Ask about your plan" }}
    />
  </Sized>
)

export const Faqs = ({ content }: { content: MissionContent }) => (
  <Sized width={400}>
    <Accordion defaultValue={["faq-0"]}>
      {content.faqs.map((faq, i) => (
        <AccordionItem key={faq.q} value={`faq-${i}`}>
          <AccordionTrigger>{faq.q}</AccordionTrigger>
          <AccordionPanel>{faq.a}</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  </Sized>
)

const SHOP_ICONS: Record<Activity, ReactNode[]> = {
  walk: [
    <TShirtIcon key="a" size={16} />,
    <UsersThreeIcon key="b" size={16} />,
    <MapTrifoldIcon key="c" size={16} />,
  ],
  run: [
    <TShirtIcon key="a" size={16} />,
    <UsersThreeIcon key="b" size={16} />,
    <PersonSimpleRunIcon key="c" size={16} />,
  ],
  swim: [
    <TShirtIcon key="a" size={16} />,
    <UsersThreeIcon key="b" size={16} />,
    <PersonSimpleSwimIcon key="c" size={16} />,
  ],
}

/** Places for whichever category is chosen, on a map, behind the discovery bar. */
export function Shop({
  activity,
  content,
}: {
  activity: Activity
  content: MissionContent
}) {
  const [category, setCategory] = useState(content.categories[0].id)
  const categories = content.categories.map((c, i) => ({
    ...c,
    icon: SHOP_ICONS[activity][i],
  }))
  const places = useMemo(() => content.places(category), [content, category])
  return (
    <div className="flex flex-col gap-2" style={{ width: 390 }}>
      <MorphingDiscoveryBar
        key={activity}
        categories={categories}
        defaultActive={category}
        onChange={setCategory}
      />
      <MapCarousel
        key={category}
        data={{ locations: places, center: [37.7899, -122.4034], zoom: 13 }}
        appearance={{ mapHeight: "400px" }}
      >
        <MapCarouselContent />
      </MapCarousel>
    </div>
  )
}
