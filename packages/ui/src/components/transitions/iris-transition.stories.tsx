import * as React from "react"
import { IrisTransition } from "./iris-transition"

const COLORS = {
  foreground: "var(--foreground)",
  primary: "var(--primary)",
  secondary: "var(--secondary)",
}

const SPEEDS = { slow: 0.9, medium: 0.5, fast: 0.3 }

export default {
  title: "Animation/Page Transitions/Iris From Click",
  component: IrisTransition,
  parameters: { layout: "fullscreen" },
  argTypes: {
    color: { control: "inline-radio", options: Object.keys(COLORS) },
    speed: { control: "inline-radio", options: Object.keys(SPEEDS) },
    transitionKey: { control: false },
    children: { control: false },
    duration: { control: false },
    origin: { control: false },
  },
  args: { color: "foreground", speed: "medium" },
}

export const IrisFromClickDemo = (args: {
  color: keyof typeof COLORS
  speed: keyof typeof SPEEDS
}) => {
  const [run, setRun] = React.useState(0)
  const [origin, setOrigin] = React.useState<{ x: number; y: number } | null>(
    null
  )

  // The circle grows from the click itself, so the transition starts where the
  // person was looking rather than at the centre of the page.
  function handleClick(event: React.MouseEvent) {
    setOrigin({ x: event.clientX, y: event.clientY })
    setRun((r) => r + 1)
  }

  return (
    <IrisTransition
      transitionKey={String(run)}
      color={COLORS[args.color]}
      duration={SPEEDS[args.speed]}
      origin={origin}
    >
      <div className="flex min-h-svh items-center justify-center bg-background">
        <button
          type="button"
          onClick={handleClick}
          className="rounded-md bg-primary px-5 py-2.5 text-primary-foreground"
        >
          Test
        </button>
      </div>
    </IrisTransition>
  )
}
