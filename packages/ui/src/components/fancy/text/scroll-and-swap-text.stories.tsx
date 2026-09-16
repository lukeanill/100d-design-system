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
    /* The swap is driven by scroll position, so the text has to stay in view
       while the container scrolls — otherwise it just slides off the top. */
    <div
      ref={containerRef}
      className="h-48 overflow-y-auto rounded-lg border border-[var(--border)]"
      style={{ fontFamily: "'Bricolage Grotesque Variable', sans-serif", fontSize: 32 }}
    >
      <div className="h-[36rem]">
        <div className="sticky top-16 flex justify-center">
          <ScrollAndSwapTextImpl containerRef={containerRef}>{children}</ScrollAndSwapTextImpl>
        </div>
      </div>
    </div>
  )
}
