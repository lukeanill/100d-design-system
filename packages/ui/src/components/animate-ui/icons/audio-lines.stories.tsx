import type { ComponentProps } from "react"
import { AudioLines as AudioLinesImpl } from "./audio-lines"

export default {
  title: "Icon/Audio Lines",
  component: AudioLinesImpl,
  argTypes: {
    size: { control: { type: "number", min: 12, max: 96 } },
    animate: { control: "boolean" },
  },
  args: { size: 28, animate: true },
}

export const AudioLines = (args: ComponentProps<typeof AudioLinesImpl>) => <AudioLinesImpl {...args} />
