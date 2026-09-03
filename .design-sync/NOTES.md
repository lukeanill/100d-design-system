# design-sync notes — @workspace/ui

## Re-sync risk: grade key format

At the closing driver run, 15 components (mostly `Fancy*` text effects, plus
`AnimateUIThemeTogglerButton`, `BlockTable`, `Breadcrumb`, `Bubble`) showed up
in `pendingGrade` despite already having a `.grade.json` file written by a
fan-out subagent. Root cause for most of them: the subagent wrote the grade
key as the PascalCase **export name** (e.g. `"AnimatedGradientWithSvg"`)
instead of the space-separated **story display name** (e.g. `"Animated
Gradient With Svg"`) — compare.mjs silently never recognized these grades at
all; they were invalid from the moment they were written, not invalidated
later. (A smaller subset — BlockTable/Breadcrumb/Bubble — had correctly
formatted keys but still showed `grade cleared — contract changed`; cause not
fully diagnosed, but re-grading from the fresh sheet resolved it identically
to the original verdicts, so it's low-risk.) All 15 were re-verified against
fresh sheets at close-out and re-graded with corrected keys — same verdicts
as originally reported by the subagents in every case. **If a future
fan-out wave's subagent prompt is reused, make the key format explicit**:
"grade keys must be the exact story display name with spaces, e.g. the
`name` field printed by compare.mjs's `--components` output — not the
PascalCase component/export name" — and verify with the closing driver run
before trusting a wave's grades are durable.

## Accepted grading deltas (from fan-out waves)

- `AnimateUIThemeTogglerButton` ("Theme Toggler" story) — graded `mismatch`.
  Idle-render icon differs: storybook shows the Monitor/system icon, the
  preview shows the Sun/light icon. Both sides wrap with the identical
  `<ThemeProvider forcedTheme="light">`; `ThemeProvider` hardcodes
  `defaultTheme="system"` internally (not a prop `cfg.provider` can
  override — its signature only accepts `children`/`forcedTheme`, see
  `packages/ui/src/components/theme-provider.tsx`). Confirmed
  `localStorage.getItem('theme') === null` on both sides (not a leaked-
  state artifact), and reproducible in isolation. Looks like a next-themes
  initial-render timing difference between storybook's own React tree and
  the bare `ReactDOM.createRoot(...).render(<ThemeProvider forcedTheme=
  "light">...)` the preview HTML mounts with — not fixable from an owned
  preview `.tsx` or from `cfg.provider`. If this recurs on OTHER components
  that read raw `useTheme().theme` (vs `resolvedTheme`) to branch on
  "system" vs a concrete mode, it's the same root cause, not a new bug.
- `AnimateUIProgress` ("Progress" story) — graded `close`. The displayed
  counting-number value differs by ~2 between captures (56 vs 54) — a
  spring/RAF-driven animation settles at a slightly different frame on each
  independent page load; the capture harness's clock-freeze stabilizes
  `Date` but not RAF-driven physics (see the corrected note on `Math.random`
  below — it turns out this harness never stabilizes that either). Bar width, label, and
  typography are pixel-identical. Not fixable via composition.
- `Avatar` (remote-image story, `github.com/shadcn.png`) — verified this is
  NOT the `[ASSETS_BLOCKED]` network-sandbox canary: confirmed real network
  egress (`curl -I` → 302 to avatars.githubusercontent.com) and both panels
  show the identical loaded photo. Graded `match`.
- **RAF/spring-animation timing artifact — same root cause, multiple
  components.** `AnimateUIPrimitiveCountingNumber`, `AnimateUIPrimitive
  ScrollingNumber`, `AnimateUIPrimitiveSlidingNumber` all graded `close`
  for the same reason as `AnimateUIProgress` above: a spring/RAF-driven
  counting/ticker animation settles at a slightly different frame on each
  independent page load (the capture harness's clock-freeze stabilizes
  `Date` but not physics-based settling). Layout/typography
  is pixel-identical each time; only the displayed digit(s) drift by a
  small amount. Not fixable via composition or config — expected on any
  future re-sync too, for any component built on the same spring/number-
  ticker primitive.
- `AnimateUIPrimitiveRotatingTextContainer` ("Rotating Texts") — graded
  `match` despite an intermittent blank capture. Root cause: `RotatingText`
  uses `AnimatePresence mode="wait"` without `initial={false}`, so each
  word swap is a double-hop exit-then-enter with a real transient
  all-blank frame — the compare harness's stabilization doesn't reliably
  skip it for this sequential-transition shape. Confirmed via 4 forced
  recaptures: the blank frame hit storybook's own reference render just as
  often as the preview, proving it's a harness-timing race, not a preview-
  fidelity bug. Whenever both sides land on a settled frame, they match
  exactly.
- **`compare.mjs` never waits for JS-driven (non-CSS) mount-triggered
  animations to settle — only fonts/images (`settleRender`).** Playwright's
  `animations:'disabled'` fast-forwards CSS animations/transitions, but not
  `motion/react` springs (inline-style, rAF-driven). `FancyVerticalCutReveal`
  ("Vertical Cut Reveal" story, graded `close`) showed its 3rd/most-delayed
  staggered word mid-spring in the ds capture while storybook's slower
  iframe load gave it more wall-clock time to settle first — confirmed via
  direct inspection with extra wait time that the component itself lays out
  identically once settled. Not a component defect, and not fixable from a
  preview `.tsx`. Likely affects any OTHER component with a mount-triggered,
  delayed/staggered `motion/react` entrance animation — treat a `close`
  grade citing "later element still animating in the ds capture" as this
  same class unless there's a genuine content/layout difference once
  settled.
- **`compare.mjs` never stabilizes `Math.random` — only `Date`.** Confirmed
  by reading `.ds-sync/storybook/compare.mjs` directly: it calls
  `page.clock.setFixedTime(...)` (its own comment notes "timers still
  run") and never patches `Math.random` anywhere. Two independent
  components hit this:
  - `FancyScrambleIn` ("Scramble In" story) — `autoStart`s a real
    `setInterval(50ms)` loop picking each revealed character via unseeded
    `Math.random()`. Confirmed via repeated `--force` recaptures: both
    sides produce DIFFERENT scrambled text and different reveal progress
    every single time, non-reproducibly. No preview-composition fix
    exists for a component's internal RNG. **Skipped**
    (`cfg.overrides.FancyScrambleIn.skip`) — the only honest option, since
    this story can never converge to a comparable pair of screenshots.
    Component is still in the bundle
    (`window.LukeanillUi.FancyScrambleIn`); only its preview card is
    unavailable.
  - `FancyAnimatedGradient` ("Animated Gradient With Svg" story) —
    computes each blurred decorative circle's position/size via unseeded
    `Math.random()` directly in render, so storybook and preview
    independently re-roll layout on every mount. Graded `close` rather
    than skipped: unlike ScrambleIn's revealed TEXT (which reads as
    broken/wrong when it differs), differing blob positions is the
    component's actual designed behavior — there's no "correct" position
    to match, so a plausible-looking random layout is a legitimate
    render, not a defect.
  - **Re-sync risk**: any OTHER component anywhere in this DS that
    autostarts a `setInterval`/RAF loop driven by unseeded `Math.random()`
    (not just these two) will hit the identical non-determinism. If a
    future sync's compare pass shows a component with wildly different
    content between sb/ds captures on every recapture (not just a minor
    frame-timing drift), suspect this class of bug first and check the
    component's source for raw `Math.random()` calls before assuming
    something else broke.

## Skipped stories / overrides

- `AnimateUIPrimitiveGithubStars` (`Animation/Github Stars Animate`) —
  skipped (`cfg.overrides.AnimateUIPrimitiveGithubStars.skip`). The
  component does a live `fetch("https://api.github.com/repos/...")` and only
  renders once that resolves — not statically renderable, and the reference
  storybook build itself tags this story `["!dev"]` (excluded from dev
  builds), suggesting the DS team already treats it as special-cased. The
  component is still in the bundle (`window.LukeanillUi.
  AnimateUIPrimitiveGithubStars`) — only its preview card is unavailable.
- `AnimateUIPrimitiveSpring`, `AnimateUIPrimitiveTabs` — `cardMode: "column"`
  ([GRID_OVERFLOW] "wide": their stories render wider than a grid cell).
- `AnimateUIProgress`, `Sidebar` — `cardMode: "single"` ([GRID_OVERFLOW]
  "escape": fixed/portal content positions outside any cell).
- `ChartContainer` — `cardMode: "single"` (started as "column" for its
  [GRID_OVERFLOW] "wide" warning; compare.mjs's solo-phase pass then flagged
  [PORTAL?] too — recharts' tooltip renders through a portal. Since it's a
  single-story component, "single" subsumes both concerns: full-bleed width
  AND fixed/portal containment).

## Known render warns (checked, not chased)

- `[TOKENS_MISSING]` for `--toast-index`, `--toast-swipe-movement-x/y`,
  `--first-color`…`--sixth-color` — all set at RUNTIME via inline styles /
  JS (toast swipe-gesture tracking in `toast.tsx`; animated gradient colors
  in `animate-ui/components/backgrounds/bubble.tsx`), never in a stylesheet.
  Expected absence, not a bug — confirmed by reading the source.
- `[FONT_MISSING]` "Google Sans" (`--font-google-sans`, feeds
  `--font-body-token`) — Google's own product/brand font, not available as
  a redistributable webfont package. Accepting the substitute: the token's
  own fallback stack (`-apple-system, ui-sans-serif, system-ui, sans-serif`)
  is reasonable. Not sourced via `cfg.extraFonts`.
- `MapCarousel` renders blank/grey map tiles in BOTH the storybook reference
  AND the preview capture — confirmed this isn't the `[ASSETS_BLOCKED]`
  network-sandbox canary (network is reachable from this build environment;
  `curl` to `api.mapbox.com` and `tile.openstreetmap.org` both returned 200).
  No `MAPBOX_TOKEN` is set in this build environment, so both renders
  legitimately lack live map tiles the same way — layout, markers, and card
  styling all match. If a future re-sync runs with a real Mapbox token,
  re-verify this component specifically (real tiles would be new visual
  surface neither side showed here).

## Repo shape

- Monorepo (pnpm workspaces). Storybook config lives at `apps/web/.storybook`
  (`storybookConfigDir` must point at the `.storybook` dir itself, not its
  package root — pointing it at `apps/web` breaks story-source resolution
  silently: `resolveStorySources` bases its import-path lookup on
  `dirname(sbDir)`, so one level off means every `importPath` fails to
  resolve and every story goes unpaired with no error, just `0/0 stories
  paired`).
- The design system package (`packages/ui`, publishes as `@lukeanill/ui`) has
  **no root `.` export** — `package.json` only declares subpath exports
  (`./components/*`, `./hooks/*`, `./lib/*`). This is a real per-repo
  strangeness: design-sync's storybook shape requires a single dist entry
  file for both the JS bundle AND (via ts-morph's default `index.d.ts`
  fallback) component/export discovery.

## The synthesized entry (`gen-entry.mjs`)

`.design-sync/scripts/gen-entry.mjs` synthesizes `packages/ui/dist/index.js`
+ `index.d.ts` — a barrel re-exporting every dist component. **Re-run it
after every `pnpm -F "@workspace/ui..." build`** (dist is `rm -rf`'d on
every build) — `cfg.buildCmd` chains both.

This package layers four component families that reuse names across layers
(e.g. "Tabs" exists in `animate-ui/primitives/base`, `primitives/animate`,
AND `components/base` — 83 raw collisions). The script's naming scheme:

- `components/*.js` (direct children) → bare name (canonical DS layer, always
  wins the unprefixed slot)
- `components/ui/*.js` → bare name unless it collides with a top-level name
  (only `Table`/`TableHeader`/`TableFooter` did) → `Block` prefix
- `components/animate-ui/components/**` → always `AnimateUI` prefix
- `components/animate-ui/primitives/**` → always `AnimateUIPrimitive` prefix
- `components/fancy/**` → always `Fancy` prefix
- Residual same-family collisions (e.g. two files both named `tabs.js` under
  different dirs) get a directory-then-basename infix appended
  incrementally until unique (see the script's disambiguation comment).

The script also handles two export styles the naive "read the trailing
`export {...}`" approach misses:
- **Default exports** — all 25 `fancy/**` components use
  `export default <Identifier>;`. The captured identifier (not a
  filename-derived guess) becomes the real name — tsc-compiled names
  sometimes reorder words vs. the kebab-case filename (e.g.
  `underline-center.js`'s default export is named `CenterUnderline`, not
  `UnderlineCenter`).
- **Re-export-only files** — `direction.js` is `export { DirectionProvider,
  useDirection } from "@base-ui/react/direction-provider";` (a thin proxy
  around a third-party primitive, no local declarations). The original regex
  only matched `export {...};` with nothing between `}` and `;`; broadened to
  allow an optional `from "..."` clause.

**Re-sync risk**: any FUTURE component added to this DS in this
default-export or re-export-only style needs no script change (both forms
are handled generically) — but a genuinely NEW export *style* (e.g.
`export default function Name() {}` inline, `export default class`) would
need the regex in `exportNamesFromSource` extended. Watch the gen-entry
output count vs. the dist file count if a re-sync's numbers look off.

## `cfg.titleMap` (97 entries)

Because so many components are prefixed (family disambiguation above), the
tool's automatic story-title → export-name matching (last title segment,
space-stripped) only worked for 58/155 titles out of the box. Rather than
hand-guess 97 entries, `.design-sync/scripts/gen-titlemap.mjs` cross-
references the reference storybook's `index.json` (title → importPath)
against `gen-entry.mjs`'s sidecar (`.design-sync/.cache/gen-entry-map.json`,
file → {realName: globalName}) to derive the mapping from ground truth. Run
it after any `gen-entry.mjs` change that could shift global names; diff its
stdout against `config.json`'s `titleMap` and merge.

