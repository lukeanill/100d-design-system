import * as React from "react"
import { CurtainTransition } from "./curtain-transition"

export default {
  title: "Animation/Page Transitions/Curtain Transition",
  component: CurtainTransition,
  parameters: { layout: "fullscreen" },
  argTypes: {
    color: { control: "color" },
    transitionKey: { control: false },
    children: { control: false },
  },
  args: { color: "var(--foreground)" },
}

const PAGES = ["Page one", "Page two", "Page three"]

export const CurtainTransitionDemo = (args: { color?: string }) => {
  const [page, setPage] = React.useState(0)
  const go = (step: number) =>
    setPage((p) => (p + step + PAGES.length) % PAGES.length)

  return (
    <CurtainTransition transitionKey={String(page)} color={args.color}>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-8">
        <h2 className="text-3xl font-semibold text-foreground">
          {PAGES[page]}
        </h2>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            className="rounded-md border border-border px-4 py-2 text-foreground"
          >
            Prev
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Next
          </button>
        </div>
      </div>
    </CurtainTransition>
  )
}
