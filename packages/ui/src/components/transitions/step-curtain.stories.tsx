import * as React from "react"
import { StepCurtain } from "./step-curtain"

// Token names rather than raw colours, so the curtain follows the theme.
const COLORS = {
  foreground: "var(--foreground)",
  primary: "var(--primary)",
  secondary: "var(--secondary)",
}

// Seconds per half; medium is the component's own default.
const SPEEDS = { slow: 0.9, medium: 0.45, fast: 0.25 }

export default {
  title: "Animation/Page Transitions/Step Curtain",
  component: StepCurtain,
  parameters: { layout: "fullscreen" },
  argTypes: {
    color: { control: "inline-radio", options: Object.keys(COLORS) },
    speed: { control: "inline-radio", options: Object.keys(SPEEDS) },
    transitionKey: { control: false },
    children: { control: false },
    duration: { control: false },
    className: { control: false },
  },
  args: { color: "foreground", speed: "medium" },
}

export const StepCurtainDemo = (args: {
  color: keyof typeof COLORS
  speed: keyof typeof SPEEDS
}) => {
  const [run, setRun] = React.useState(0)

  return (
    <StepCurtain
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
    </StepCurtain>
  )
}
