import type { StorybookConfig } from "@storybook/react-vite"

import { themeSync } from "../theme-sync-plugin.ts"

const config: StorybookConfig = {
  stories: ["../../../packages/ui/src/components/**/*.stories.tsx"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  addons: ["@storybook/addon-vitest", "@storybook/addon-a11y"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  viteFinal: async (viteConfig) => {
    if (process.env.STORYBOOK_BASE_PATH) {
      viteConfig.base = process.env.STORYBOOK_BASE_PATH
    }
    // the live studio commits themes; pull them in while Storybook is running
    viteConfig.plugins = [...(viteConfig.plugins ?? []), themeSync()]
    return viteConfig
  },
  managerHead: (head) => {
    if (!process.env.STORYBOOK_BASE_PATH) return head
    return `<base href="${process.env.STORYBOOK_BASE_PATH}" />\n${head}`
  },
}

export default config
