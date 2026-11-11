import { SkillsPage } from "./SkillsPage"

/**
 * What the design-system skill is, how to install it from the package, and what you can ask it. Built in the
 * homepage's style: the same backdrop, headline and glass tiles.
 */
export default {
  title: "Skills/Design System",
  component: SkillsPage,
  parameters: { layout: "fullscreen" },
}

export const DesignSystem = () => <SkillsPage />
