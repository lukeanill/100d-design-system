const FONT_FAMILIES = [
  { name: "Sans serif", family: "Authentic Sans", token: "font-sans" },
  { name: "Serif", family: "Oranienbaum", token: "font-serif" },
  { name: "Code", family: "Fira Code", token: "font-mono" },
] as const

const TYPE_SCALE = [
  { tag: "h1", label: "Heading 1", size: "80px" },
  { tag: "h2", label: "Heading 2", size: "74px" },
  { tag: "h3", label: "Heading 3", size: "68px" },
  { tag: "h4", label: "Heading 4", size: "62px" },
  { tag: "h5", label: "Heading 5", size: "56px" },
  { tag: "h6", label: "Heading 6", size: "36px" },
] as const

const BODY_STYLES = [
  { sans: "text-body-small", serif: null, label: "Body Small", size: "14px" },
  { sans: "text-body", serif: "text-body-serif", label: "Body", size: "16px / 17px" },
  { sans: "text-body-lg", serif: "text-body-lg-serif", label: "Body Large", size: "20px / 21px" },
] as const

export default { title: "Tokens/Typography", parameters: { layout: "fullscreen" } }

export const Typography = () => (
  <div className="min-h-screen w-full bg-card">
   <div className="mx-auto flex max-w-5xl flex-col gap-16 p-10">
    <header className="flex flex-col gap-3 border-b border-muted pb-8">
      <p className="font-sans text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Tokens &middot; Typography
      </p>
      <h1 className="font-heading text-4xl font-normal text-foreground">Typography</h1>
    </header>

    <section className="flex flex-col gap-6">
      <h2 className="font-heading text-xl font-normal text-foreground">Font families</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {FONT_FAMILIES.map((fam) => (
          <div key={fam.name} className="flex flex-col gap-4 rounded-xl border border-muted bg-card p-6 shadow-xs">
            <div className="text-5xl text-foreground" style={{ fontFamily: `var(--${fam.token})` }}>
              Ag
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">{fam.name}</div>
              <div className="text-xs text-muted-foreground">{fam.family}</div>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="flex flex-col gap-6">
      <h2 className="font-heading text-xl font-normal text-foreground">Type scale</h2>
      <div className="flex flex-col divide-y divide-muted rounded-xl border border-muted bg-card shadow-xs">
        {TYPE_SCALE.map((t) => (
          <div key={t.tag} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-2">
              <div>
                {t.tag === "h1" && <h1 className="truncate">Design, distilled</h1>}
                {t.tag === "h2" && <h2 className="truncate">Design, distilled</h2>}
                {t.tag === "h3" && <h3 className="truncate">Design, distilled</h3>}
                {t.tag === "h4" && <h4 className="truncate">Design, distilled</h4>}
                {t.tag === "h5" && <h5 className="truncate">Design, distilled</h5>}
                {t.tag === "h6" && <h6 className="truncate">Design, distilled</h6>}
              </div>
              <div
                className="truncate text-foreground"
                style={{ fontFamily: "var(--font-serif)", fontSize: t.size, lineHeight: 1.2 }}
              >
                Design, distilled
              </div>
            </div>
            <div className="shrink-0 text-xs text-muted-foreground sm:text-right">
              <div className="font-medium text-foreground">{t.label}</div>
              <div>{t.size}</div>
            </div>
          </div>
        ))}
        {BODY_STYLES.map((b) => (
          <div key={b.label} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-2">
              <p className={`${b.sans} max-w-md truncate`}>The quick brown fox jumps over the lazy dog.</p>
              {b.serif && <p className={`${b.serif} max-w-md truncate`}>The quick brown fox jumps over the lazy dog.</p>}
            </div>
            <div className="shrink-0 text-xs text-muted-foreground sm:text-right">
              <div className="font-medium text-foreground">{b.label}</div>
              <div>{b.size}</div>
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <code className="w-fit rounded-md bg-muted px-3 py-2 font-mono text-sm text-foreground">
            const design = &quot;system&quot;
          </code>
          <div className="shrink-0 text-xs text-muted-foreground sm:text-right">
            <div className="font-medium text-foreground">Mono</div>
            <div>--font-mono</div>
          </div>
        </div>
      </div>
    </section>
   </div>
  </div>
)
