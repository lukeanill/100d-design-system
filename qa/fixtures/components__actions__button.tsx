import { PlusIcon } from "@phosphor-icons/react"

import { Button } from "@workspace/ui/components/button"

import { fill, type Fixture } from "../src/components/StateRender"
import { FOCUS, HOVER } from "../src/lib/force-states"

const LONG = "Save these changes to the workspace and notify everyone who can see it"

// hover, link hover and focus visible are drawn with the component's own styles held on
const fixture: Fixture = {
  states: [
    { name: "default", render: () => <Button>Button</Button> },
    { name: "outline", render: () => <Button variant="outline">Button</Button> },
    { name: "secondary", render: () => <Button variant="secondary">Button</Button> },
    { name: "ghost", render: () => <Button variant="ghost">Button</Button> },
    { name: "destructive", render: () => <Button variant="destructive">Button</Button> },
    { name: "link", render: () => <Button variant="link">Button</Button> },
    { name: "size xs", render: () => <Button size="xs">Button</Button> },
    { name: "size lg", render: () => <Button size="lg">Button</Button> },
    { name: "icon only", render: () => <Button size="icon" aria-label="Add"><PlusIcon /></Button> },
    { name: "icon only xs", render: () => <Button size="icon-xs" aria-label="Add"><PlusIcon /></Button> },
    { name: "icon only lg", render: () => <Button size="icon-lg" aria-label="Add"><PlusIcon /></Button> },
    { name: "icon + text xs", render: () => <Button size="xs"><PlusIcon />Button</Button> },
    { name: "icon + text lg", render: () => <Button size="lg"><PlusIcon />Button</Button> },
    { name: "disabled", render: () => <Button disabled>Button</Button> },
    { name: "link disabled", render: () => <Button variant="link" disabled>Button</Button> },
    { name: "invalid", render: () => <Button aria-invalid>Button</Button> },
    { name: "expanded", render: () => <Button variant="outline" aria-expanded>Button</Button> },
    { name: "hover", render: () => <Button {...HOVER}>Button</Button> },
    { name: "link hover", render: () => <Button variant="link" {...HOVER}>Button</Button> },
    { name: "focus visible", render: () => <Button {...FOCUS}>Button</Button> },
  ],
  scenarios: {
    width: (width) => <Button className={fill(width)}>Button</Button>,
    longText: () => <Button className="w-full">{LONG}</Button>,
  },
}

export default fixture
