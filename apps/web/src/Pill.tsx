import type { ReactNode } from "react"
import { MetalSurface } from "@workspace/ui/components/metal-surface"

/** The section pill: a metal ring (v2) round the section's name, set in the body small style. */
export function Pill({ children }: { children: ReactNode }) {
  return (
    <div className="w-fit">
      <MetalSurface variant="button" engine="v2" className="rounded-full bg-transparent! backdrop-blur-none hover:bg-transparent!">
        <div className="flex items-center justify-center rounded-full px-4 py-2">
          <p className="text-body-sm whitespace-nowrap">{children}</p>
        </div>
      </MetalSurface>
    </div>
  )
}
