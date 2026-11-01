import { VoiceRing, type VoiceRingState } from "./voice-ring"
import { useDemoVoice } from "./demo-voice"

type Args = {
  state: VoiceRingState
  source: "Demo voice" | "Manual"
  level: number
  direction: number
  size: number
  rings: number
  lean: number
  ringGap: number
  halo: number
  colorVariant: "spectrum" | "theme"
}

export default {
  title: "Components/Voice/Ring",
  component: VoiceRing,
  argTypes: {
    state: { control: "inline-radio", options: ["idle", "listening", "speaking", "processing"] },
    source: { control: "inline-radio", options: ["Demo voice", "Manual"] },
    level: { control: { type: "range", min: 0, max: 1, step: 0.01 }, description: "Manual source only" },
    direction: { control: { type: "range", min: -1, max: 1, step: 0.05 }, description: "−1 left … 1 right" },
    size: { control: { type: "range", min: 96, max: 480, step: 8 } },
    rings: { control: { type: "range", min: 1, max: 10, step: 1 } },
    lean: { control: { type: "range", min: 0, max: 1.5, step: 0.01 } },
    ringGap: { control: { type: "range", min: 0, max: 0.1, step: 0.005 } },
    halo: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    colorVariant: { control: "inline-radio", options: ["spectrum", "theme"] },
  },
  args: { state: "listening", source: "Demo voice", level: 0.5, direction: 0, size: 240, rings: 6, lean: 0.91, ringGap: 0.02, halo: 0.5, colorVariant: "spectrum" },
}

export const VoiceRingStory = ({ source, level, state, ...args }: Args) => {
  const demo = useDemoVoice(state === "listening" || state === "speaking")
  return <VoiceRing {...args} state={state} level={source === "Demo voice" ? demo : level} />
}
VoiceRingStory.storyName = "Ring"
