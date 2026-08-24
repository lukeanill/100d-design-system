import { Link } from "react-router"
import { Button } from "@workspace/ui/components/button"
import { ThemeTogglerButton } from "@workspace/ui/components/animate-ui/components/buttons/theme-toggler"
import { componentList, type ComponentEntry } from "./component-list"

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

export function App() {
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

      <div className="text-muted-foreground text-sm">{componentList.length} components</div>

      <div className="flex flex-col divide-y rounded-2xl border">
        {rows.map((row) =>
          row.kind === "item" ? (
            <ItemRow key={row.item.path} item={row.item} />
          ) : (
            <details key={row.name}>
              <summary className="hover:bg-muted/50 flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-2.5 [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-medium">{row.name}</span>
                <span className="text-muted-foreground text-xs">{row.items.length} components</span>
              </summary>
              <div className="divide-y border-t">
                {row.items.map((item) => (
                  <ItemRow key={item.path} item={item} indent />
                ))}
              </div>
            </details>
          )
        )}
      </div>
    </div>
  )
}

function ItemRow({ item, indent }: { item: ComponentEntry; indent?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-4 py-2.5 pr-4 ${indent ? "pl-8" : "pl-4"}`}>
      <span className="text-sm font-medium">{item.name}</span>
      <span className="text-muted-foreground truncate font-mono text-xs">{item.path}</span>
    </div>
  )
}
