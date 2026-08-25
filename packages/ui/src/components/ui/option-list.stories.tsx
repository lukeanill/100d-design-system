import type { ComponentProps } from "react"
import { OptionList as OptionListImpl, OptionListContent, OptionListOptions, OptionListActions } from "./option-list"

export default { title: "Components/Option List", component: OptionListImpl }

export const OptionList = (args: ComponentProps<typeof OptionListImpl>) => (
  <OptionListImpl {...args}>
    <OptionListContent>
      <OptionListOptions />
      <OptionListActions />
    </OptionListContent>
  </OptionListImpl>
)
