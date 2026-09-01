import type { ComponentProps } from "react"
import { AvatarGroup as AvatarGroupImpl, AvatarGroupTooltip } from "./avatar-group"

export default {
  title: "Components/Content/Avatar Group",
  component: AvatarGroupImpl,
  argTypes: {
    side: { control: "select", options: ["top", "bottom", "left", "right"] },
    align: { control: "select", options: ["start", "center", "end"] },
    sideOffset: { control: { type: "range", min: 0, max: 60, step: 1 } },
    alignOffset: { control: { type: "range", min: -50, max: 50, step: 1 } },
    openDelay: { control: { type: "range", min: 0, max: 1000, step: 50 } },
    closeDelay: { control: { type: "range", min: 0, max: 1000, step: 50 } },
    transition: { table: { disable: true } },
    tooltipTransition: { table: { disable: true } },
    id: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {
    invertOverlap: false,
    translate: "-30%",
    side: "top",
    sideOffset: 25,
    align: "center",
    alignOffset: 0,
    openDelay: 0,
    closeDelay: 0,
  },
}

const people = [
  { name: "Alice", color: "#f97316" },
  { name: "Ben", color: "#22c55e" },
  { name: "Cara", color: "#3b82f6" },
  { name: "Deng", color: "#a855f7" },
]

export const AvatarGroupAnimate = (args: ComponentProps<typeof AvatarGroupImpl>) => (
  <AvatarGroupImpl {...args}>
    {people.map((p) => (
      <div key={p.name} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "9999px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 14,
            fontWeight: 600,
            backgroundColor: p.color,
            border: "2px solid white",
          }}
        >
          {p.name[0]}
        </div>
        <AvatarGroupTooltip>{p.name}</AvatarGroupTooltip>
      </div>
    ))}
  </AvatarGroupImpl>
)
