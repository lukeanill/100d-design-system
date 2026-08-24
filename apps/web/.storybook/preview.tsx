import type { Preview } from "@storybook/react-vite"
import { ThemeProvider } from "../src/components/theme-provider"
import "@workspace/ui/globals.css"

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        method: "alphabetical",
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="bg-background text-foreground min-h-screen p-6">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
}

export default preview
