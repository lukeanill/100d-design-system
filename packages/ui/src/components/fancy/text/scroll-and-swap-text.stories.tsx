import { useRef } from "react"
import ScrollAndSwapTextImpl from "./scroll-and-swap-text"

export default {
  title: "Animation/Text/Loops/Scroll And Swap Text",
  component: ScrollAndSwapTextImpl,
  args: { children: "Scroll and swap" },
}

export const ScrollAndSwapText = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  return (
    <div ref={containerRef} className="h-32 overflow-y-auto p-8">
      <div className="h-64">
        <ScrollAndSwapTextImpl containerRef={containerRef}>{children}</ScrollAndSwapTextImpl>
      </div>
    </div>
  )
}
