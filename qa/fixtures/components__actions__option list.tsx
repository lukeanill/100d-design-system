import { CheckIcon } from "@phosphor-icons/react"

import {
  OptionList,
  OptionListActions,
  OptionListContent,
  OptionListItem,
  OptionListOptions,
  type Option,
} from "@workspace/ui/components/ui/option-list"

import type { Fixture } from "../src/components/StateRender"
import { HOVER } from "../src/lib/force-states"

const SHIPPING: Option[] = [
  { description: "3-5 business days", label: "Standard shipping" },
  { description: "1-2 business days", label: "Express shipping" },
  { description: "Available in 2h", label: "Store pickup" },
]

const LONG: Option[] = [
  {
    description: "Delivered by courier to the address on your account within three to five working days, signature required",
    label: "Standard shipping with tracking, insurance and a signature on delivery",
  },
]

const list = (options: Option[], control?: { selectedOptionIndex: number }, hoverFirst = false, box = "w-[400px]") => (
  <div className={box}>
    <OptionList data={{ options }} control={control}>
      <OptionListContent>
        <OptionListOptions>
          {options.map((option, index) => (
            <OptionListItem key={index} index={index} option={option} {...(hoverFirst && index === 0 ? HOVER : {})} />
          ))}
        </OptionListOptions>
        <OptionListActions />
      </OptionListContent>
    </OptionList>
  </div>
)

// hover is drawn with the component's own hover styles held on the first option
const fixture: Fixture = {
  states: [
    { name: "default", render: () => list(SHIPPING) },
    { name: "selected", render: () => list(SHIPPING, { selectedOptionIndex: 0 }) },
    { name: "hover", render: () => list(SHIPPING, undefined, true) },
    {
      name: "icons and descriptions",
      render: () =>
        list([
          { icon: <CheckIcon />, description: "Included", label: "Standard" },
          { icon: <CheckIcon />, description: "From $4", label: "Express" },
        ]),
    },
  ],
  scenarios: {
    width: () => list(SHIPPING, undefined, false, "w-full"),
    longText: () => list(LONG, undefined, false, "w-full"),
  },
}

export default fixture
