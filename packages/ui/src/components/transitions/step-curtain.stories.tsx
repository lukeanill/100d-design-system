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

const STEPS = ["Your name", "Your date of birth", "Where you were born"]

export const StepCurtainDemo = (args: { color?: string }) => {
  const [step, setStep] = React.useState(0)

  return (
    <div className="p-8">
      {/* Chrome outside the curtain stays put while the step swaps. */}
      <p className="pb-4 text-sm text-muted-foreground">
        Step {step + 1} of {STEPS.length} — this line sits outside the curtain.
      </p>

      <StepCurtain
        transitionKey={String(step)}
        color={args.color}
        className="min-h-[320px] overflow-hidden rounded-lg border border-border"
      >
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-6 bg-background p-8 text-center">
          <h2 className="text-2xl font-semibold text-foreground">
            {STEPS[step]}
          </h2>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="rounded-md border border-border px-4 py-2 text-foreground disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) % STEPS.length)}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Continue
            </button>
          </div>
        </div>
      </StepCurtain>
    </div>
  )
}
