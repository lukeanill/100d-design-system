import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  stories: ["../../../packages/ui/src/components/**/*.stories.tsx"],
  staticDirs: ["../public"],
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
    return viteConfig
  },
  managerHead: (head) => {
    const base = process.env.STORYBOOK_BASE_PATH ?? "/"
    const icons = `<link rel="icon" type="image/png" sizes="32x32" href="${base}favicon.png" />
<link rel="icon" type="image/png" sizes="16x16" href="${base}favicon-16.png" />
<link rel="apple-touch-icon" href="${base}apple-touch-icon.png" />`
    // Storybook hardcodes "Storybook" as the tab title suffix; swap it for the product name.
    const title = `<script>
new MutationObserver(() => {
  const t = document.title.replace(/Storybook$/, "AI Design System - Storybook")
  if (t !== document.title && !/AI Design System - Storybook$/.test(document.title)) document.title = t
}).observe(document.querySelector("title") ?? document.head, { childList: true, characterData: true, subtree: true })
</script>`
    // the manager frame is separate from the stories, so it loads the theme's body face itself
    const fonts = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&display=swap" />`
    // the bookmark icon on each story row, the folder icon on each group and the component icon in the sidebar
    const hideIcons = `<style>.sidebar-item svg:has(> use[*|href="#icon--story"]),.sidebar-item svg:has(> use[*|href="#icon--group"]),.sidebar-item svg:has(> use[*|href="#icon--component"]){display:none}</style>`
    const baseTag = process.env.STORYBOOK_BASE_PATH ? `<base href="${base}" />\n` : ""
    return `${baseTag}${head}\n${icons}\n${fonts}\n${title}\n${hideIcons}`
  },
}

export default config
