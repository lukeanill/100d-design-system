import type { ComponentProps } from "react"
import { ExternalLink as ExternalLinkImpl } from "./external-link"

export default { title: "Icon/External Link", component: ExternalLinkImpl }

export const ExternalLink = (args: ComponentProps<typeof ExternalLinkImpl>) => <ExternalLinkImpl {...args} />
