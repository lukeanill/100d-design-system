import { useMemo, useState } from "react"
import { Link } from "react-router"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { ThemeTogglerButton } from "@workspace/ui/components/animate-ui/components/buttons/theme-toggler"
import { componentList } from "./component-list"

export function App() {
  const [query, setQuery] = useState("")

  const items = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return componentList
    return componentList.filter(
      (item) => item.name.toLowerCase().includes(q) || item.path.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Design System</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" nativeButton={false} render={<Link to="/tokens">Tokens</Link>} />
          <Button variant="outline" nativeButton={false} render={<Link to="/qa">QA</Link>} />
          <Button variant="outline" nativeButton={false} render={<Link to="/history">History</Link>} />
          <ThemeTogglerButton variant="outline" modes={["light", "dark", "glass"]} />
        </div>
      </div>

      <Input
        placeholder="Filter components…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="text-muted-foreground text-sm">
        {items.length} of {componentList.length} components
      </div>

      <div className="flex flex-col divide-y rounded-2xl border">
        {items.length === 0 ? (
          <div className="text-muted-foreground p-4 text-sm">
            No components match &ldquo;{query}&rdquo;.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.path} className="flex items-center justify-between gap-4 px-4 py-2.5">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-muted-foreground truncate font-mono text-xs">
                {item.path}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
