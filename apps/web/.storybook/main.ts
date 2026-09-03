import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: ["../../../packages/ui/src/components/**/*.stories.tsx"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  addons: ["@storybook/addon-vitest"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  viteFinal: async (viteConfig) => {
    if (process.env.STORYBOOK_BASE_PATH) {
      viteConfig.base = process.env.STORYBOOK_BASE_PATH
    }
    return viteConfig
  },
  managerHead: (head) => {
    if (!process.env.STORYBOOK_BASE_PATH) return head
    return `<base href="${process.env.STORYBOOK_BASE_PATH}" />\n${head}`
  },
}

export default config
