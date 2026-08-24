import { useRef } from "react"
import VariableFontAndCursorImpl from "./variable-font-and-cursor"

export default { title: "Animation/Variable Font And Cursor", component: VariableFontAndCursorImpl }

export const VariableFontAndCursor = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={containerRef} className="p-8">
      <VariableFontAndCursorImpl
        containerRef={containerRef}
        fontVariationMapping={{
          x: { name: "wght", min: 400, max: 900 },
          y: { name: "slnt", min: 0, max: -10 },
        }}
      >
        Move your cursor near this text
      </VariableFontAndCursorImpl>
    </div>
  )
}
