import type { ComponentProps } from "react"
import { RadioGroup as RadioGroupImpl, RadioGroupItem } from "./radio-group"

export default { title: "Components/Radio Group", component: RadioGroupImpl, args: { defaultValue: "default" } }

export const RadioGroup = (args: ComponentProps<typeof RadioGroupImpl>) => (
  <RadioGroupImpl {...args}>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="default" id="r1" />
      <label htmlFor="r1" className="text-sm">Default</label>
    </div>
    <div className="flex items-center gap-2">
      <RadioGroupItem value="comfortable" id="r2" />
      <label htmlFor="r2" className="text-sm">Comfortable</label>
    </div>
  </RadioGroupImpl>
)
