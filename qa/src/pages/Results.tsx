import { CaretCircleUpIcon } from "@phosphor-icons/react"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router"

import { cn } from "@workspace/ui/lib/utils"

import { GRADES, gradeSummary, type Grade, type Rating } from "../../shared/grade"
import { getTest, rate, type TestDetail } from "../api"
import { Section } from "../components/Section"
import { RatingChips } from "../components/Severity"
import { StateRender } from "../components/StateRender"
import { ThemeLabel, themeCardStyle } from "../components/ThemeCards"
import { Tile } from "../components/Tile"

type TestComponent = TestDetail["components"][number]

function formatDate(iso: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
      .formatToParts(new Date(iso))
      .map((p) => [p.type, p.value]),
  )
  return `${parts.weekday} ${parts.day} ${parts.month} ${parts.year}`
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })

const formatTaken = (minutes: number | null) => (minutes === null ? "Running" : `${minutes} ${minutes === 1 ? "min" : "mins"}`)

function ComponentCard({ test, item, onRate }: { test: TestDetail; item: TestComponent; onRate: (rating: Rating) => void }) {
  return (
    // The whole card is drawn in the theme under test: its background, text, font and border.
    <article className={cn(test.theme, "relative flex w-[1120px] flex-col gap-4 overflow-clip border border-foreground/[0.16] bg-background p-[39px] font-sans text-foreground")}>
      <div className="flex items-start justify-between">
        <h3 className="text-lg leading-[1.42] font-bold">{item.path}</h3>
        {item.grade && <RatingChips value={item.rating} onChange={onRate} />}
      </div>
      <p className="w-[424px] text-base leading-[1.42] italic opacity-65">{item.summary}</p>
      {item.issues.length > 0 && (
        <ul className="flex flex-col gap-1 text-base leading-[1.42]">
          {item.issues.map((issue, i) => (
            <li key={i}>
              <span className="opacity-50">
                {issue.state} · {issue.token}
              </span>{" "}
              {issue.description}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-[34px]">
        <StateRender path={item.path} names={item.states.map((s) => s.name)} />
      </div>
    </article>
  )
}

function GradeGroup({ heading, pill, defaultOpen, children }: { heading: React.ReactNode; pill: string; defaultOpen: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="flex flex-col">
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex w-[1120px] items-center justify-between py-10 text-left">
        <span className="flex items-center gap-3">
          <span className="flex items-center justify-center rounded-[8px] bg-white/[0.08] px-3 py-0.5 text-lg leading-[1.42] font-bold text-white">{pill}</span>
          <span className="font-heading text-[28px] leading-[1.14] font-extralight">{heading}</span>
        </span>
        <CaretCircleUpIcon size={32} className={cn(!open && "-scale-y-100")} />
      </button>
      {open && <div className="flex flex-col gap-6">{children}</div>}
    </div>
  )
}

export function Results() {
  const { id } = useParams()
  const [test, setTest] = useState<TestDetail | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    () =>
      getTest(id)
        .then((r) => (setTest(r.test), setError(null)))
        .catch((e: Error) => setError(e.message)),
    [id],
  )

  useEffect(() => {
    load()
  }, [load])

  // Claude Code writes each component as it finishes; follow along until the test is done.
  useEffect(() => {
    if (test?.status !== "running") return
    const timer = setInterval(load, 4000)
    return () => clearInterval(timer)
  }, [test?.status, load])

  const onRate = (path: string, rating: Rating) => {
    if (!test) return
    const before = test
    setTest({ ...test, components: test.components.map((c) => (c.path === path ? { ...c, rating } : c)) })
    rate(test.id, path, rating).catch(() => setTest(before))
  }

  if (error) return <p className="pt-10 text-base opacity-65">{error}</p>
  if (test === undefined) return null
  if (test === null) return <p className="pt-10 text-base opacity-65">No tests yet. Get a test prompt on Run and give it to Claude Code.</p>

  const graded = test.components.filter((c) => c.grade && !c.excludedReason)
  const excluded = test.components.filter((c) => c.excludedReason)
  // in a running test, components wait here until Claude Code has graded them
  const pending = test.components.filter((c) => !c.grade && !c.excludedReason)

  return (
    <div className="flex flex-col gap-4">
      <Section title="Test Details" foldable={false}>
        <div className="flex items-center gap-4">
          <Tile label="Date" value={formatDate(test.startedAt)} className="w-[200px]" />
          <Tile label="Time" value={formatTime(test.startedAt)} className="w-[140px]" />
          <Tile label="Time Taken" value={formatTaken(test.minutesTaken)} className="w-[140px]" />
          <Tile label="Components" value={test.componentCount} className="w-[140px]" />
          <Tile label="States" value={test.stateCount} className="w-[140px]" />
        </div>
      </Section>

      <Section title="Test Stimulus" foldable={false}>
        <div className="flex items-center gap-4">
          <div
            style={themeCardStyle(test.theme)}
            className="flex w-[200px] items-center justify-center overflow-clip rounded-2xl px-10 py-8 text-center text-[28px] leading-[1.14] whitespace-nowrap"
          >
            <ThemeLabel id={test.theme} />
          </div>
        </div>
      </Section>

      <div className="flex flex-col">
        {GRADES.map((grade: Grade) => {
          const group = graded.filter((c) => c.grade === grade)
          if (group.length === 0) return null
          const { count, scope } = gradeSummary(grade)
          return (
            <GradeGroup
              key={grade}
              pill={`Grade ${grade}`}
              defaultOpen={grade === "A"}
              heading={
                scope ? (
                  <>
                    {count} <em className="italic">{scope}</em>
                  </>
                ) : (
                  count
                )
              }
            >
              {group.map((item) => (
                <ComponentCard key={item.path} test={test} item={item} onRate={(rating) => onRate(item.path, rating)} />
              ))}
            </GradeGroup>
          )
        })}

        {pending.length > 0 && (
          <GradeGroup pill="Testing" heading="Not graded yet." defaultOpen>
            {pending.map((item) => (
              <ComponentCard key={item.path} test={test} item={item} onRate={(rating) => onRate(item.path, rating)} />
            ))}
          </GradeGroup>
        )}

        {excluded.length > 0 && (
          <GradeGroup pill="Excluded" heading="Could not be rendered." defaultOpen>
            {excluded.map((item) => (
              <article key={item.path} className="flex w-[1120px] flex-col gap-4 border border-white/[0.16] p-[39px]">
                <h3 className="text-lg leading-[1.42] font-bold">{item.path}</h3>
                <p className="text-base leading-[1.42] italic opacity-65">{item.excludedReason}</p>
              </article>
            ))}
          </GradeGroup>
        )}
      </div>
    </div>
  )
}
