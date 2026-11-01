import { ShareButton } from "@workspace/ui/components/animate-ui/components/community/share-button"

import type { Fixture } from "../src/components/StateRender"

const fixture: Fixture = {
  states: [
    { name: "default", render: () => <ShareButton>Share</ShareButton> },
    { name: "sm", render: () => <ShareButton size="sm">Share</ShareButton> },
    { name: "md", render: () => <ShareButton size="md">Share</ShareButton> },
    { name: "lg", render: () => <ShareButton size="lg">Share</ShareButton> },
    { name: "prefix", render: () => <ShareButton icon="prefix">Share</ShareButton> },
    { name: "suffix", render: () => <ShareButton icon="suffix">Share</ShareButton> },
  ],
}

export default fixture
