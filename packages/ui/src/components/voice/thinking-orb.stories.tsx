import { ThinkingOrb } from "./thinking-orb"

const STATES = ["working", "searching", "solving", "listening", "connecting", "weaving", "composing", "breathing", "shaping"] as const

type Args = { size: 64 | 32 | 20; speed: number; dots: number; dotSize: number; paused: boolean }

export default {
  title: "Components/Voice/Orbs",
  component: ThinkingOrb,
  argTypes: {
    size: { control: "inline-radio", options: [64, 32, 20] },
    speed: { control: { type: "range", min: 0.25, max: 3, step: 0.05 } },
    dots: { control: { type: "range", min: 0.25, max: 2, step: 0.05 }, description: "Density of the dots" },
    dotSize: { control: { type: "range", min: 0.5, max: 1.5, step: 0.05 } },
    paused: { control: "boolean" },
  },
  args: { size: 64, speed: 1, dots: 1, dotSize: 1, paused: false },
}

/** Every state of the thinking orb, side by side. */
export const OrbsStory = ({ size, speed, dots, dotSize, paused }: Args) => (
  <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-x-6 gap-y-10">
    {STATES.map((state) => (
      <div key={state} className="flex flex-col items-center gap-3">
        <div className="flex h-16 items-center justify-center">
          <ThinkingOrb state={state} size={size} speed={speed} dots={dots} dotSize={dotSize} paused={paused} />
        </div>
        <p className="text-body-md capitalize">{state}</p>
      </div>
    ))}
  </div>
)
OrbsStory.storyName = "Orbs"
