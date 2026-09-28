import * as React from "react"

import { Button } from "@workspace/ui/components/button"
import { ThemePageTransition } from "@workspace/ui/components/transitions/theme-page-transition"

/**
 * The transition a theme brings with it, as the app plays it: the key is the
 * route, and the page underneath swaps while covered.
 *
 * The `transition` control stands in for the theme's own choice, so every
 * option can be tried without saving a theme. Left on "theme", it plays
 * whatever the theme selected in the toolbar chose — which is "none" for every
 * theme until someone picks one in the studio.
 */
const PAGES = [
  { name: "Overview", body: "The first page. Press Next to move." },
  { name: "Reports", body: "The second page, arrived at through the transition." },
  { name: "Settings", body: "The third. Transitions play in both directions." },
]

export default {
  title: "Animation/Page Transitions/Theme Setting",
  component: ThemePageTransition,
  parameters: { layout: "fullscreen" },
  argTypes: {
    transition: {
      control: "select",
      options: ["theme", "none", "fade", "blinds", "curtain", "iris"],
    },
  },
  args: { transition: "curtain" },
}

type Args = { transition: string }

export const ThemeSetting = ({ transition }: Args) => {
  const [page, setPage] = React.useState(0)
  const current = PAGES[page]

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center gap-2 border-b border-muted p-4">
        <Button onClick={() => setPage((p) => (p + PAGES.length - 1) % PAGES.length)} variant="outline">
          Previous
        </Button>
        <Button onClick={() => setPage((p) => (p + 1) % PAGES.length)}>Next</Button>
      </div>

      <ThemePageTransition
        transitionKey={current.name}
        transition={transition === "theme" ? undefined : (transition as "none")}
      >
        <section className="flex flex-1 flex-col gap-4 p-10">
          <h2>{current.name}</h2>
          <p className="text-body-lg">{current.body}</p>
        </section>
      </ThemePageTransition>
    </div>
  )
}
