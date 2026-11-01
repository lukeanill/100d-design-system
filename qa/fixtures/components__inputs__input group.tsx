import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@workspace/ui/components/input-group"

import { fill, type Fixture } from "../src/components/StateRender"
import { FOCUS } from "../src/lib/force-states"

const group = (props: { invalid?: boolean; disabled?: boolean; focus?: boolean; value?: string; className?: string }) => (
  <InputGroup data-disabled={props.disabled ? "true" : undefined} className={props.className}>
    <InputGroupAddon>
      <InputGroupText>@</InputGroupText>
    </InputGroupAddon>
    <InputGroupInput
      placeholder="username"
      defaultValue={props.value}
      aria-invalid={props.invalid || undefined}
      disabled={props.disabled}
      {...(props.focus ? FOCUS : {})}
    />
  </InputGroup>
)

const sized = (child: React.ReactNode) => <div className="w-[300px]">{child}</div>

// focus is drawn with the component's own focus styles held on the field inside the group
const fixture: Fixture = {
  states: [
    { name: "default", render: () => sized(group({})) },
    { name: "focus", render: () => sized(group({ focus: true })) },
    { name: "invalid", render: () => sized(group({ invalid: true })) },
    { name: "disabled", render: () => sized(group({ disabled: true })) },
  ],
  scenarios: {
    width: (width) => group({ className: fill(width) }),
    longText: () => group({ value: "a.very.long.username.that.keeps.going.and.going.past.the.end.of.the.box" }),
  },
}

export default fixture
