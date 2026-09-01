import * as React from "react"
import {
  PinnedList as PinnedListImpl,
  PinnedListPinned,
  PinnedListUnpinned,
  PinnedListLabel,
  PinnedListItems,
  PinnedListItem,
} from "./pinned-list"

export default {
  title: "Components/Content/Pinned List",
  component: PinnedListImpl,
  argTypes: {
    onPinnedChange: { table: { disable: true } },
    children: { table: { disable: true } },
  },
}

const ALL_ITEMS = ["Design system", "Roadmap", "Sprint notes", "Bug backlog"]

export const PinnedListAnimate = () => {
  const [pinned, setPinned] = React.useState<string[]>(["Design system"])

  const togglePin = (item: string) => {
    setPinned((prev) =>
      prev.includes(item) ? prev.filter((p) => p !== item) : [...prev, item],
    )
  }

  const itemStyle: React.CSSProperties = {
    padding: "8px 12px",
    marginBottom: 6,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
    cursor: "pointer",
    fontSize: 14,
  }

  return (
    <PinnedListImpl onPinnedChange={togglePin} style={{ width: 280 }}>
      <PinnedListPinned>
        <PinnedListLabel hide={pinned.length === 0} style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 6 }}>
          Pinned
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
        <PinnedListLabel hide={pinned.length === ALL_ITEMS.length} style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", margin: "12px 0 6px" }}>
          Other
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
