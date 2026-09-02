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

export default { title: "Tokens/Shadows", parameters: { layout: "fullscreen" } }

export const Shadows = () => (
  <div className="min-h-screen w-full bg-card">
   <div className="mx-auto flex max-w-5xl flex-col gap-16 p-10">
    <header className="flex flex-col gap-3 border-b border-muted pb-8">
      <p className="font-sans text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Tokens &middot; Shadows
      </p>
      <h1 className="font-heading text-4xl font-normal text-foreground">Shadows</h1>
    </header>

    <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4">
      {SHADOW_TOKENS.map((s) => (
        <div
          key={s}
          className="flex flex-col items-center gap-4 rounded-xl border border-muted bg-background px-6 py-10"
        >
          <div className="size-20 rounded-xl bg-card" style={{ boxShadow: `var(--${s})` }} />
          <div className="font-mono text-xs text-muted-foreground">--{s}</div>
        </div>
      ))}
    </div>
   </div>
  </div>
)
