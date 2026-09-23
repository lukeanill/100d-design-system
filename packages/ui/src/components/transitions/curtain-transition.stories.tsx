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

export const CurtainTransitionDemo = (args: { color?: string }) => {
  const [run, setRun] = React.useState(0)

  return (
    <CurtainTransition transitionKey={String(run)} color={args.color}>
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-8">
        <h2 className="text-3xl font-semibold text-foreground">
          Page {run + 1}
        </h2>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Test
        </button>
      </div>
    </CurtainTransition>
  )
}
