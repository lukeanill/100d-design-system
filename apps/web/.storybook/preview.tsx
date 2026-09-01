import type { Preview } from "@storybook/react-vite"
import { ThemeProvider } from "../src/components/theme-provider"
import "@workspace/ui/globals.css"

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
      description: "Design system theme",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", icon: "sun", title: "Light" },
          { value: "dark", icon: "moon", title: "Dark" },
          { value: "glass", icon: "mirror", title: "Glass" },
        ],
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
        <div className="bg-background text-foreground min-h-screen p-6">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}

export default preview
