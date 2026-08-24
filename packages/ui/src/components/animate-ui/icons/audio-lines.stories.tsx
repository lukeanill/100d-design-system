import type { ComponentProps } from "react"
import { AudioLines as AudioLinesImpl } from "./audio-lines"

export default { title: "Icon/Audio Lines", component: AudioLinesImpl }

export const AudioLines = (args: ComponentProps<typeof AudioLinesImpl>) => <AudioLinesImpl {...args} />
