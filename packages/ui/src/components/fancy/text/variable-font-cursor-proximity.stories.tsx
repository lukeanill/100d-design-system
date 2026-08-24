import { useRef } from "react"
import VariableFontCursorProximityImpl from "./variable-font-cursor-proximity"

export default { title: "Animation/Variable Font Cursor Proximity", component: VariableFontCursorProximityImpl }

export const VariableFontCursorProximity = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={containerRef} className="p-8">
      <VariableFontCursorProximityImpl
        containerRef={containerRef}
        fromFontVariationSettings="'wght' 400, 'slnt' 0"
        toFontVariationSettings="'wght' 900, 'slnt' -10"
      >
        Move your cursor near this text
      </VariableFontCursorProximityImpl>
    </div>
  )
}
