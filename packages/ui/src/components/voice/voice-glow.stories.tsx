import { useState } from "react"
import { CaretDownIcon, StopIcon, XIcon } from "@phosphor-icons/react"
import { PromptBar } from "@workspace/ui/components/ai/prompt-bar"
import { ControlButton } from "@workspace/ui/components/control-button"
import { ThemedIcon } from "@workspace/ui/components/themed-icon"
import { VoiceGlow, useMicrophone } from "./voice-glow"
import { useDemoVoice } from "./demo-voice"
import { SurfaceFill } from "@workspace/ui/components/themed-surface"
import { ThinkingOrb } from "./thinking-orb"

type Args = {
  source: "Demo voice" | "Microphone"
  look: "glow" | "dots" | "lines"
  colorVariant: "theme" | "colorful" | "mono" | "ocean" | "sunset" | "forest" | "candy" | "ice" | "gold"
  active: boolean
  sensitivity: number
  strength: number
}

export default {
  title: "Components/Voice/Glow",
  component: VoiceGlow,
  argTypes: {
    source: { control: "inline-radio", options: ["Demo voice", "Microphone"] },
    look: { control: "inline-radio", options: ["glow", "dots", "lines"] },
    colorVariant: { control: "select", options: ["theme", "colorful", "mono", "ocean", "sunset", "forest", "candy", "ice", "gold"] },
    active: { control: "boolean" },
    sensitivity: { control: { type: "range", min: 0.5, max: 8, step: 0.1 } },
    strength: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
  },
  args: { source: "Demo voice", look: "glow", colorVariant: "colorful", active: true, sensitivity: 3.1, strength: 1 },
}

export const VoiceGlowStory = ({ source, ...args }: Args) => {
  const mic = useMicrophone()
  const [listening, setListening] = useState(true)
  const demo = useDemoVoice(listening)
  const live = source === "Microphone"
  return (
    <div className="flex w-[480px] max-w-full flex-col items-center gap-6">
      <VoiceGlow {...args} stream={live ? mic.stream : null} level={live ? 0 : demo} className="w-full">
        <PromptBar appearance={{ demo: false }} data={{ modelLabel: "Agent", placeholder: "Type or Talk..." }} />
      </VoiceGlow>
      <button
        type="button"
        className="text-body-md cursor-pointer rounded-(--radius-inner) px-3 py-1 outline-1 -outline-offset-[0.5px] outline-(--control-edge) hover:bg-(--control-hover)"
        onClick={() => (live ? (mic.state === "live" ? mic.stop() : void mic.start()) : setListening((value) => !value))}
      >
        {live ? (mic.state === "live" ? "Stop microphone" : mic.state === "denied" ? "Microphone blocked" : "Listen") : listening ? "Pause demo voice" : "Play demo voice"}
      </button>
    </div>
  )
}
VoiceGlowStory.storyName = "Contained"

/** The "pill" type: the glow along the bottom of a recording pill, here a Listening button with the connecting orb in it. */
export const PillStory = ({ source, look, colorVariant, active, sensitivity, strength }: Args) => {
  const mic = useMicrophone()
  const [listening, setListening] = useState(true)
  const demo = useDemoVoice(listening)
  const live = source === "Microphone"
  const running = live ? mic.state === "live" : listening
  return (
    <VoiceGlow
      type="pill"
      look={look}
      colorVariant={colorVariant}
      active={active}
      sensitivity={sensitivity}
      strength={strength}
      stream={live ? mic.stream : null}
      level={live ? 0 : demo}
      className="w-fit"
    >
      <button
        type="button"
        className="text-body-md relative isolate flex h-16 min-w-[150px] cursor-pointer items-center justify-center gap-1 rounded-(--dimensions-max) pr-6 pl-2 text-foreground outline-1 -outline-offset-[0.5px] outline-(--control-edge) before:absolute before:inset-0 before:-z-10 before:rounded-[inherit] before:bg-(--control-hover) before:opacity-0 before:transition-opacity before:duration-(--motion-fast) before:ease-(--motion-transition-ease) before:content-[''] hover:before:opacity-100"
        onClick={() => (live ? (mic.state === "live" ? mic.stop() : void mic.start()) : setListening((value) => !value))}
      >
        <SurfaceFill />
        <ThinkingOrb size={64} style={{ width: 56, height: 56 }} state="connecting" paused={!running} aria-hidden />
        Listening
      </button>
    </VoiceGlow>
  )
}
PillStory.storyName = "Pill"

/** The "mobile" type: the glow along the bottom of a phone screen, in a 402 × 874 phone with a voice screen's controls. */
export const MobileStory = ({ source, look, colorVariant, active, sensitivity, strength }: Args) => {
  const mic = useMicrophone()
  const [listening, setListening] = useState(true)
  const demo = useDemoVoice(listening)
  const live = source === "Microphone"
  return (
    <div className="flex flex-col items-center gap-6">
      {/* scaled to three quarters so the whole phone sits in the canvas; its own size is the iPhone's */}
      <div style={{ width: 402 * 0.75, height: 874 * 0.75 }}>
        <div style={{ width: 402, height: 874, transform: "scale(0.75)", transformOrigin: "top left" }}>
          <VoiceGlow
            type="mobile"
            look={look}
            colorVariant={colorVariant}
            active={active}
            sensitivity={sensitivity}
            strength={strength}
            stream={live ? mic.stream : null}
            level={live ? 0 : demo}
          >
            <div
              role="img"
              aria-label="Phone voice screen with the voice glow along its bottom edge"
              className="relative h-[874px] w-[402px] overflow-clip rounded-[66px] bg-foreground/5 text-foreground outline-1 -outline-offset-[0.5px] outline-foreground/20"
            >
              <h6 className="absolute inset-x-8 top-[58%] text-center">Alexa, tell me a rude joke</h6>
              <div className="absolute inset-x-8 bottom-16 flex items-center justify-between">
                <ControlButton shape="pill" size="lg" aria-label="Choose agent">
                  Agent (auto)
                  <ThemedIcon phosphor={CaretDownIcon} />
                </ControlButton>
                <div className="flex items-center gap-4">
                  <ControlButton size="lg" aria-label="Stop audio" onClick={() => (live ? mic.stop() : setListening(false))}>
                    <ThemedIcon phosphor={StopIcon} />
                  </ControlButton>
                  <ControlButton size="lg" aria-label="Close">
                    <ThemedIcon phosphor={XIcon} />
                  </ControlButton>
                </div>
              </div>
            </div>
          </VoiceGlow>
        </div>
      </div>
      <button
        type="button"
        className="text-body-md cursor-pointer rounded-(--radius-inner) px-3 py-1 outline-1 -outline-offset-[0.5px] outline-(--control-edge) hover:bg-(--control-hover)"
        onClick={() => (live ? (mic.state === "live" ? mic.stop() : void mic.start()) : setListening((value) => !value))}
      >
        {live ? (mic.state === "live" ? "Stop microphone" : mic.state === "denied" ? "Microphone blocked" : "Listen") : listening ? "Pause demo voice" : "Play demo voice"}
      </button>
    </div>
  )
}
MobileStory.storyName = "Mobile"
