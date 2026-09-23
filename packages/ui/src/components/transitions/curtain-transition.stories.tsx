import * as React from "react"
import { CurtainTransition } from "./curtain-transition"

// Token names rather than raw colours, so the curtain follows the theme.
const COLORS = {
  foreground: "var(--foreground)",
  primary: "var(--primary)",
  secondary: "var(--secondary)",
}

// Seconds per half; medium is the component's own default.
const SPEEDS = { slow: 1, medium: 0.55, fast: 0.3 }

export default {
  title: "Animation/Page Transitions/Curtain Transition",
  component: CurtainTransition,
  parameters: { layout: "fullscreen" },
  argTypes: {
    color: { control: "inline-radio", options: Object.keys(COLORS) },
    speed: { control: "inline-radio", options: Object.keys(SPEEDS) },
    transitionKey: { control: false },
    children: { control: false },
    duration: { control: false },
  },
  args: { color: "foreground", speed: "medium" },
}

export const CurtainTransitionDemo = (args: {
  color: keyof typeof COLORS
  speed: keyof typeof SPEEDS
}) => {
  const [run, setRun] = React.useState(0)

  return (
    <CurtainTransition
      transitionKey={String(run)}
      color={COLORS[args.color]}
      duration={SPEEDS[args.speed]}
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
    </CurtainTransition>
  )
}
