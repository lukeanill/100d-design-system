import type { ComponentProps } from "react"
import { Flame, Heart, Sparkles } from "lucide-react"
import { MorphingDiscoveryBar as MorphingDiscoveryBarImpl } from "./morphing-discovery-bar"

export default {
  title: "Components/Navigation/Morphing Discovery Bar",
  component: MorphingDiscoveryBarImpl,
  parameters: { controls: { disable: true } },
}

const categories = [
  { activeColor: "var(--color-primary)", activeTextColor: "var(--color-primary-foreground)", icon: <Sparkles size={16} />, id: "new", label: "New" },
  { activeColor: "var(--color-muted)", activeTextColor: "var(--color-foreground)", icon: <Flame size={16} />, id: "popular", label: "Popular" },
  { activeColor: "var(--color-destructive)", activeTextColor: "white", icon: <Heart size={16} />, id: "favorites", label: "Favorites" },
]

export const MorphingDiscoveryBar = (args: ComponentProps<typeof MorphingDiscoveryBarImpl>) => <MorphingDiscoveryBarImpl {...args} categories={categories} />
