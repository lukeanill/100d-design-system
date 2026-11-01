import { Textarea } from "@workspace/ui/components/textarea"

import { fill, type Fixture } from "../src/components/StateRender"
import { FOCUS } from "../src/lib/force-states"

const box = (props: React.ComponentProps<typeof Textarea>) => (
  <div className="w-[300px]">
    <Textarea placeholder="Message" {...props} />
  </div>
)

// focus is drawn with the component's own focus styles held on
const fixture: Fixture = {
  states: [
    { name: "default", render: () => box({}) },
    { name: "invalid", render: () => box({ "aria-invalid": true, defaultValue: "Too short" }) },
    { name: "focus", render: () => box({ ...FOCUS }) },
  ],
  scenarios: {
    width: (width) => <Textarea className={fill(width)} placeholder="Message" />,
    longText: () => (
      <Textarea
        className="w-full"
        defaultValue="Thanks for getting back to me so quickly. I have read the whole thread twice now, and I still think the third option is the safest one, because it does not change anything for the people who already use it every day."
      />
    ),
  },
}

export default fixture
