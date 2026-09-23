import type { Preview } from "@storybook/react-vite"
import { ThemeProvider } from "@workspace/ui/components/theme-provider"
import { FontThemeProvider } from "@workspace/ui/components/font-theme-provider"
import { colorThemes } from "@workspace/ui/lib/theme-registry"
import "@workspace/ui/globals.css"

const COLOR_ICONS: Record<string, string> = {
  "lighten-up": "sun",
  dark: "moon",
}

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Tokens",
          ["Colors", "Typography", "Radius", "Shadows"],
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
        items: colorThemes.map((t) => ({
          value: t.id,
          icon: COLOR_ICONS[t.id] ?? "circle",
          title: t.label,
        })),
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    // Must be an id in the theme registry. It used to be "light", which was
    // deleted with that theme: nothing matched, so no theme class was applied
    // and every token was undefined -- stories rendered with no colours at all,
    // and anything painted with var(--foreground) came out transparent.
    theme: "lighten-up",
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider forcedTheme={context.globals.theme}>
        <FontThemeProvider>
          <div className="min-h-screen bg-background p-6 text-foreground">
            <Story />
          </div>
        </FontThemeProvider>
      </ThemeProvider>
    ),
  ],
}

export default preview
