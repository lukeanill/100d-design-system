import type { ComponentProps } from "react"
import { MusicDisc as MusicDiscImpl } from "./music-disc"

export default { title: "Map/Music Disc", component: MusicDiscImpl }

export const MusicDisc = (args: ComponentProps<typeof MusicDiscImpl>) => <MusicDiscImpl {...args} />
