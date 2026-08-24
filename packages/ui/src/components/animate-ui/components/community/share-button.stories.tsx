import type { ComponentProps } from "react"
import { ShareButton as ShareButtonImpl } from "./share-button"

export default { title: "Components/Share Button", component: ShareButtonImpl }

export const ShareButton = (args: ComponentProps<typeof ShareButtonImpl>) => <ShareButtonImpl {...args} />
