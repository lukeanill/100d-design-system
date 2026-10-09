import { NAME, NAME_SIZE, OUTLINE, ROW, Sheet, SHEET, SheetLabel, sheetText } from "./tokens-sheet"

/**
 * Laid out like the Colors column of the Figma "New Theme" sheet, on the same
 * frame as Typography (see tokens-sheet.tsx): a label per group, then one ruled
 * row per token with its name on the left and the swatch on the right, in the
 * column the glyph sample uses. A token with a foreground pair also shows an
 * "On" chip, that pair drawn on the token.
 */

/** [token, the token its text is drawn in, when it has one] */
type Row = readonly [token: string, on?: string]

const GROUPS: { label: string; rows: readonly Row[] }[] = [
  {
    label: "Material",
    rows: [
      ["background"],
      ["foreground"],
      ["card", "card-foreground"],
      ["accent", "accent-foreground"],
      ["muted", "muted-foreground"],
      ["border"],
    ],
  },
  {
    label: "Emphasis",
    rows: [
      ["primary", "primary-foreground"],
      ["secondary", "secondary-foreground"],
      ["affirmative", "affirmative-foreground"],
      ["destructive", "primary-foreground"],
    ],
  },
]

const CHARTS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"]

const GRADIENTS = [
  { token: "gradient-downlight", label: "Dawn" },
  { token: "gradient-rise", label: "Rise" },
  { token: "gradient-set", label: "Set" },
]

function Swatch({ token, on }: { token: string; on?: string }) {
  return (
    <div
      title={`--${token}`}
      style={{
        position: "relative",
        width: SHEET.column,
        maxWidth: "50%",
        height: 96,
        background: `var(--${token})`,
        boxShadow: OUTLINE,
      }}
    >
      {on && (
        <span
          style={{
            ...sheetText,
            position: "absolute",
            right: 24,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: `calc(${NAME_SIZE} * 0.625)`,
            fontWeight: 700,
            textTransform: "uppercase",
            color: `var(--${on})`,
          }}
        >
          On
        </span>
      )}
    </div>
  )
}

function Rows({ label, rows }: { label: string; rows: readonly Row[] }) {
  return (
    <section>
      <SheetLabel>{label}</SheetLabel>
      <div style={{ marginTop: 8 }}>
        {rows.map(([token, on]) => (
          <div key={token} style={ROW}>
            <span style={{ ...NAME, textTransform: "capitalize" }}>{token.replace(/-/g, " ")}</span>
            <Swatch token={token} on={on} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default { title: "Tokens/Colors", parameters: { layout: "fullscreen" } }

export const Colors = () => (
  <Sheet gap={SHEET.groups}>
    {GROUPS.map((group) => (
      <Rows key={group.label} {...group} />
    ))}

    <section>
      <div style={{ ...sheetText, padding: "24px 0", borderBottom: SHEET.rule }}>
        <p style={{ ...NAME, margin: 0 }}>Charts</p>
        <div style={{ display: "flex", height: 80, marginTop: SHEET.gap }}>
          {CHARTS.map((token) => (
            <div key={token} title={`--${token}`} style={{ flex: 1, background: `var(--${token})` }} />
          ))}
        </div>
      </div>
    </section>

    <section>
      <SheetLabel>Gradients</SheetLabel>
      <div style={{ marginTop: 8 }}>
        {GRADIENTS.map((g) => (
          <div key={g.token} style={ROW}>
            <span style={NAME}>{g.label}</span>
            <div
              title={`--${g.token}`}
              style={{ width: SHEET.column, maxWidth: "50%", height: 270, backgroundImage: `var(--${g.token})`, boxShadow: OUTLINE }}
            />
          </div>
        ))}
      </div>
    </section>
  </Sheet>
)