**Two deliberate title/name conflicts** (the tool's `titleMap` is a flat
`{segment: name}` map with no way to disambiguate by parent path, so a
same-named leaf under two different titles can only resolve to ONE target):
- `"ThemeToggler"` → mapped to the styled `AnimateUIThemeTogglerButton`
  (`Components/Theming/Theme Toggler`). The primitive interaction demo
  (`Animation/Interactions/Theme Toggler`, `AnimateUIPrimitiveThemeToggler`)
  is intentionally dropped — lower priority than the ready-to-use component.
- `"Highlight"` → mapped to the interaction effect primitive
  (`AnimateUIPrimitiveHighlight`, from `Animation/Interactions/Highlight`).
  The text-highlight primitive (`Animation/Text/Loops/Highlight`,
  `AnimateUIPrimitiveHighlightText`) is intentionally dropped.

If either dropped story matters more than its sibling, swap which global
name wins that `titleMap` key and accept the other drops instead — both
components ARE in the bundle either way (`window.LukeanillUi.
AnimateUIPrimitiveThemeToggler` / `...HighlightText` still exist); only the
STORY/PREVIEW CARD for the losing one is unavailable.

**Excluded entirely — `"CodeBlock": null`**: `animate-ui/primitives/animate/
code-block.tsx` dynamically imports `shiki` (a syntax highlighter with
megabytes of embedded language grammars/themes), which alone pushed
`_ds_bundle.js` from ~1.3MB to ~14.5MB — over the 12MB upload cap. No
`cfg.*` knob trims a specific package out of the main bundle (that's inside
`lib/bundle.mjs`, which is app-contract surface — never forked), so
`gen-entry.mjs` excludes this ONE file from the barrel entirely (see its
`EXCLUDE` set) and `titleMap.CodeBlock: null` drops the now-orphaned story
to match. If this DS ever needs a real code-block/syntax-highlighting
component in the design agent's toolkit, it would need a lighter-weight
highlighter swapped in upstream, or `shiki`'s grammars trimmed to a specific
language subset — not something to solve at sync time.

