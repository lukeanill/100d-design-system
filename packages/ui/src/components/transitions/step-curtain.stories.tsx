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

const STEPS = ["Step one", "Step two", "Step three"]

export const StepCurtainDemo = (args: { color?: string }) => {
  const [step, setStep] = React.useState(0)
  const go = (by: number) =>
    setStep((s) => (s + by + STEPS.length) % STEPS.length)

  return (
    <div className="p-8">
      <StepCurtain
        transitionKey={String(step)}
        color={args.color}
        className="min-h-[320px] overflow-hidden rounded-lg border border-border"
      >
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-6 bg-background p-8">
          <h2 className="text-2xl font-semibold text-foreground">
            {STEPS[step]}
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
      </StepCurtain>
    </div>
  )
}
