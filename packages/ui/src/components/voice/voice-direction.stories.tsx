import { useEffect, useState } from "react"
import { VoiceDirection } from "./voice-direction"

type Args = { pan: number; active: boolean; showProbabilities: boolean }

export default {
  title: "Components/Voice/Direction",
  component: VoiceDirection,
  argTypes: {
    pan: { control: { type: "range", min: -1, max: 1, step: 0.05 }, description: "−1 left … 1 right. The demo sweep replaces it while it runs." },
    active: { control: "boolean" },
    showProbabilities: { control: "boolean" },
  },
  args: { pan: 0, active: true, showProbabilities: true },
}

export const VoiceDirectionStory = ({ pan, active, showProbabilities }: Args) => {
  const [running, setRunning] = useState(false)
  const [swept, setSwept] = useState(0)

  // the demo: a voice that moves from side to side, only once Start is pressed
  useEffect(() => {
    if (!running) return
    const from = performance.now()
    let raf = 0
    const tick = (now: number) => {
      setSwept(Math.sin(((now - from) / 1000) * 0.9) * Math.cos(((now - from) / 1000) * 0.33))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [running])

  const current = running ? swept : pan
  // a soft spread around the pan, so the bars move with the needle
  const near = (centre: number) => Math.max(0, 1 - Math.abs(current - centre) / 1.2)
  const total = near(-1) + near(0) + near(1) || 1
  return (
    <div className="flex flex-col items-center gap-6">
      <VoiceDirection
        pan={current}
        active={active}
        probabilities={showProbabilities ? { left: near(-1) / total, ahead: near(0) / total, right: near(1) / total } : undefined}
      />
      <button
        type="button"
        className="text-body-md cursor-pointer rounded-(--radius-inner) px-3 py-1 outline-1 -outline-offset-[0.5px] outline-(--control-edge) hover:bg-(--control-hover)"
        onClick={() => setRunning((value) => !value)}
      >
        {running ? "Stop" : "Start"}
      </button>
    </div>
  )
}
VoiceDirectionStory.storyName = "Direction"
