import { BeamInput as BeamInputImpl } from "./beam-input"

type Args = {
  texture?: "Solid" | "Gradient" | "Glass"
  colorMode?: "Dark" | "Light"
  motion: "Rotate" | "Pulse"
  type: "Large" | "Line"
  size?: "md" | "sm" | "line" | "pulse-inner" | "pulse-outside"
  colorVariant: "colorful" | "mono" | "ocean" | "sunset"
  strength: number
  active: boolean
}

export default {
  title: "Components/AI/Beam Input",
  component: BeamInputImpl,
  argTypes: {
    texture: { name: "Texture", control: "select", options: ["Solid", "Gradient", "Glass"], description: "Follows the toolbar theme until one is picked" },
    colorMode: { name: "Color Mode", control: "select", options: ["Dark", "Light"], description: "Follows the toolbar theme until one is picked; a mode the theme is not in borrows the first preset of that mode" },
    motion: { name: "Motion", control: "select", options: ["Rotate", "Pulse"] },
    type: { name: "Type", control: "select", options: ["Large", "Line"] },
    size: { control: "select", options: ["md", "sm", "line", "pulse-inner", "pulse-outside"], description: "When set, wins over Motion and Type" },
    colorVariant: { control: "select", options: ["colorful", "mono", "ocean", "sunset"] },
    strength: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    active: { control: "boolean" },
    placeholder: { table: { disable: true } },
    onSend: { table: { disable: true } },
  },
  args: { motion: "Rotate", type: "Large", colorVariant: "colorful", strength: 0.7, active: true },
}

export const BeamInput = (args: Args) => (
  <div className="flex min-h-[240px] w-full items-center justify-center">
    <BeamInputImpl
      texture={args.texture?.toLowerCase() as "solid" | "gradient" | "glass" | undefined}
      colorMode={args.colorMode?.toLowerCase() as "dark" | "light" | undefined}
      motion={args.motion.toLowerCase() as "rotate" | "pulse"}
      type={args.type.toLowerCase() as "large" | "line"}
      size={args.size}
      colorVariant={args.colorVariant}
      strength={args.strength}
      active={args.active}
    />
  </div>
)
