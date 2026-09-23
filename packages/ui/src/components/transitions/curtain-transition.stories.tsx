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

const PAGES = [
  { key: "one", title: "Page one", body: "Press the button to swap pages." },
  {
    key: "two",
    title: "Page two",
    body: "The panel wipes in, the page swaps, an iris opens.",
  },
  {
    key: "three",
    title: "Page three",
    body: "Each press runs the same wipe and iris.",
  },
]

export const CurtainTransitionDemo = (args: { color?: string }) => {
  const [index, setIndex] = React.useState(0)
  const page = PAGES[index]

  return (
    <CurtainTransition transitionKey={page.key} color={args.color}>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-8 text-center">
        <h2 className="text-3xl font-semibold text-foreground">{page.title}</h2>
        <p className="max-w-md text-muted-foreground">{page.body}</p>
        <button
          type="button"
          onClick={() => setIndex((i) => (i + 1) % PAGES.length)}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Next page
        </button>
      </div>
    </CurtainTransition>
  )
}
