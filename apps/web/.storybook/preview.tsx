import type { Preview } from "@storybook/react-vite"
import { ThemeProvider } from "@workspace/ui/components/theme-provider"
import { FontThemeProvider } from "@workspace/ui/components/font-theme-provider"
import { colorThemes } from "@workspace/ui/lib/theme-registry"
import "@workspace/ui/globals.css"

const COLOR_ICONS: Record<string, string> = {
  light: "sun",
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
          ["Actions", "Inputs", "Selects", "Navigation", "Overlays", "Feedback", "Content", "Layout", "Theming"],
          "Animation",
        ],
      },
    },
    actions: { disable: true },
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
    theme: "light",
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider forcedTheme={context.globals.theme}>
        <FontThemeProvider>
          <div className="bg-background text-foreground min-h-screen p-6">
            <Story />
          </div>
        </FontThemeProvider>
      </ThemeProvider>
    ),
  ],
}

export default preview
