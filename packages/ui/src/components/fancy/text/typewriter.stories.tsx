import type { ComponentProps } from "react"
import TypewriterImpl from "./typewriter"

export default {
  title: "Animation/Text/Reveal/Typewriter",
  component: TypewriterImpl,
  argTypes: {
    text: { control: "text" },
    speed: { control: { type: "range", min: 10, max: 200, step: 5 } },
    initialDelay: { control: { type: "range", min: 0, max: 2000, step: 100 } },
    waitTime: { control: { type: "range", min: 0, max: 5000, step: 100 } },
    deleteSpeed: { control: { type: "range", min: 10, max: 200, step: 5 } },
    loop: { control: "boolean" },
    showCursor: { control: "boolean" },
    hideCursorOnType: { control: "boolean" },
    cursorChar: { control: "text" },
  },
  args: {
    text: "The quick brown fox jumps over the lazy dog.",
    speed: 50,
    initialDelay: 200,
    waitTime: 1500,
    deleteSpeed: 30,
    loop: true,
    showCursor: true,
    hideCursorOnType: false,
    cursorChar: "|",
  },
}

export const Typewriter = (args: ComponentProps<typeof TypewriterImpl>) => <TypewriterImpl {...args} />
