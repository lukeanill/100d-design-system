import type { ComponentProps } from "react"
import { Label as LabelImpl } from "./label"

export default { title: "Components/Label", component: LabelImpl }

export const Label = (args: ComponentProps<typeof LabelImpl>) => <LabelImpl {...args} />
