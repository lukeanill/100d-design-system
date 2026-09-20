// One-shot: back-fills the studio's input fields onto themes that predate it.
//
// Deliberately does NOT touch `tokens`. These ten themes are hand-tuned; the
// studio only re-derives when someone presses Generate/Refresh.

import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { edgesFor, oklchToHex, parseOklch } from "../tokens/lib/color.mjs"

const TOKENS = join(dirname(dirname(fileURLToPath(import.meta.url))), "tokens")

// the order tokens.css has always emitted them in
const ORDER = [
  "system", "dark", "electric-pulse", "acid-forest", "carbon-mint",
  "solar-violet", "arctic-aurora", "strawberry-matcha", "metallic-mist", "glass",
]

const titleCase = (slug) =>
  slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")

const asHex = (tokens, name) => {
  const parsed = parseOklch(tokens[name] ?? "")
  return parsed ? oklchToHex(parsed) : null
}

for (const file of readdirSync(TOKENS).filter((f) => f.endsWith(".json") && !f.startsWith("."))) {
  const path = join(TOKENS, file)
  const theme = JSON.parse(readFileSync(path, "utf8"))
  if (!theme.tokens) continue

  const seeds = Object.fromEntries(
    ["background", "foreground", "primary", "secondary"]
      .map((name) => [name, asHex(theme.tokens, name)])
      .filter(([, hex]) => hex)
  )

  const next = {
    name: theme.name,
    label: theme.label ?? titleCase(theme.name),
    order: theme.order ?? (ORDER.indexOf(theme.name) === -1 ? ORDER.length : ORDER.indexOf(theme.name)),
    selector: theme.selector,
    seeds: theme.seeds ?? seeds,
    fonts: theme.fonts ?? {},
    edges: theme.edges ?? edgesFor(theme.tokens.radius ?? ""),
    overrides: theme.overrides ?? {},
    tokens: theme.tokens,
    ...(theme.extra ? { extra: theme.extra } : {}),
  }

  writeFileSync(path, JSON.stringify(next, null, 2) + "\n")
  console.log(
    `${next.name.padEnd(20)} order ${String(next.order).padStart(2)}  edges ${next.edges.padEnd(7)} seeds ${Object.keys(next.seeds).length}/4`
  )
}
