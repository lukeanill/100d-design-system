import { IconButton } from "@workspace/ui/components/animate-ui/components/buttons/icon"

import type { Fixture } from "../src/components/StateRender"

// an icon button has a fixed size, so it has no width or long-text scenario
const fixture: Fixture = {
  states: [
    {
      name: "default",
      render: () => (
        <IconButton aria-label="Add">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M12 5v14M5 12h14" />
          </svg>
        </IconButton>
      ),
    },
  ],
}

export default fixture
