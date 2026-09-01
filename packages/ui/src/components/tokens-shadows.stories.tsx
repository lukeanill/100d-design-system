const SHADOW_TOKENS = [
  "shadow-2xs",
  "shadow-xs",
  "shadow-sm",
  "shadow",
  "shadow-md",
  "shadow-lg",
  "shadow-xl",
  "shadow-2xl",
] as const

export default { title: "Tokens/Shadows" }

export const Shadows = () => (
  <div className="mx-auto flex max-w-4xl flex-col gap-4 p-8">
    <h2 className="text-lg font-semibold">Shadows</h2>
    <div className="grid gap-6 sm:grid-cols-4">
      {SHADOW_TOKENS.map((s) => (
        <div key={s} className="flex flex-col items-center gap-2">
          <div className="size-16 rounded-xl bg-card" style={{ boxShadow: `var(--${s})` }} />
          <div className="text-xs text-muted-foreground">--{s}</div>
        </div>
      ))}
    </div>
  </div>
)
