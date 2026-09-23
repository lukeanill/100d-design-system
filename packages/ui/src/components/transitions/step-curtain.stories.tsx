import * as React from "react"
import { StepCurtain } from "./step-curtain"

export default {
  title: "Animation/Page Transitions/Step Curtain",
  component: StepCurtain,
  parameters: { layout: "fullscreen" },
  argTypes: {
    color: { control: "color" },
    transitionKey: { control: false },
    children: { control: false },
    className: { control: false },
  },
  args: { color: "var(--foreground)" },
}

export const StepCurtainDemo = (args: { color?: string }) => {
  const [run, setRun] = React.useState(0)

  return (
    <StepCurtain transitionKey={String(run)} color={args.color}>
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
