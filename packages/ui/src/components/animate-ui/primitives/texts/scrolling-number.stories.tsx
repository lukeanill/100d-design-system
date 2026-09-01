import type { ComponentProps } from "react"
import {
  ScrollingNumberContainer,
  ScrollingNumber as ScrollingNumberImpl,
  ScrollingNumberHighlight,
  ScrollingNumberItems,
} from "./scrolling-number"

export default {
  title: "Animation/Text/Numbers/Scrolling Number",
  component: ScrollingNumberContainer,
  argTypes: {
    number: { control: "number" },
    step: { control: "number" },
    itemsSize: { control: { type: "range", min: 20, max: 60, step: 2 } },
    sideItemsCount: { control: { type: "range", min: 1, max: 4, step: 1 } },
    direction: { control: "select", options: ["ltr", "rtl", "ttb", "btt"] },
  },
  args: { number: 42, step: 1, itemsSize: 30, sideItemsCount: 2, direction: "btt" },
}

export const ScrollingNumberTexts = (args: ComponentProps<typeof ScrollingNumberContainer>) => (
  <ScrollingNumberContainer {...args}>
    <ScrollingNumberHighlight />
    <ScrollingNumberImpl>
      <ScrollingNumberItems />
    </ScrollingNumberImpl>
  </ScrollingNumberContainer>
)
