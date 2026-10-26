import { useState, type ComponentProps } from "react"
import { Check, Compass, Info, Layers, MessageCircle, Minus, Play, Plus, Search, Square, Video } from "lucide-react"
import { ControlButton as ControlButtonImpl, ControlGroup, ControlGroupItem } from "./control-button"

export default {
  title: "Special FX Components/Metal/Control Button",
  component: ControlButtonImpl,
  argTypes: {
    shape: { control: "inline-radio", options: ["circle", "pill"] },
    size: { control: "inline-radio", options: ["default", "lg"] },
    engine: { control: "inline-radio", options: ["v1", "v2"] },
    metal: { control: "boolean" },
    halo: { control: "boolean" },
  },
  args: { shape: "circle", size: "default", engine: "v1", metal: false, halo: false },
}

export const ControlButton = (args: ComponentProps<typeof ControlButtonImpl>) => (
  <div className="flex items-center gap-4 p-10">
    <ControlButtonImpl {...args} aria-label="Search">
      {args.shape === "pill" ? (
        <>
          <Video /> Scene
        </>
      ) : (
        <Search />
      )}
    </ControlButtonImpl>
  </div>
)

export const ZoomGroup = () => (
  <div className="p-10">
    <ControlGroup>
      <ControlGroupItem aria-label="Zoom in">
        <Plus />
      </ControlGroupItem>
      <ControlGroupItem aria-label="Zoom out">
        <Minus />
      </ControlGroupItem>
    </ControlGroup>
  </div>
)

// Every control from the SLOPES app, with a Metal and a Halo switch each — and the whole set in
// either metal-fx engine.
const CONTROLS = [
  { id: "search", label: "Search", shape: "circle", children: <Search /> },
  { id: "info", label: "About", shape: "circle", children: <Info /> },
  { id: "theme", label: "Theme", shape: "circle", children: <Layers /> },
  { id: "north", label: "North", shape: "circle", children: <Compass /> },
  { id: "message", label: "Message", shape: "circle", children: <MessageCircle /> },
  { id: "scene", label: "Add first scene", shape: "pill", children: <><Video /> Scene</> },
  { id: "numbers", label: "Scene numbers", shape: "pill", children: <span className="flex gap-5 tabular-nums"><span>1</span><span>2</span><span>3</span></span> },
  { id: "add", label: "Add scene", shape: "circle", children: <Plus /> },
  { id: "play", label: "Play", shape: "circle", children: <Play /> },
  { id: "stop", label: "Stop", shape: "circle", children: <Square /> },
  { id: "done", label: "Done", shape: "circle", children: <Check /> },
] as const

function Toggle({ on, disabled, onClick, children }: { on: boolean; disabled?: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full px-2.5 py-1 text-[11px] transition-colors disabled:opacity-20 ${on ? "bg-foreground/15" : "opacity-50 hover:opacity-80"}`}
    >
      {children}
    </button>
  )
}

export const MetalControls = () => {
  const [engine, setEngine] = useState<"v1" | "v2">("v1")
  const [metal, setMetal] = useState<Set<string>>(() => new Set(["play"]))
  const [halo, setHalo] = useState<Set<string>>(() => new Set())
  const toggle = (set: Set<string>, id: string) => {
    const next = new Set(set)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  }
  return (
    <div className="flex flex-col gap-6 p-10 font-inter">
      <div className="flex items-center gap-2 text-xs">
        Engine
        <Toggle on={engine === "v1"} onClick={() => setEngine("v1")}>v1</Toggle>
        <Toggle on={engine === "v2"} onClick={() => setEngine("v2")}>v2</Toggle>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {CONTROLS.map((c) => (
          <ControlButtonImpl key={`${engine}-${c.id}`} shape={c.shape} engine={engine} metal={metal.has(c.id)} halo={halo.has(c.id)} aria-label={c.label}>
            {c.children}
          </ControlButtonImpl>
        ))}
        <ControlGroup key={`${engine}-zoom`} engine={engine} metal={metal.has("zoom")} halo={halo.has("zoom")}>
          <ControlGroupItem aria-label="Zoom in"><Plus /></ControlGroupItem>
          <ControlGroupItem aria-label="Zoom out"><Minus /></ControlGroupItem>
        </ControlGroup>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-4">
        {[...CONTROLS.map((c) => ({ id: c.id, label: c.label })), { id: "zoom", label: "Zoom" }].map((c) => (
          <div key={c.id} className="flex items-center gap-1">
            <span className="mr-1 text-[11px] opacity-60">{c.label}</span>
            <Toggle on={metal.has(c.id)} onClick={() => setMetal((s) => toggle(s, c.id))}>Metal</Toggle>
            <Toggle on={metal.has(c.id) && halo.has(c.id)} disabled={!metal.has(c.id)} onClick={() => setHalo((s) => toggle(s, c.id))}>Halo</Toggle>
          </div>
        ))}
      </div>
    </div>
  )
}
