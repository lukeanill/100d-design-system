import {
  ScrollingNumberContainer,
  ScrollingNumber as ScrollingNumberImpl,
  ScrollingNumberItems,
} from "./scrolling-number"

export default { title: "Animation/Scrolling Number Texts", component: ScrollingNumberImpl }

export const ScrollingNumberTexts = () => (
  <ScrollingNumberContainer number={42} step={1}>
    <ScrollingNumberItems />
  </ScrollingNumberContainer>
)
