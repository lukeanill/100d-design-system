import type { ComponentProps } from "react"
import { Sheet as SheetImpl } from "./sheet"

export default { title: "Components/Sheet", component: SheetImpl }

export const Sheet = (args: ComponentProps<typeof SheetImpl>) => <SheetImpl {...args} />
