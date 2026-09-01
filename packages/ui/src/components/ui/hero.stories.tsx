import type { ComponentProps } from "react"
import { Hero as HeroImpl, HeroContent, HeroTitle, HeroDescription, HeroActions } from "./hero"

export default {
  title: "Components/Content/Hero",
  component: HeroImpl,
  argTypes: {
    "data.title": { control: "text" },
    "data.subtitle": { control: "text" },
    "data.logoSeparator": { control: "text" },
    "data.logo1.text": { control: "text" },
    "data.logo2.text": { control: "text" },
    "data.primaryButton.label": { control: "text" },
    "data.secondaryButton.label": { control: "text" },
    "data.techLogosLabel": { control: "text" },
    "data.techLogos": { table: { disable: true } },
    actions: { table: { disable: true } },
  },
  args: {
    data: {
      logo1: { alt: "Acme", text: "Acme" },
      logo2: { alt: "Vercel", text: "Vercel" },
      logoSeparator: "×",
      primaryButton: { label: "Get Started" },
      secondaryButton: { label: "View on GitHub" },
      subtitle:
        "Create beautiful chat experiences with our comprehensive component library designed for agentic applications.",
      techLogos: [{ name: "React" }, { name: "TypeScript" }, { name: "Tailwind CSS" }],
      techLogosLabel: "Built with",
      title: "Build beautiful MCP App experiences with mcpcn",
    },
  },
}

export const Hero = (args: ComponentProps<typeof HeroImpl>) => (
  <HeroImpl {...args}>
    <HeroContent>
      <HeroTitle />
      <HeroDescription />
      <HeroActions />
    </HeroContent>
  </HeroImpl>
)
