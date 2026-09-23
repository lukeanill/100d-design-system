import * as React from "react"
import { BlindsTransition } from "./blinds-transition"

const COLORS = {
  foreground: "var(--foreground)",
  primary: "var(--primary)",
  secondary: "var(--secondary)",
}

const SPEEDS = { slow: 0.8, medium: 0.45, fast: 0.25 }

export default {
  title: "Animation/Page Transitions/Blinds",
  component: BlindsTransition,
  parameters: { layout: "fullscreen" },
  argTypes: {
    color: { control: "inline-radio", options: Object.keys(COLORS) },
    speed: { control: "inline-radio", options: Object.keys(SPEEDS) },
    strips: { control: { type: "range", min: 2, max: 14, step: 1 } },
    transitionKey: { control: false },
    children: { control: false },
    duration: { control: false },
  },
  args: { color: "foreground", speed: "medium", strips: 6 },
}

export const BlindsDemo = (args: {
  color: keyof typeof COLORS
  speed: keyof typeof SPEEDS
  strips: number
}) => {
  const [run, setRun] = React.useState(0)

  return (
    <BlindsTransition
      transitionKey={String(run)}
      color={COLORS[args.color]}
      duration={SPEEDS[args.speed]}
      strips={args.strips}
    >
      <div className="flex min-h-svh items-center justify-center bg-background">
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="rounded-md bg-primary px-5 py-2.5 text-primary-foreground"
        >
          Test
        </button>
      </div>
    </BlindsTransition>
  )
}
