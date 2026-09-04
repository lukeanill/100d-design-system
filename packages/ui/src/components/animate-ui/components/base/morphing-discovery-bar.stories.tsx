import type { ComponentProps } from "react"
import { Flame, Heart, Sparkles } from "lucide-react"
import { MorphingDiscoveryBar as MorphingDiscoveryBarImpl } from "./morphing-discovery-bar"

export default {
  title: "Components/Navigation/Morphing Discovery Bar",
  component: MorphingDiscoveryBarImpl,
  parameters: { controls: { disable: true } },
}

const categories = [
  { icon: <Sparkles size={16} />, id: "new", label: "New" },
  { icon: <Flame size={16} />, id: "popular", label: "Popular" },
  { icon: <Heart size={16} />, id: "favorites", label: "Favorites" },
]

export const MorphingDiscoveryBar = (args: ComponentProps<typeof MorphingDiscoveryBarImpl>) => <MorphingDiscoveryBarImpl {...args} categories={categories} />
