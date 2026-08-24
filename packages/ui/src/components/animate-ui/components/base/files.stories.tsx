import type { ComponentProps } from "react"
import { Files as FilesImpl } from "./files"

export default { title: "Components/Files", component: FilesImpl }

export const Files = (args: ComponentProps<typeof FilesImpl>) => <FilesImpl {...args} />
