import { useMemo, useState } from "react"
import { Link } from "react-router"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { ThemeTogglerButton } from "@workspace/ui/components/animate-ui/components/buttons/theme-toggler"
import { componentList, type ComponentEntry } from "./component-list"
import { PREVIEW_REGISTRY, getSource } from "./preview-registry"

const isMapItem = (item: ComponentEntry) => item.path.startsWith("ui/map/")
const isAnimationItem = (item: ComponentEntry) =>
  item.path.startsWith("animate-ui/primitives/") ||
  item.path.startsWith("fancy/text/") ||
  item.path.startsWith("fancy/background/")
const SOCIAL_POST_PATHS = new Set([
  "ui/instagram-post.tsx",
  "ui/linkedin-post.tsx",
  "ui/x-post.tsx",
  "ui/youtube-post.tsx",
])
const isSocialPostItem = (item: ComponentEntry) => SOCIAL_POST_PATHS.has(item.path)

const GROUP_DEFS = [
  { name: "Map", test: isMapItem },
  { name: "Animation", test: isAnimationItem },
  { name: "Social Posts", test: isSocialPostItem },
]

type Row =
  | { kind: "item"; name: string; item: ComponentEntry }
  | { kind: "group"; name: string; items: ComponentEntry[] }

const rows: Row[] = [
  ...componentList
    .filter((item) => !GROUP_DEFS.some((g) => g.test(item)))
    .map((item): Row => ({ kind: "item", name: item.name, item })),
  ...GROUP_DEFS.map(
    (g): Row => ({ kind: "group", name: g.name, items: componentList.filter(g.test) })
  ),
].sort((a, b) => a.name.localeCompare(b.name))

function matches(item: ComponentEntry, q: string) {
  return item.name.toLowerCase().includes(q) || item.path.toLowerCase().includes(q)
}

export function App() {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<ComponentEntry | null>(null)
  const q = query.trim().toLowerCase()

  const { visibleRows, totalVisible } = useMemo(() => {
    if (!q) {
      const total = rows.reduce((sum, r) => sum + (r.kind === "item" ? 1 : r.items.length), 0)
      return { visibleRows: rows, totalVisible: total }
    }
    const filtered = rows.flatMap((r): Row[] => {
      if (r.kind === "item") return matches(r.item, q) ? [r] : []
      const visibleItems = r.name.toLowerCase().includes(q) ? r.items : r.items.filter((i) => matches(i, q))
      return visibleItems.length > 0 ? [{ ...r, items: visibleItems }] : []
    })
    const total = filtered.reduce((sum, r) => sum + (r.kind === "item" ? 1 : r.items.length), 0)
    return { visibleRows: filtered, totalVisible: total }
  }, [q])

  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Design System</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" nativeButton={false} render={<Link to="/tokens">Tokens</Link>} />
          <Button variant="outline" nativeButton={false} render={<Link to="/history">History</Link>} />
          <ThemeTogglerButton variant="outline" modes={["light", "dark", "glass"]} />
        </div>
      </div>

      <Input
        placeholder="Filter components…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {selected && <PreviewPanel item={selected} onClose={() => setSelected(null)} />}

      <div className="text-muted-foreground text-sm">
        {totalVisible} of {componentList.length} components
      </div>

      <div className="flex flex-col divide-y rounded-2xl border">
        {visibleRows.length === 0 ? (
          <div className="text-muted-foreground p-4 text-sm">
            No components match &ldquo;{query}&rdquo;.
          </div>
        ) : (
          visibleRows.map((row) =>
            row.kind === "item" ? (
              <ItemRow
                key={row.item.path}
                item={row.item}
                active={selected?.path === row.item.path}
                onSelect={setSelected}
              />
            ) : (
              <details key={row.name} open={q.length > 0}>
                <summary className="hover:bg-muted/50 flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-2.5 [&::-webkit-details-marker]:hidden">
                  <span className="text-sm font-medium">{row.name}</span>
                  <span className="text-muted-foreground text-xs">{row.items.length} components</span>
                </summary>
                <div className="divide-y border-t">
                  {row.items.map((item) => (
                    <ItemRow
                      key={item.path}
                      item={item}
                      indent
                      active={selected?.path === item.path}
                      onSelect={setSelected}
                    />
                  ))}
                </div>
              </details>
            )
          )
        )}
      </div>
    </div>
  )
}

function ItemRow({
  item,
  indent,
  active,
  onSelect,
}: {
  item: ComponentEntry
  indent?: boolean
  active: boolean
  onSelect: (item: ComponentEntry) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={`hover:bg-muted/50 flex w-full items-center justify-between gap-4 py-2.5 pr-4 text-left ${
        indent ? "pl-8" : "pl-4"
      } ${active ? "bg-accent" : ""}`}
    >
      <span className="text-sm font-medium">{item.name}</span>
      <span className="text-muted-foreground truncate font-mono text-xs">{item.path}</span>
    </button>
  )
}

function PreviewPanel({ item, onClose }: { item: ComponentEntry; onClose: () => void }) {
  const [showCode, setShowCode] = useState(false)
  const preview = PREVIEW_REGISTRY[item.path]
  const source = getSource(item.path)

  return (
    <div className="rounded-2xl border">
      <div className="flex items-center justify-between gap-4 border-b px-4 py-3">
        <div>
          <div className="text-sm font-semibold">{item.name}</div>
          <div className="text-muted-foreground font-mono text-xs">{item.path}</div>
        </div>
        <div className="flex items-center gap-2">
          {source && (
            <Button size="sm" variant="outline" onClick={() => setShowCode((s) => !s)}>
              {showCode ? "Hide code" : "View code"}
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <div className="flex min-h-32 items-center justify-center p-6">
        {preview ? (
          preview()
        ) : (
          <span className="text-muted-foreground text-sm">
            No live preview available for this component &mdash; view the source below.
          </span>
        )}
      </div>

      {showCode && source && (
        <pre className="max-h-96 overflow-auto border-t bg-black/90 p-4 text-xs text-white/90">
          <code>{source}</code>
        </pre>
      )}
    </div>
  )
}
