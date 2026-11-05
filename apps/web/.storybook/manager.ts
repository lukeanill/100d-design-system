import { addons } from "storybook/manager-api"
import { create } from "storybook/theming"
import { getPreset } from "@workspace/ui/themes"

// Storybook's own UI wears the Ushuaia theme: its palette and body face.
const ushuaia = getPreset("ushuaia")!
const { palette, fonts } = ushuaia
const fontBase = `"${fonts.body.family}", sans-serif`

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "AI Design System - Storybook",

    colorPrimary: palette.primary,
    colorSecondary: palette.primary,

    appBg: palette.background,
    appContentBg: palette.background,
    appPreviewBg: palette.background,
    appBorderColor: "rgba(15, 14, 14, 0.12)",
    appBorderRadius: 16,

    fontBase,

    textColor: palette.foreground,
    textInverseColor: palette.background,
    textMutedColor: "#6b6963",

    barTextColor: "#6b6963",
    barHoverColor: palette.foreground,
    barSelectedColor: palette.foreground,
    barBg: palette.background,

    buttonBg: palette.secondary,
    buttonBorder: "rgba(15, 14, 14, 0.12)",
    booleanBg: "rgba(15, 14, 14, 0.12)",
    booleanSelectedBg: palette.primary,

    inputBg: palette.secondary,
    inputBorder: "rgba(15, 14, 14, 0.12)",
    inputTextColor: palette.foreground,
    inputBorderRadius: 8,
  }),
})
