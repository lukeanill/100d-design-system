import {
  FONT_SCALE_SIZES,
  GLASS_APPLICATIONS,
  GLASS_TONE_VALUES,
  GLASS_WEIGHT_VALUES,
  HEADING_LEVELS,
  HEADING_WEIGHTS,
  SHADOW_WEIGHTS,
  shadowDeclarations,
  // @ts-expect-error - shared .mjs settings tables, also used by the build scripts
} from "@workspace/ui/scripts/core/theme-settings"
import { cn } from "@workspace/ui/lib/utils"
import type { Effects, Glass, ShadowWeight, Typography } from "./api"

/**
 * The panels for everything a theme carries beyond colour and fonts.
 *
 * Every picker follows EdgePicker's rule: draw each option as the thing it
 * produces, and read the numbers from the same tables the generator writes
 * from, so a preview can never drift from the stylesheet.
 */

const WEIGHTS = GLASS_WEIGHT_VALUES as Record<string, { blur: string; saturate: string; surface: string }>
const TONES = GLASS_TONE_VALUES as Record<string, { tint: string | null; amount: string | null }>
const SCALES = FONT_SCALE_SIZES as Record<string, string[]>
const LEVELS = HEADING_LEVELS as ("h1" | "h2" | "h3" | "h4" | "h5" | "h6")[]
const APPLICATIONS = GLASS_APPLICATIONS as Glass["applications"]

const SECTION = "flex flex-col gap-4"
const HEADING = "text-xl font-light"
const LABEL = "text-sm text-foreground/80"
const NOTE = "text-xs text-muted-foreground"

