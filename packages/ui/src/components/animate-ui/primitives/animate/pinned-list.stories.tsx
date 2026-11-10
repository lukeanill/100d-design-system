import * as React from "react"
import { SurfaceFill } from "@workspace/ui/components/themed-surface"
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

  // the items are glass on a glass theme (Heavy, as Card), the theme's texture otherwise
  const itemClass = "relative isolate mb-1.5 cursor-pointer rounded-lg px-3 py-2 text-sm"

  return (
    <PinnedListImpl onPinnedChange={togglePin} style={{ width }}>
      <PinnedListPinned>
        <PinnedListLabel hide={pinned.length === 0} className="mb-1.5 text-xs font-[weight:var(--font-body-weight-action)] text-foreground/75">
          {pinnedLabel}
        </PinnedListLabel>
        <PinnedListItems>
          {ALL_ITEMS.filter((item) => pinned.includes(item)).map((item) => (
            <PinnedListItem key={item} id={item} className={itemClass}>
              <SurfaceFill popup weight="heavy" />
              {item}
            </PinnedListItem>
          ))}
        </PinnedListItems>
      </PinnedListPinned>

      <PinnedListUnpinned>
        <PinnedListLabel hide={pinned.length === ALL_ITEMS.length} className="mt-3 mb-1.5 text-xs font-[weight:var(--font-body-weight-action)] text-foreground/75">
          {unpinnedLabel}
        </PinnedListLabel>
        <PinnedListItems>
          {ALL_ITEMS.filter((item) => !pinned.includes(item)).map((item) => (
            <PinnedListItem key={item} id={item} className={itemClass}>
              <SurfaceFill popup weight="heavy" />
              {item}
            </PinnedListItem>
          ))}
        </PinnedListItems>
      </PinnedListUnpinned>
    </PinnedListImpl>
  )
}
