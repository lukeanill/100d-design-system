import { TokensTheme } from "./tokens-theme"

/**
 * The page for the theme in the toolbar, built to the Figma "Tokens" frame (Themes file, node 514:6564): the theme's
 * name and settings, then its colour, texture, shadow, radius, principles, motion and typography. Switch theme in the
 * toolbar and every value follows.
 */
export default {
  title: "Tokens/Theme",
  component: TokensTheme,
  parameters: { layout: "fullscreen" },
}

export const Theme = () => <TokensTheme />
