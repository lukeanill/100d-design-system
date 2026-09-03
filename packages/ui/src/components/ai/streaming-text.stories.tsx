import type { ComponentProps } from "react"
import { StreamingText as StreamingTextImpl } from "./streaming-text"

export default {
  title: "Components/AI/Streaming Text",
  component: StreamingTextImpl,
  argTypes: {
    "appearance.loop": { control: "boolean" },
    "appearance.fill": { control: "boolean" },
    "data.content": { table: { disable: true } },
    "data.sources": { table: { disable: true } },
    "data.followUps": { table: { disable: true } },
    actions: { table: { disable: true } },
  },
  args: {
    appearance: { fill: false, loop: true },
  },
}

export const StreamingText = (args: ComponentProps<typeof StreamingTextImpl>) => <StreamingTextImpl {...args} />
