const TYPE_SCALE = [
  { tag: "h1", label: "Heading 1", size: "80px", weight: 400, leading: "120%", tracking: "0%" },
  { tag: "h2", label: "Heading 2", size: "74px", weight: 400, leading: "120%", tracking: "0%" },
  { tag: "h3", label: "Heading 3", size: "68px", weight: 400, leading: "120%", tracking: "0%" },
  { tag: "h4", label: "Heading 4", size: "62px", weight: 400, leading: "120%", tracking: "0%" },
  { tag: "h5", label: "Heading 5", size: "56px", weight: 400, leading: "120%", tracking: "0%" },
  { tag: "h6", label: "Heading 6", size: "36px", weight: 400, leading: "120%", tracking: "0%" },
] as const

const BODY_STYLES = [
  { className: "text-body-small", label: "Body Small", meta: "14px · Authentic Sans 60 · leading 160%" },
  { className: "text-body", label: "Body", meta: "16px · Authentic Sans 90 · leading 160%" },
  { className: "text-body-serif", label: "Body Serif", meta: "17px · Oranienbaum · leading 160%" },
  { className: "text-body-lg", label: "Body Large", meta: "20px · Authentic Sans 90 · leading 160% · tracking 1%" },
  { className: "text-body-lg-serif", label: "Body Large Serif", meta: "21px · Oranienbaum · leading 160% · tracking -1%" },
] as const

const FONT_TOKENS = [
  { name: "font-heading", sample: "Aa Bb Cc 123" },
  { name: "font-body", sample: "Aa Bb Cc 123" },
  { name: "font-serif", sample: "Aa Bb Cc 123" },
  { name: "font-sans", sample: "Aa Bb Cc 123" },
  { name: "font-mono", sample: "Aa Bb Cc 123" },
] as const

export default { title: "Tokens/Typography" }

export const Typography = () => (
  <div className="mx-auto flex max-w-4xl flex-col gap-12 p-8">
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Font families</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {FONT_TOKENS.map((font) => (
          <div key={font.name} className="rounded-2xl border p-4">
            <div className="mb-2 text-xs text-muted-foreground">--{font.name}</div>
            <div className="text-2xl" style={{ fontFamily: `var(--${font.name})` }}>
              {font.sample}
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Type scale</h2>
      <div className="flex flex-col divide-y divide-border rounded-2xl border">
        {TYPE_SCALE.map((t) => (
          <div key={t.tag} className="flex items-center justify-between gap-6 p-4">
            <div className="min-w-0 flex flex-col gap-1">
              <div>
                {t.tag === "h1" && <h1>The quick brown fox</h1>}
                {t.tag === "h2" && <h2>The quick brown fox</h2>}
                {t.tag === "h3" && <h3>The quick brown fox</h3>}
                {t.tag === "h4" && <h4>The quick brown fox</h4>}
                {t.tag === "h5" && <h5>The quick brown fox</h5>}
                {t.tag === "h6" && <h6>The quick brown fox</h6>}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: t.size,
                  lineHeight: t.leading,
                  letterSpacing: t.tracking,
                }}
              >
                The quick brown fox
              </div>
            </div>
            <div className="shrink-0 text-right text-xs text-muted-foreground">
              <div className="font-medium text-foreground">{t.label}</div>
              <div>{t.size} · weight {t.weight}</div>
              <div>leading {t.leading} · tracking {t.tracking}</div>
              <div className="mt-1 flex justify-end gap-2">
                <span className="rounded bg-muted px-1.5 py-0.5">sans</span>
                <span className="rounded bg-muted px-1.5 py-0.5">serif</span>
              </div>
            </div>
          </div>
        ))}
        {BODY_STYLES.map((b) => (
          <div key={b.className} className="flex items-center justify-between gap-6 p-4">
            <p className={b.className}>The quick brown fox jumps over the lazy dog.</p>
            <div className="shrink-0 text-right text-xs text-muted-foreground">
              <div className="font-medium text-foreground">{b.label}</div>
              <div>{b.meta}</div>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between gap-6 p-4">
          <code className="font-mono text-sm">const design = "system"</code>
          <div className="shrink-0 text-right text-xs text-muted-foreground">
            <div className="font-medium text-foreground">Mono</div>
            <div>font-mono</div>
          </div>
        </div>
      </div>
    </section>
  </div>
)
