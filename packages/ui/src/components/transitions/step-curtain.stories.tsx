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
    <div className="p-8">
      <StepCurtain
        transitionKey={String(run)}
        color={args.color}
        className="min-h-[320px] overflow-hidden rounded-lg border border-border"
      >
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-6 bg-background p-8">
          <h2 className="text-2xl font-semibold text-foreground">
            Step {run + 1}
          </h2>
          <button
            type="button"
            onClick={() => setRun((r) => r + 1)}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Test
          </button>
        </div>
      </StepCurtain>
    </div>
  )
}
