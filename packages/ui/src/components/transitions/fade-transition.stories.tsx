import * as React from "react"
import { FadeTransition } from "./fade-transition"

const COLORS = {
  foreground: "var(--foreground)",
  primary: "var(--primary)",
  secondary: "var(--secondary)",
}

const SPEEDS = { slow: 0.7, medium: 0.35, fast: 0.2 }

export default {
  title: "Animation/Page Transitions/Fade",
  component: FadeTransition,
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

export const FadeDemo = (args: {
  color: keyof typeof COLORS
  speed: keyof typeof SPEEDS
}) => {
  const [run, setRun] = React.useState(0)

  return (
    <FadeTransition
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
    </FadeTransition>
  )
}
