import type { ComponentProps } from "react"
import { CopyButton as CopyButtonImpl } from "./copy"

export default { title: "Components/Copy", component: CopyButtonImpl }

export const Copy = (args: ComponentProps<typeof CopyButtonImpl>) => <CopyButtonImpl {...args} />
