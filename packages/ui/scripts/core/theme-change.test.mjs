// Guards the code shared by the CLI, the dev studio and the hosted studio.
//
// The hosted studio commits straight to the repo, so a mistake here ships
// without anyone reading a diff first. These tests check the properties that
// keep that safe: saving an untouched theme changes nothing, a theme's stored
// selector is never re-derived, delete undoes create exactly, and a new
// contrast failure is visible to the caller that has to block on it.
//
//   node --test packages/ui/scripts/core/

import { strict as assert } from "node:assert"
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"
import test from "node:test"

import { applyThemeChange, listThemes } from "./theme-change.mjs"
import { readWorkspace } from "./workspace-fs.mjs"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "../../../..")
const read = (rel) => readFileSync(join(ROOT, rel), "utf8")
const workspace = () => readWorkspace(ROOT)

/** The workspace you get by applying a change, without re-reading the disk. */
const advance = (ws, result) => ({
  ...ws,
  themes: Object.fromEntries(
    result.themes.map(({ swatches: _swatches, ...theme }) => [theme.name, theme])
  ),
  tokensCss: result.files["packages/ui/src/styles/tokens.css"] ?? ws.tokensCss,
  colorRegistry: result.files["packages/ui/src/lib/theme-registry.ts"] ?? ws.colorRegistry,
  fontRegistry: result.files["packages/ui/src/lib/font-theme-registry.ts"] ?? ws.fontRegistry,
})

test("re-saving an unchanged theme rewrites nothing", () => {
  const ws = workspace()
  for (const [name, theme] of Object.entries(ws.themes)) {
    const { files } = applyThemeChange(ws, { type: "save", theme })
    for (const [path, content] of Object.entries(files)) {
      assert.equal(content, read(path), `${name} rewrote ${path}`)
    }
  }
})

test("the default theme keeps its :root selector", () => {
  const ws = workspace()
  assert.equal(ws.themes["lighten-up"].selector, ":root", "fixture assumption")
  const { files } = applyThemeChange(ws, { type: "save", theme: ws.themes["lighten-up"] })
  const saved = JSON.parse(
    files["packages/ui/tokens/lighten-up.json"] ?? read("packages/ui/tokens/lighten-up.json")
  )
  // deriving this would move the default theme off :root and unstyle the site
  assert.equal(saved.selector, ":root")
})

test("the :root default is written before the themes that override it", () => {
  const css = read("packages/ui/src/styles/tokens.css")
  // same specificity as .dark, so a default written later would win over every
  // theme instead of being the fallback they replace
  assert.ok(css.indexOf("\n:root {") < css.indexOf("\n.dark {"), ":root must come first")
})

