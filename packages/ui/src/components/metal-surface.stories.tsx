import { ArrowUp } from "lucide-react"
import { MetalSurface as MetalSurfaceImpl } from "./metal-surface"

// The libraries.dev metal-fx demo button, in each engine.
export default {
  title: "Components/Metal/Metal Surface",
  component: MetalSurfaceImpl,
  argTypes: {
    engine: { control: "inline-radio", options: ["v1", "v2"] },
    variant: { control: "inline-radio", options: ["circle", "button"] },
    preset: { control: "inline-radio", options: ["chromatic", "silver", "gold"] },
    active: { control: "boolean" },
    halo: { control: "boolean" },
    strength: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
  },
  args: { engine: "v1", variant: "circle", preset: "chromatic", active: true, halo: true, strength: 0.9 },
}

type Args = { engine: "v1" | "v2"; variant: "circle" | "button"; preset: "chromatic" | "silver" | "gold"; active: boolean; halo: boolean; strength: number }

export const MetalSurface = (args: Args) => (
  <div className="flex items-center gap-6 p-10">
    <MetalSurfaceImpl {...args}>
      {args.variant === "circle" ? (
        <button type="button" aria-label="Send" className="flex size-10 items-center justify-center rounded-full bg-transparent">
          <ArrowUp className="size-4" />
        </button>
      ) : (
        <button type="button" className="flex h-10 items-center rounded-full bg-transparent px-4 text-sm font-medium">
          Upgrade to Pro
        </button>
      )}
    </MetalSurfaceImpl>
  </div>
)

export const EnginesSideBySide = () => (
  <div className="flex flex-wrap items-center gap-10 p-10">
    {(["v1", "v2"] as const).map((engine) => (
      <div key={engine} className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <MetalSurfaceImpl engine={engine} halo>
            <button type="button" aria-label="Send" className="flex size-10 items-center justify-center rounded-full bg-transparent">
              <ArrowUp className="size-4" />
            </button>
          </MetalSurfaceImpl>
          <MetalSurfaceImpl engine={engine} variant="button" halo>
            <button type="button" className="flex h-10 items-center rounded-full bg-transparent px-4 text-sm font-medium">
              Upgrade to Pro
            </button>
          </MetalSurfaceImpl>
        </div>
        <span className="text-xs text-muted-foreground">metal-fx {engine}</span>
      </div>
    ))}
  </div>
)
