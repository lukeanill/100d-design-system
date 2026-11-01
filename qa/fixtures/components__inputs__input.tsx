import { Input } from "@workspace/ui/components/input"

import { fill, type Fixture } from "../src/components/StateRender"
import { FOCUS } from "../src/lib/force-states"

const field = (props: React.ComponentProps<typeof Input>) => (
  <div className="w-[300px]">
    <Input placeholder="Email" {...props} />
  </div>
)

// focus is drawn with the component's own focus styles held on
const fixture: Fixture = {
  states: [
    { name: "default", render: () => field({}) },
    { name: "filled", render: () => field({ defaultValue: "luke@example.com" }) },
    { name: "disabled", render: () => field({ disabled: true }) },
    { name: "invalid", render: () => field({ "aria-invalid": true, defaultValue: "luke@" }) },
    { name: "focus", render: () => field({ ...FOCUS }) },
    { name: "file", render: () => field({ type: "file" }) },
  ],
  scenarios: {
    width: (width) => <Input className={fill(width)} placeholder="Email" />,
    longText: () => <Input className="w-full" defaultValue="a.very.long.address.that.keeps.going.and.going@a-company-with-a-long-name.example.com" />,
  },
}

export default fixture
