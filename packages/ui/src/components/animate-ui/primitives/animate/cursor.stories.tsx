import { Cursor as CursorImpl, CursorProvider, CursorContainer, CursorFollow } from "./cursor"

export default {
  title: "Animation/Interactions/Cursor",
  component: CursorImpl,
  argTypes: {
    style: { table: { disable: true } },
  },
}

export const CursorAnimate = () => (
  <CursorProvider>
    <CursorContainer
      style={{
        position: "relative",
        display: "flex",
        height: 256,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        border: "1px dashed var(--border, #ccc)",
        fontSize: 14,
        color: "var(--muted-foreground, #888)",
      }}
    >
      Move your mouse here
      <CursorImpl>
        <div style={{ width: 20, height: 20, borderRadius: 9999, background: "black" }} />
      </CursorImpl>
      <CursorFollow>
        <div
          style={{
            padding: "4px 8px",
            borderRadius: 6,
            background: "black",
            color: "white",
            fontSize: 12,
            whiteSpace: "nowrap",
          }}
        >
          Following
        </div>
      </CursorFollow>
    </CursorContainer>
  </CursorProvider>
)
