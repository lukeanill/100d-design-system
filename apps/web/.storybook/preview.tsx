import type { Preview } from "@storybook/react-vite"
import { ThemeProvider } from "@workspace/ui/components/theme-provider"
import { presets } from "@workspace/ui/themes"
import "@workspace/ui/globals.css"

const COLOR_ICONS: Record<string, string> = {
  fabrik: "moon",
  illuzion: "moon",
  laroc: "sun",
  bootshaus: "moon",
  berghain: "moon",
  savaya: "moon",
  pacha: "sun",
  amnesia: "moon",
  ushuaia: "sun",
}

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Tokens",
          ["Colors", "Typography", "Effects", "Glass"],
          "Components",
          [
            "Actions",
            "Inputs",
            "Selects",
            "Navigation",
            "Overlays",
            "Feedback",
            "Content",
            "Layout",
            "Theming",
          ],
          "Animation",
        ],
      },
    },

    actions: { disable: true },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  globalTypes: {
    theme: {
      description: "Theme (color + font pairing)",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: presets.map((t) => ({
          value: t.id,
          icon: COLOR_ICONS[t.id] ?? "circle",
          title: t.label,
        })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    // Must be the id of a preset, or no theme class is applied and every token
    // is undefined: stories render with no colours at all.
    theme: "berghain",
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider forcedTheme={context.globals.theme}>
          {/* Fullscreen stories get no padding, so a story can reach the page
              edges -- a scoped overlay padded away from them isn't fullscreen. */}
          <div
            className={
              context.parameters.layout === "fullscreen"
                ? "min-h-screen bg-background text-foreground"
                : "min-h-screen bg-background p-6 text-foreground"
            }
          >
            <Story />
          </div>
      </ThemeProvider>
    ),
  ],
}

export default preview