test("a new theme reaches every file the app reads from", () => {
  const ws = workspace()
  const base = ws.themes["carbon-mint"]
  const { files, themes } = applyThemeChange(ws, {
    type: "save",
    theme: {
      name: "Test Sunset",
      label: "Test Sunset",
      seeds: base.seeds,
      fonts: { primary: "Inter", emphasis: "Lora" },
      fontSource: "google",
      tokens: base.tokens,
    },
  })

  assert.ok(themes.some((t) => t.name === "test-sunset"), "slugged into the list")
  assert.ok(files["packages/ui/tokens/test-sunset.json"], "theme file written")
  assert.match(files["packages/ui/src/lib/theme-registry.ts"], /id: "test-sunset"/)
  assert.match(files["packages/ui/src/lib/font-theme-registry.ts"], /id: "test-sunset"/)
  // the union type has to grow alongside the array or typecheck fails
  assert.match(files["packages/ui/src/lib/font-theme-registry.ts"], /\| "test-sunset"/)
  assert.match(files["packages/ui/src/styles/tokens.css"], /\.test-sunset \{/)
  assert.match(files["packages/ui/src/styles/tokens.css"], /family=Lora/)
})

test("deleting a theme restores every file exactly", () => {
  const ws = workspace()
  const base = ws.themes["carbon-mint"]
  const created = applyThemeChange(ws, {
    type: "save",
    theme: {
      name: "Test Sunset",
      label: "Test Sunset",
      seeds: base.seeds,
      fonts: { primary: "Inter", emphasis: "Lora" },
      fontSource: "google",
      tokens: base.tokens,
    },
  })

  const removed = applyThemeChange(advance(ws, created), { type: "delete", name: "test-sunset" })

  assert.equal(removed.files["packages/ui/tokens/test-sunset.json"], null, "theme file deleted")
  for (const path of [
    "packages/ui/src/styles/tokens.css",
    "packages/ui/src/lib/theme-registry.ts",
    "packages/ui/src/lib/font-theme-registry.ts",
  ]) {
    assert.equal(removed.files[path], read(path), `${path} not restored`)
  }
})

test("a new contrast failure is reported to the caller", () => {
  const ws = workspace()
  const base = ws.themes["carbon-mint"]
  const clean = applyThemeChange(ws, { type: "save", theme: base })
  assert.equal(clean.contrast.failures.length, 0, "the committed palette is clean")

  // grey on grey: nothing in CONTRAST_RULES can pass
  const grey = Object.fromEntries(
    Object.entries(base.tokens).map(([token, value]) =>
      /color|shadow|radius|font|spacing|tracking/.test(token) ? [token, value] : [token, "oklch(0.55 0 0)"]
    )
  )
  const bad = applyThemeChange(ws, {
    type: "save",
    theme: { name: "Test Mud", label: "Test Mud", seeds: base.seeds, fonts: base.fonts, tokens: grey },
  })
  assert.ok(bad.contrast.failures.length > 0, "unreadable theme must fail the gate")
  assert.ok(bad.contrast.failures.every((f) => f.kind === "new" || f.kind === "worse"))
})

test("a shortfall is recorded with the theme, so the save survives CI", () => {
  const ws = workspace()
  const base = ws.themes["carbon-mint"]
  const grey = Object.fromEntries(
    Object.entries(base.tokens).map(([token, value]) =>
      /color|shadow|radius|font|spacing|tracking/.test(token) ? [token, value] : [token, "oklch(0.55 0 0)"]
    )
  )
  const BASELINE_PATH = "packages/ui/tokens/.contrast-baseline.json"

  // Contrast never refuses a save. The shortfalls have to land in the same
  // commit as the theme: without them CI rejects it and it never deploys, so
  // the studio would report success having changed nothing.
  const saved = applyThemeChange(ws, {
    type: "save",
    theme: { name: "Test Mud", label: "Test Mud", seeds: base.seeds, fonts: base.fonts, tokens: grey },
  })
  assert.ok(saved.files["packages/ui/tokens/test-mud.json"], "the theme is still saved")
  assert.ok(saved.files[BASELINE_PATH], "its shortfalls are recorded alongside it")
  assert.ok(
    JSON.parse(saved.files[BASELINE_PATH])["test-mud"],
    "the saved theme's shortfalls must be in the baseline"
  )
  // reported either way — recorded is not the same as hidden
  assert.ok(saved.contrast.failures.length > 0, "the caller still sees the numbers")
})

test("updatedAt moves only when the theme actually changed", () => {
  const ws = workspace()
  const theme = ws.themes["carbon-mint"]
  const NOW = "2030-01-01T00:00:00.000Z"

  // an untouched re-save keeps the old date: a list you scan by recency must
  // not put a theme at the top because someone opened and closed it
  const untouched = applyThemeChange(ws, { type: "save", theme, now: NOW })
  const kept = JSON.parse(untouched.files[`packages/ui/tokens/${theme.name}.json`])
  assert.equal(kept.updatedAt, theme.updatedAt, "an untouched save must not bump the date")

  const edited = applyThemeChange(ws, {
    type: "save",
    theme: { ...theme, label: "Carbon Mint II" },
    now: NOW,
  })
  const saved = JSON.parse(edited.files[`packages/ui/tokens/${theme.name}.json`])
  assert.equal(saved.updatedAt, NOW, "a real edit stamps the date")
})

test("a clean save never touches the baseline", () => {
  const ws = workspace()
  // every committed theme is either clean or already held at baseline
  for (const theme of Object.values(ws.themes)) {
    const { files } = applyThemeChange(ws, { type: "save", theme })
    assert.equal(
      files["packages/ui/tokens/.contrast-baseline.json"],
      undefined,
      `${theme.name} rewrote the baseline with nothing to record`
    )
  }
})

test("reordering changes order everywhere, and nothing else", () => {
  const ws = workspace()
  const names = listThemes(ws.themes).map((t) => t.name)
  const reordered = [...names].reverse()
  const { files } = applyThemeChange(ws, { type: "reorder", order: reordered })
  const REGISTRY = "packages/ui/src/lib/theme-registry.ts"

  // themes and the registry, and no palette regeneration
  for (const path of Object.keys(files)) {
    if (path === REGISTRY) continue
    assert.match(path, /^packages\/ui\/tokens\/.+\.json$/, `reorder touched ${path}`)
  }
  for (const [path, content] of Object.entries(files)) {
    if (path === REGISTRY) continue
    const before = JSON.parse(read(path))
    const after = JSON.parse(content)
    assert.deepEqual({ ...after, order: 0 }, { ...before, order: 0 }, `${path} changed beyond order`)
  }

  // The registry carries `order` because the app's theme picker sorts by it.
  // Leaving it behind is how a reorder in the studio fails to reach the site.
  const registry = files[REGISTRY]
  assert.ok(registry, "a reorder must rewrite the registry")
  const first = reordered[0]
  assert.match(
    registry,
    new RegExp(`id: "${first}"[^}]*order: 0`),
    `${first} moved to the top but the registry still says otherwise`
  )
})

test("a theme without a generated palette is refused", () => {
  const ws = workspace()
  assert.throws(
    () => applyThemeChange(ws, { type: "save", theme: { name: "Empty", tokens: {} } }),
    /generated palette/
  )
})

test("the light theme cannot be deleted into a broken site", () => {
  const ws = workspace()
  assert.throws(() => applyThemeChange(ws, { type: "delete", name: "system" }), /Cannot delete/)
  assert.throws(() => applyThemeChange(ws, { type: "delete", name: "nope" }), /No theme called/)
})

test("archiving keeps the theme file but takes it out of the site", () => {
  const ws = workspace()
  const result = applyThemeChange(ws, { type: "archive", name: "bumblebee" })

  const stored = JSON.parse(result.files["packages/ui/tokens/bumblebee.json"])
  assert.equal(stored.archived, true, "the theme file stays, flagged")

  // nothing may be able to select an archived theme
  const registry = result.files["packages/ui/src/lib/theme-registry.ts"]
  assert.ok(registry && !registry.includes('id: "bumblebee"'), "left the registry")
  const css = result.files["packages/ui/src/styles/tokens.css"]
  assert.ok(css && !css.includes("\n.bumblebee {"), "left tokens.css")

  assert.equal(
    result.themes.find((t) => t.name === "bumblebee")?.archived,
    true,
    "the studio still lists it, so it can be brought back"
  )
})

test("unarchiving restores the theme exactly", () => {
  const ws = workspace()
  const archived = applyThemeChange(ws, { type: "archive", name: "bumblebee" })
  const restored = applyThemeChange(advance(ws, archived), {
    type: "unarchive",
    name: "bumblebee",
  })

  assert.deepEqual(
    JSON.parse(restored.files["packages/ui/tokens/bumblebee.json"]),
    JSON.parse(read("packages/ui/tokens/bumblebee.json")),
    "back to the stored file, byte for byte"
  )
  assert.equal(restored.files["packages/ui/src/styles/tokens.css"], read("packages/ui/src/styles/tokens.css"))

  // The registry gets the same entries back, though the restored one is
  // appended rather than slotted into its old position. That only shows up in
  // a diff: every picker sorts by each theme's `order`, not by array position.
  const entries = (source) => source.match(/\{ id: .*\}/g)?.sort()
  assert.deepEqual(
    entries(restored.files["packages/ui/src/lib/theme-registry.ts"]),
    entries(read("packages/ui/src/lib/theme-registry.ts"))
  )
})

test("the default theme cannot be archived into a broken site", () => {
  const ws = workspace()
  assert.throws(() => applyThemeChange(ws, { type: "archive", name: "system" }), /Cannot archive/)
  assert.throws(() => applyThemeChange(ws, { type: "archive", name: "nope" }), /No theme called/)
})
