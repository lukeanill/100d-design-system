import { useRef } from "react"
import ScrollAndSwapTextImpl from "./scroll-and-swap-text"

export default { title: "Animation/Scroll And Swap Text", component: ScrollAndSwapTextImpl }

export const ScrollAndSwapText = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={containerRef} className="h-32 overflow-y-auto p-8">
      <div className="h-64">
        <ScrollAndSwapTextImpl containerRef={containerRef}>Scroll and swap</ScrollAndSwapTextImpl>
      </div>
    </div>
  )
}
