import { useMemo, useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { derivePalette } from "@workspace/ui/tokens/color"
import { ColorSeed, EdgePicker, FontField } from "./ColorSeed"
import { SiteImport } from "./SiteImport"
import { DerivedPalette } from "./DerivedPalette"
import { ThemePreview } from "./ThemePreview"
import type { Fonts, Seeds, Theme } from "./api"

const SEED_FIELDS: { key: keyof Seeds; label: string }[] = [
  { key: "background", label: "Background" },
  { key: "foreground", label: "Foreground" },
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
]

const FONT_FIELDS: { key: keyof Fonts; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "emphasis", label: "Emphasis" },
  { key: "body", label: "Body" },
]

export function ThemeEditor({
  theme,
  busy,
  onSave,
  onCancel,
}: {
  theme: Theme | null
  busy: boolean
  onSave: (theme: Partial<Theme> & { name: string }) => void
  onCancel: () => void
}) {
  const [label, setLabel] = useState(theme?.label ?? "")
  const [seeds, setSeeds] = useState<Seeds>(theme?.seeds ?? {})
  const [fonts, setFonts] = useState<Fonts>(theme?.fonts ?? {})
  const [edges, setEdges] = useState(theme?.edges ?? "strong")
  const [overrides, setOverrides] = useState<Record<string, string>>(theme?.overrides ?? {})
  // The nine existing themes pair to bundled faces via [data-font-theme]; their
  // fonts are shown but not editable. New themes name Google families instead.
  const bundled = theme?.fontSource === "bundled"
  // an existing theme opens with its saved tokens; derivation only runs on demand
  const [tokens, setTokens] = useState<Record<string, string>>(theme?.tokens ?? {})

  const hasSeeds = SEED_FIELDS.every(({ key }) => Boolean(seeds[key]))
  const hasFonts = bundled || FONT_FIELDS.every(({ key }) => Boolean(fonts[key]?.trim()))
  const slug = useMemo(
    () => label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    [label]
  )

  const generate = (nextOverrides = overrides) => {
    if (!hasSeeds) return
    setTokens(derivePalette({ ...seeds, edges, overrides: nextOverrides }))
  }

  const override = (token: string, value: string) => {
    const next = { ...overrides, [token]: value }
    setOverrides(next)
    generate(next)
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-16">
      <header className="flex items-end justify-between gap-6">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Theme name"
          aria-label="Theme name"
          autoFocus
          className="w-full max-w-md border-b border-dashed border-foreground/40 bg-transparent pb-2 text-3xl font-light outline-none placeholder:text-foreground/30 focus-visible:border-foreground"
        />
        <div className="flex shrink-0 items-center gap-4">
          <Button
            onClick={() =>
              onSave({
              name: slug,
              label: label.trim(),
              seeds,
              fonts,
              edges,
              overrides,
              tokens,
              fontSource: bundled ? "bundled" : "google",
              ...(theme?.fontTheme ? { fontTheme: theme.fontTheme } : {}),
            })
            }
            disabled={!slug || !hasSeeds || !hasFonts || !Object.keys(tokens).length || busy}
          >
            {busy ? "Saving…" : "Save"}
          </Button>
          <button type="button" onClick={onCancel} className="text-sm text-foreground/70">
            Cancel
          </button>
        </div>
      </header>

      {/* Only offered on a new theme. Pulling a site over one that already
          exists would overwrite a palette someone chose, and the Reset here
          clears the panel, not the edits it made. */}
      {!theme && (
        <SiteImport
          onPulled={(pulled) => {
            setSeeds((current) => ({ ...current, ...pulled.seeds }))
            setFonts((current) => ({ ...current, ...pulled.fonts }))
            // the pulled seeds are the point, so show the palette they make
            if (SEED_FIELDS.every(({ key }) => Boolean(pulled.seeds[key]))) {
              setTokens(derivePalette({ ...pulled.seeds, edges, overrides }))
            }
          }}
        />
      )}

      <div className="grid gap-10 md:grid-cols-3">
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-light">Color</h2>
          {SEED_FIELDS.map(({ key, label: fieldLabel }) => (
            <ColorSeed
              key={key}
              label={fieldLabel}
              value={seeds[key]}
              onChange={(value) => setSeeds((s) => ({ ...s, [key]: value }))}
            />
          ))}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-light">Font</h2>
          {bundled ? (
            <>
              {FONT_FIELDS.map(({ key, label: fieldLabel }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <span className="text-sm text-foreground/80">{fieldLabel}</span>
                  <p className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-muted-foreground">
                    {fonts[key] ?? "—"}
                  </p>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Bundled faces from the {theme?.fontTheme} pairing. Edit them in
                font-theme-registry.ts.
              </p>
            </>
          ) : (
            FONT_FIELDS.map(({ key, label: fieldLabel }) => (
              <FontField
                key={key}
                label={fieldLabel}
                value={fonts[key]}
                onChange={(value) => setFonts((f) => ({ ...f, [key]: value }))}
              />
            ))
          )}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-light">Edges</h2>
          <EdgePicker value={edges} onChange={setEdges} />
        </section>
      </div>

      <DerivedPalette
        tokens={tokens}
        hasSeeds={hasSeeds}
        onGenerate={() => generate()}
        onOverride={override}
      />

      <ThemePreview
        tokens={tokens}
        fonts={fonts}
        generated={Object.keys(tokens).length > 0}
        onRefresh={() => generate()}
      />
    </div>
  )
}
