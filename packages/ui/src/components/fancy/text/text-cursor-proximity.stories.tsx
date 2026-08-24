import { useRef } from "react"
import TextCursorProximityImpl from "./text-cursor-proximity"

export default { title: "Animation/Text Cursor Proximity", component: TextCursorProximityImpl }

export const TextCursorProximity = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={containerRef} className="p-8">
      <TextCursorProximityImpl
        containerRef={containerRef}
        styles={{ scale: { from: 1, to: 1.5 }, opacity: { from: 0.5, to: 1 } }}
      >
        Move your cursor near this text
      </TextCursorProximityImpl>
    </div>
  )
}
