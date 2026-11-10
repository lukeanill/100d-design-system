import * as React from "react"
import {
  PinnedList as PinnedListImpl,
  PinnedListPinned,
  PinnedListUnpinned,
  PinnedListLabel,
  PinnedListItems,
  PinnedListItem,
} from "./pinned-list"

type PinnedListArgs = {
  items: string[]
  pinned: string[]
  pinnedLabel: string
  unpinnedLabel: string
  width: number
}

export default {
  title: "Components/Content/Pinned List",
  component: PinnedListImpl,
  argTypes: {
    items: { control: "object" },
    pinned: { control: "object" },
    pinnedLabel: { control: "text" },
    unpinnedLabel: { control: "text" },
    width: { control: { type: "range", min: 200, max: 480, step: 20 } },
    onPinnedChange: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {
    items: ["Design system", "Roadmap", "Sprint notes", "Bug backlog"],
    pinned: ["Design system"],
    pinnedLabel: "Pinned",
    unpinnedLabel: "Other",
    width: 280,
  },
}

export const PinnedListAnimate = ({ items: ALL_ITEMS, pinned: initialPinned, pinnedLabel, unpinnedLabel, width }: PinnedListArgs) => {
  const [pinned, setPinned] = React.useState<string[]>(initialPinned)
  // a change to the pinned control starts the list over from it
  React.useEffect(() => setPinned(initialPinned), [initialPinned])

  const togglePin = (item: string) => {
    setPinned((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item],
    )
  }

  const itemStyle: React.CSSProperties = {
    padding: "8px 12px",
    marginBottom: 6,
    borderRadius: 6,
    backgroundColor: "var(--muted)",
    cursor: "pointer",
    fontSize: 14,
  }

  return (
    <PinnedListImpl onPinnedChange={togglePin} style={{ width }}>
      <PinnedListPinned>
        <PinnedListLabel hide={pinned.length === 0} style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", marginBottom: 6 }}>
          {pinnedLabel}
        </PinnedListLabel>
        <PinnedListItems>
          {ALL_ITEMS.filter((item) => pinned.includes(item)).map((item) => (
            <PinnedListItem key={item} id={item} style={itemStyle}>
              {item}
            </PinnedListItem>
          ))}
        </PinnedListItems>
      </PinnedListPinned>

      <PinnedListUnpinned>
        <PinnedListLabel hide={pinned.length === ALL_ITEMS.length} style={{ fontSize: 12, fontWeight: 600, color: "var(--muted-foreground)", margin: "12px 0 6px" }}>
          {unpinnedLabel}
        </PinnedListLabel>
        <PinnedListItems>
          {ALL_ITEMS.filter((item) => !pinned.includes(item)).map((item) => (
            <PinnedListItem key={item} id={item} style={itemStyle}>
              {item}
            </PinnedListItem>
          ))}
        </PinnedListItems>
      </PinnedListUnpinned>
    </PinnedListImpl>
  )
}