**4 non-component "story" pages excluded**: `Tokens/Colors`,
`Tokens/Typography`, `Tokens/Radius`, `Tokens/Shadows` are documentation
pages (`tokens-*.stories.tsx`), not components — `titleMap: null` for each.

## `cfg.provider`

`ThemeProvider` (from `next-themes`, sets the color theme class) wraps
`FontThemeProvider` (reads the active theme via `useTheme()`, sets
`data-font-theme` on `<html>` — this attribute selects which font-family
CSS variables apply). **Both are required for correct rendering** — without
`FontThemeProvider`, every preview renders with the wrong/default font
regardless of CSS being present, since font selection is entirely
attribute-driven, not just token-driven.

```json
{"component": "ThemeProvider", "props": {"forcedTheme": "light"}, "inner": {"component": "FontThemeProvider"}}
```

The real `.storybook/preview.tsx` decorator ALSO wraps stories in
`<div className="bg-background text-foreground min-h-screen p-6">` for
canvas background/padding — `cfg.provider` can't express arbitrary markup,
only real component chains, so this is NOT replicated. Cosmetic gap only
(no context/functionality lost) — previews may render on a lighter/plainer
background than the real storybook canvas. Accept as `close` if a compare
grade flags only this.

## Known font-loader limitation

The decorator auto-bundle (before `cfg.provider` was set) failed with
`No loader is configured for ".woff2" files` — `@workspace/ui/globals.css`
pulls in `@fontsource/*` packages whose CSS references `.woff2` files
directly, which the decorator-bundler's esbuild config has no loader for.
Setting `cfg.provider` explicitly (above) sidesteps this entirely —
decorator auto-bundling is skipped once a provider is configured. Not an
issue in practice, but worth knowing if `cfg.provider` is ever removed.

## Re-sync risks

- `dist/index.js`/`index.d.ts` are gitignored build artifacts (regenerated
  by `gen-entry.mjs`, which is committed) — never hand-edit them.
- If new components are added under `animate-ui/` or `fancy/` with export
  names that collide in new ways, `gen-entry.mjs`'s disambiguation is
  deterministic but the resulting global name may differ from a name a
  human would have picked by hand — check `dist/index.js` after any
  re-sync where `git diff` on component counts looks surprising.
- `titleMap` was derived from THIS run's set of story titles. A renamed or
  regrouped story (different title) needs `gen-titlemap.mjs` re-run and its
  diff merged in — a stale titleMap entry just means a component quietly
  reverts to auto-resolution (usually harmless) or drops (worth checking
  the next build's `[TITLE_UNMAPPED]` count against 157 total stories).
- `[CSS_ASSETS]` warns about ~139 relative url() refs in the storybook-
  scraped CSS fallback not resolving post-upload — these are Fira Code
  font-weight variants already handled via the `fonts: 82 @font-face rules`
  extraction; the warning is expected here, not a new issue to chase, as
  long as the font count doesn't drop on a future sync.
