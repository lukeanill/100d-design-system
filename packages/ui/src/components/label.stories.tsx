import type { ComponentProps } from "react"
import { Label as LabelImpl } from "./label"

export default {
  title: "Components/Inputs/Label",
  component: LabelImpl,
  args: { children: "Email address" },
}

export const Label = (args: ComponentProps<typeof LabelImpl>) => <LabelImpl {...args} />