/** A row of buttons, each drawn as what it does. */
function Options({
  label,
  children,
}: {
  label?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className={LABEL}>{label}</span>}
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Option({
  selected,
  onClick,
  label,
  children,
  disabled,
}: {
  selected: boolean
  onClick: () => void
  label: string
  children?: React.ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex w-20 flex-col items-center gap-1 rounded-lg border p-1.5 text-xs transition-colors",
        selected ? "border-primary bg-muted" : "border-border",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {children}
      <span className="truncate">{label}</span>
    </button>
  )
}

/** The strip a glass sample sits on, so the blur has something to blur. */
const STRIPE = {
  backgroundImage:
    "repeating-linear-gradient(45deg, var(--primary) 0 6px, var(--background) 6px 12px, var(--secondary) 12px 18px)",
}

function GlassSample({ weight, tone }: { weight?: string; tone?: string }) {
  const values = weight ? WEIGHTS[weight] : undefined
  const toneValues = TONES[tone ?? "clear"]
  return (
    <span className="relative block h-9 w-full overflow-hidden rounded" style={STRIPE}>
      <span
        className="absolute inset-1.5 rounded"
        style={{
          backgroundColor: values
            ? !toneValues.tint
              ? "transparent"
              : `color-mix(in oklab, color-mix(in oklab, var(--card) ${toneValues.amount}, ${toneValues.tint}) ${values.surface}, transparent)`
            : "var(--card)",
          backdropFilter: values ? `blur(${values.blur}) saturate(${values.saturate})` : undefined,
        }}
      />
    </span>
  )
}

export function SurfacePanel({
  glass,
  onChange,
}: {
  glass: Glass | undefined
  /** The editor's setter, so two quick edits in one frame cannot overwrite
   *  each other by both computing from the same stale value. */
  onChange: React.Dispatch<React.SetStateAction<Glass | undefined>>
}) {
  const current: Glass = glass ?? { style: "solid", weight: "medium", tone: "clear", applications: [] }
  const isGlass = current.style === "glass"
  const set = (patch: Partial<Glass>) =>
    onChange((prev) => {
      const next = { ...(prev ?? current), ...patch }
      return next.style === "glass" ? next : undefined
    })

  return (
    <section className={SECTION}>
      <h2 className={HEADING}>Surface</h2>

      <Options>
        <Option label="Solid" selected={!isGlass} onClick={() => set({ style: "solid" })}>
          <GlassSample />
        </Option>
        <Option label="Glass" selected={isGlass} onClick={() => set({ style: "glass" })}>
          <GlassSample weight={current.weight} tone={current.tone} />
        </Option>
      </Options>

      {isGlass && (
        <>
          <Options label="Weight">
            {Object.keys(WEIGHTS).map((weight) => (
              <Option
                key={weight}
                label={weight[0].toUpperCase() + weight.slice(1)}
                selected={current.weight === weight}
                onClick={() => set({ weight: weight as Glass["weight"] })}
              >
                <GlassSample weight={weight} tone={current.tone} />
              </Option>
            ))}
          </Options>

          <Options label="Colour">
            {Object.keys(TONES).map((tone) => (
              <Option
                key={tone}
                label={tone[0].toUpperCase() + tone.slice(1)}
                selected={current.tone === tone}
                onClick={() => set({ tone: tone as Glass["tone"] })}
              >
                <GlassSample weight={current.weight} tone={tone} />
              </Option>
            ))}
          </Options>

          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Applications</span>
            <label className="flex items-center gap-2 text-sm opacity-60">
              <input type="checkbox" checked readOnly disabled aria-label="Cards (always)" />
              Cards <span className={NOTE}>always</span>
            </label>
            {APPLICATIONS.map((group) => (
              <label key={group} className="flex items-center gap-2 text-sm capitalize">
                <input
                  type="checkbox"
                  checked={current.applications.includes(group)}
                  onChange={(e) =>
                    set({
                      applications: e.target.checked
                        ? [...current.applications, group]
                        : current.applications.filter((g) => g !== group),
                    })
                  }
                />
                {group}
              </label>
            ))}
            <p className={NOTE}>
              Menus and popovers are already glass. Ticking one retunes it to this theme; leaving it
              alone keeps the look it has today.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={LABEL}>Refraction</span>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={current.refraction === true}
                onChange={(e) => set({ refraction: e.target.checked ? true : undefined })}
              />
              Bend what is behind the glass
            </label>
            <p className={NOTE}>
              Cards refract Soft, and overlays, menus and selects refract Heavy. Actions and inputs
              stay on the plain blur. Chromium only; other browsers keep the blur.
            </p>
          </div>
        </>
      )}
    </section>
  )
}

/**
 * How dark the theme draws its shadows: Light is the theme's shadows as they
 * are, Medium and Dark scale them. Each option is drawn as the shadow it makes,
 * through the same emitter the generator writes with.
 */
export function ShadowPanel({
  shadow,
  tokens,
  onChange,
}: {
  shadow: ShadowWeight | undefined
  tokens: Record<string, string>
  onChange: React.Dispatch<React.SetStateAction<ShadowWeight | undefined>>
}) {
  const current = shadow ?? "light"

  // `--shadow-xl` as this weight would write it, for the sample
  const sample = (weight: string) => {
    const lines = weight === "light" ? [] : (shadowDeclarations(weight, tokens) as string[])
    const line = lines.find((l) => l.startsWith("--shadow-xl:"))
    return line ? line.slice("--shadow-xl:".length, -1).trim() : tokens["shadow-xl"]
  }

  return (
    <section className={SECTION}>
      <h2 className={HEADING}>Shadows</h2>
      <Options>
        {(SHADOW_WEIGHTS as string[]).map((weight) => (
          <Option
            key={weight}
            label={weight[0].toUpperCase() + weight.slice(1)}
            selected={current === weight}
            onClick={() => onChange(weight === "light" ? undefined : (weight as ShadowWeight))}
          >
            <span className="flex h-9 w-full items-center justify-center">
              <span className="size-6 rounded bg-card" style={{ boxShadow: sample(weight) }} />
            </span>
          </Option>
        ))}
      </Options>
      <p className={NOTE}>Light is the shadows as the theme defines them. Medium and Dark draw them heavier.</p>
    </section>
  )
}

export function TypographyPanel({
  typography,
  bundled,
  fontTheme,
  onChange,
}: {
  typography: Typography | undefined
  /** Bundled faces ship one weight, so weights can only vary on Google fonts. */
  bundled: boolean
  fontTheme?: string
  onChange: React.Dispatch<React.SetStateAction<Typography | undefined>>
}) {
  // "current" is a choice in the picker but never a stored value: a theme on
  // the current scale stores no scale at all.
  type ScaleChoice = "current" | NonNullable<Typography["scale"]>
  const scale: ScaleChoice = typography?.scale ?? "current"
  const headings = typography?.headings ?? {}

  const set = (patch: { scale?: ScaleChoice; headings?: Typography["headings"] }) =>
    onChange((prev) => {
      const nextScale = patch.scale ?? prev?.scale ?? "current"
      const nextHeadings = patch.headings ?? prev?.headings
      const clean: Typography = {
        ...(nextScale === "current" ? {} : { scale: nextScale }),
        ...(nextHeadings && Object.keys(nextHeadings).length ? { headings: nextHeadings } : {}),
      }
      return Object.keys(clean).length ? clean : undefined
    })

  const setHeading = (level: (typeof LEVELS)[number], patch: { font?: "primary" | "emphasis"; weight?: number }) => {
    const merged = { ...(headings[level] ?? { font: "primary" as const }), ...patch }
    const next = { ...headings }
    // primary at 400 is the default, and a default is stored as nothing
    if (merged.font === "primary" && (!merged.weight || merged.weight === 400)) delete next[level]
    else next[level] = { font: merged.font, ...(merged.weight && merged.weight !== 400 ? { weight: merged.weight as 300 | 500 | 700 } : {}) }
    set({ headings: next })
  }

  return (
    <section className={SECTION}>
      <h2 className={HEADING}>Typography</h2>

      <Options label="Scale">
        {Object.keys(SCALES).map((name) => (
          <Option
            key={name}
            label={name === "current" ? "Current" : name[0].toUpperCase() + name.slice(1)}
            selected={scale === name}
            onClick={() => set({ scale: name as ScaleChoice })}
          >
            <span className="flex h-9 items-end justify-center gap-1 overflow-hidden">
              <span style={{ fontSize: `calc(${SCALES[name][0]} / 4)`, lineHeight: 1 }}>Ag</span>
              <span className={NOTE}>{Math.round(parseFloat(SCALES[name][0]) * 16)}</span>
            </span>
          </Option>
        ))}
      </Options>

      <div className="flex flex-col gap-1.5">
        <span className={LABEL}>Headings</span>
        {LEVELS.map((level) => {
          const heading = headings[level]
          const font = heading?.font ?? "primary"
          return (
            <div key={level} className="flex items-center gap-2 text-sm">
              <span className="w-6 uppercase">{level}</span>
              <div className="flex overflow-hidden rounded-md border border-border">
                {(["primary", "emphasis"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    aria-pressed={font === role}
                    onClick={() => setHeading(level, { font: role })}
                    className={cn(
                      "px-2 py-1 text-xs transition-colors",
                      font === role ? "bg-foreground text-background" : "bg-transparent",
                      role === "primary" ? "font-heading" : "font-serif"
                    )}
                  >
                    {role === "primary" ? "Primary" : "Secondary"}
                  </button>
                ))}
              </div>
              <select
                value={heading?.weight ?? 400}
                disabled={bundled}
                aria-label={`${level} weight`}
                onChange={(e) => setHeading(level, { weight: Number(e.target.value) })}
                className="rounded-md border border-border bg-transparent px-2 py-1 text-xs disabled:opacity-50"
              >
                {(HEADING_WEIGHTS as number[]).map((weight) => (
                  <option key={weight} value={weight}>
                    {weight}
                  </option>
                ))}
              </select>
            </div>
          )
        })}
        {bundled && (
          <p className={NOTE}>
            The {fontTheme} faces ship a single weight, so weights stay at 400. Themes on Google
            fonts load 300, 400, 500 and 700.
          </p>
        )}
      </div>
    </section>
  )
}

export function EffectsPanel({
  effects,
  tokens,
  onChange,
}: {
  effects: Effects | undefined
  /** The theme's own tokens: the gradient can only name colours it has. */
  tokens: Record<string, string>
  onChange: React.Dispatch<React.SetStateAction<Effects | undefined>>
}) {
  const set = (patch: Effects) =>
    onChange((prev) => {
      const next = { ...prev, ...patch }
      const clean: Effects = {
        ...(next.pageTransition ? { pageTransition: next.pageTransition } : {}),
        ...(next.background ? { background: next.background } : {}),
        ...(next.headingGradient ? { headingGradient: next.headingGradient } : {}),
      }
      return Object.keys(clean).length ? clean : undefined
    })

  const gradient = effects?.headingGradient
  const colourTokens = Object.keys(tokens).filter((name) => tokens[name]?.startsWith("oklch"))

  return (
    <section className={SECTION}>
      <h2 className={HEADING}>Effects</h2>

      <div className="flex flex-col gap-1.5">
        <span className={LABEL}>Page transition</span>
        <select
          value={effects?.pageTransition ?? "none"}
          aria-label="Page transition"
          onChange={(e) =>
            set({ pageTransition: e.target.value === "none" ? undefined : (e.target.value as Effects["pageTransition"]) })
          }
          className="rounded-md border border-border bg-transparent px-2 py-1.5 text-sm"
        >
          {["none", "fade", "blinds", "curtain", "iris"].map((id) => (
            <option key={id} value={id}>
              {id === "none" ? "None" : id[0].toUpperCase() + id.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className={LABEL}>Background</span>
        <select
          value={effects?.background ?? "none"}
          aria-label="Background"
          onChange={(e) =>
            set({ background: e.target.value === "none" ? undefined : (e.target.value as Effects["background"]) })
          }
          className="rounded-md border border-border bg-transparent px-2 py-1.5 text-sm"
        >
          {["none", "smoke", "holo", "aurora", "eighties", "ascii"].map((id) => (
            <option key={id} value={id}>
              {id === "none" ? "None" : id[0].toUpperCase() + id.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={Boolean(gradient)}
            onChange={(e) =>
              set({
                ...effects,
                headingGradient: e.target.checked
                  ? { enabled: true, from: "accent-foreground", to: "muted-foreground" }
                  : undefined,
              })
            }
          />
          Animated gradient on H1
        </label>
        {gradient && (
          <div className="flex flex-col gap-1.5">
            {(["from", "to"] as const).map((end) => (
              <label key={end} className="flex items-center gap-2 text-xs capitalize">
                <span className="w-8">{end}</span>
                <select
                  value={gradient[end]}
                  aria-label={`Gradient ${end}`}
                  onChange={(e) => set({ headingGradient: { ...gradient, [end]: e.target.value } })}
                  className="flex-1 rounded-md border border-border bg-transparent px-2 py-1 text-xs"
                >
                  {colourTokens.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </label>
            ))}
            <span
              className="rounded-md px-2 py-1 text-2xl"
              style={{
                backgroundImage: `linear-gradient(90deg, var(--${gradient.from}) 0%, var(--${gradient.to}) 20%, var(--${gradient.from}) 50%, var(--${gradient.to}) 80%, var(--${gradient.from}) 100%)`,
                backgroundSize: "700% 100%",
                backgroundClip: "text",
                color: "transparent",
                animation: "heading-gradient-pan 50s linear infinite",
              }}
            >
              Aa
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
