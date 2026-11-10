import { useRef, useState, type ReactNode } from "react"

/* A row that scrolls sideways, the way the Map Carousel's card strip does (Components / Content / Map Carousel):
 * drag it with the mouse (1.5 times the pointer's travel), swipe or trackpad-scroll it natively, grab cursor,
 * no scrollbar. */
export function DragScroll({ children, label, className = "" }: { children: ReactNode; label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)
  const start = useRef({ x: 0, scrollLeft: 0 })

  return (
    <div
      ref={ref}
      role="region"
      aria-label={label}
      onMouseDown={(e) => {
        if (!ref.current) return
        setDragging(true)
        start.current = { x: e.pageX - ref.current.offsetLeft, scrollLeft: ref.current.scrollLeft }
      }}
      onMouseMove={(e) => {
        if (!dragging || !ref.current) return
        e.preventDefault()
        const walk = (e.pageX - ref.current.offsetLeft - start.current.x) * 1.5
        ref.current.scrollLeft = start.current.scrollLeft - walk
      }}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      className={`flex gap-4 overflow-x-auto select-none ${dragging ? "cursor-grabbing" : "cursor-grab"} ${className}`}
      style={{ WebkitOverflowScrolling: "touch", msOverflowStyle: "none", scrollbarWidth: "none" }}
    >
      {children}
    </div>
  )
}
