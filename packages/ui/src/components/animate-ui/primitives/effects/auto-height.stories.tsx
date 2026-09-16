import { useState } from "react"
import { AutoHeight as AutoHeightImpl } from "./auto-height"

export default {
  title: "Animation/Transitions/Auto Height",
  component: AutoHeightImpl,
  argTypes: {
    deps: { table: { disable: true } },
    transition: { table: { disable: true } },
    animate: { table: { disable: true } },
    asChild: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  args: {},
}

const PARAGRAPHS = [
  "Auto Height measures whatever is inside it and animates the container between the old and new height.",
  "Add a paragraph and the box grows into it rather than snapping. Remove one and it collapses the same way.",
  "This is what you want around content that expands: filters, read-more blocks, validation messages, streamed replies.",
]

/* The point of this component is the transition between two heights, so the
 * story has to change its own content — a static box demonstrates nothing. */
export const AutoHeightEffects = (args: any) => {
  const [count, setCount] = useState(1)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 320 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => setCount((c) => Math.min(c + 1, PARAGRAPHS.length))}
          disabled={count === PARAGRAPHS.length}
          style={{
            borderRadius: 9999,
            border: "1px solid var(--foreground, #18181b)",
            padding: "6px 14px",
            fontSize: 13,
            cursor: count === PARAGRAPHS.length ? "not-allowed" : "pointer",
            opacity: count === PARAGRAPHS.length ? 0.4 : 1,
          }}
        >
          Add paragraph
        </button>
        <button
          type="button"
          onClick={() => setCount((c) => Math.max(c - 1, 1))}
          disabled={count === 1}
          style={{
            borderRadius: 9999,
            border: "1px solid var(--foreground, #18181b)",
            padding: "6px 14px",
            fontSize: 13,
            cursor: count === 1 ? "not-allowed" : "pointer",
            opacity: count === 1 ? 0.4 : 1,
          }}
        >
          Remove
        </button>
      </div>

      <AutoHeightImpl
        {...args}
        deps={[count]}
        style={{
          width: 320,
          border: "1px solid var(--border, #d4d4d8)",
          borderRadius: 8,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 16, fontSize: 14, lineHeight: 1.5 }}>
          {PARAGRAPHS.slice(0, count).map((copy) => (
            <p key={copy} style={{ margin: 0 }}>
              {copy}
            </p>
          ))}
        </div>
      </AutoHeightImpl>
    </div>
  )
}
