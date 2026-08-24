import type { ComponentProps } from "react"
import { Link as LinkImpl } from "./link"

export default { title: "Icon/Link", component: LinkImpl }

export const Link = (args: ComponentProps<typeof LinkImpl>) => <LinkImpl {...args} />
