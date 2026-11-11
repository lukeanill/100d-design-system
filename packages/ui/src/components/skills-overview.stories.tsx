import { SkillsOverview } from "./skills-overview"

/**
 * What the design-system skill is, how to install it from the package, what it can answer (and which reference file
 * holds each answer), the rules it works by, and how to keep it current.
 */
export default {
  title: "Skills/Design System",
  component: SkillsOverview,
  parameters: { layout: "fullscreen" },
}

export const DesignSystem = () => <SkillsOverview />
