import { Magnetic as MagneticImpl } from "./magnetic"

export default {
  title: "Animation/Interactions/Magnetic",
  component: MagneticImpl,
  argTypes: {
    strength: { control: { type: "range", min: 0.1, max: 1, step: 0.05 } },
    range: { control: { type: "range", min: 40, max: 300, step: 10 } },
    onlyOnHover: { control: "boolean" },
    disableOnTouch: { control: "boolean" },
    springOptions: { table: { disable: true } },
    asChild: { table: { disable: true } },
    style: { table: { disable: true } },
    ref: { table: { disable: true } },
  },
  args: {
    strength: 0.5,
    range: 120,
    onlyOnHover: false,
    disableOnTouch: true,
  },
}

export const MagneticEffects = (args: any) => (
  <MagneticImpl
    {...args}
    style={{
      padding: "24px 32px",
      borderRadius: 8,
      background: "#18181b",
      color: "#fff",
      cursor: "pointer",
    }}
  >
    Move your cursor near me
  </MagneticImpl>
)
