import { Click as ClickImpl } from "./click"

export default {
  title: "Animation/Interactions/Click",
  component: ClickImpl,
  argTypes: {
    variant: {
      control: "select",
      options: ["ripple", "ring", "crosshair", "burst", "particles"],
    },
    color: { control: "color" },
    size: { control: { type: "range", min: 20, max: 300, step: 10 } },
    duration: { control: { type: "range", min: 100, max: 2000, step: 50 } },
    disabled: { control: "boolean" },
    scope: { table: { disable: true } },
  },
  args: {
    variant: "ring",
    color: "#2563eb",
    size: 100,
    duration: 400,
    disabled: false,
  },
}

export const ClickEffects = (args: any) => (
  <ClickImpl {...args}>
    <div
      style={{
        padding: "24px 32px",
        borderRadius: 8,
        border: "1px dashed #a1a1aa",
        color: "#71717a",
        textAlign: "center",
      }}
    >
      Click anywhere on this box
    </div>
  </ClickImpl>
)
