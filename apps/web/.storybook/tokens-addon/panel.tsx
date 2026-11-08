import React, { useState } from "react"
import { useChannel } from "storybook/manager-api"
import { useTheme } from "storybook/theming"
import { REQUEST_EVENT, UPDATE_EVENT, type TokensPayload } from "./events"
import type { TokenUse } from "./scan"

const COLUMNS = "minmax(0,1.1fr) minmax(0,1.6fr) minmax(0,1.2fr) minmax(0,1.4fr)"

function Row({ use, muted, border }: { use: TokenUse; muted: string; border: string }) {
  const colour = use.group === "Colour"
  return (
    <div style={{ display: "grid", gridTemplateColumns: COLUMNS, gap: 12, alignItems: "center", padding: "8px 0", borderTop: `1px solid ${border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        {colour && <span style={{ width: 18, height: 18, borderRadius: 4, flex: "none", background: use.value, border: `1px solid ${border}` }} />}
        <code style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{use.token}</code>
      </div>
      <div style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {use.figma ? (
          <>
            <code>{use.figma.variable}</code> <span style={{ color: muted }}>· {use.figma.mode}</span>
          </>
        ) : (
          <span style={{ color: muted, fontStyle: "italic" }}>no Figma variable</span>
        )}
      </div>
      <div style={{ color: muted, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={use.value}>
        {use.value}
      </div>
      <div style={{ color: muted, minWidth: 0 }} title={use.parts.join(", ")}>
        {use.properties.length ? use.properties.join(", ") : "styling"} · {use.parts.slice(0, 3).join(", ")}
        {use.parts.length > 3 ? ` +${use.parts.length - 3}` : ""}
      </div>
    </div>
  )
}

export function TokensPanel() {
  const theme = useTheme()
  const [data, setData] = useState<TokensPayload | null>(null)
  const emit = useChannel({ [UPDATE_EVENT]: (payload: TokensPayload) => setData(payload) })
  // the panel opens after the story rendered, so ask for the current list
  useState(() => {
    setTimeout(() => emit(REQUEST_EVENT), 0)
  })

  const muted = theme.textMutedColor ?? "#777"
  const border = theme.appBorderColor ?? "rgba(0,0,0,.12)"
  const text = { fontSize: 12, lineHeight: 1.5, color: theme.color.defaultText }

  if (!data) return <div style={{ ...text, padding: 16, color: muted }}>Reading the tokens this component uses…</div>

  const groups = [...new Set(data.uses.map((u) => u.group))]
  const noFigma = data.uses.filter((u) => !u.figma).length
  return (
    <div style={{ ...text, padding: 16, display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ color: muted }}>
        {data.title} · theme <strong style={{ color: theme.color.defaultText }}>{data.themeLabel}</strong> · {data.uses.length} tokens used
        {noFigma ? `, ${noFigma} with no Figma variable` : ""}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: COLUMNS, gap: 12, color: muted, fontWeight: 600 }}>
        <div>Code token</div>
        <div>Figma variable · mode</div>
        <div>Value</div>
        <div>Used for · on</div>
      </div>
      {groups.map((group) => (
        <section key={group} style={{ marginTop: -8 }}>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>{group}</div>
          {data.uses.filter((u) => u.group === group).map((u) => (
            <Row key={u.token} use={u} muted={muted} border={border} />
          ))}
        </section>
      ))}
      <section>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Agreed exceptions</div>
        {data.exceptions.length === 0 ? (
          <div style={{ color: muted }}>None agreed for this component.</div>
        ) : (
          data.exceptions.map((e, i) => (
            <div key={i} style={{ padding: "8px 0", borderTop: `1px solid ${border}` }}>
              <div>
                {e.what}
                {e.token ? <> <code>{e.token}</code></> : null}
                {e.figma ? <span style={{ color: muted }}> (Figma: <code>{e.figma}</code>)</span> : null}
              </div>
              <div style={{ color: muted }}>
                {e.why} · agreed {e.agreedOn}
              </div>
            </div>
          ))
        )}
      </section>

      <div style={{ color: muted }}>
        Read from the styles that apply to what is showing: a hover or focus style appears here while that state is active.
      </div>
    </div>
  )
}
