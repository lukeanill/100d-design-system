import { Shine as ShineImpl } from "./shine"

export default {
  title: "Animation/Interactions/Shine",
  component: ShineImpl,
  argTypes: {
    color: { control: "color" },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    delay: { control: { type: "range", min: 0, max: 2000, step: 50 } },
    duration: { control: { type: "range", min: 200, max: 3000, step: 100 } },
    loopDelay: { control: { type: "range", min: 0, max: 2000, step: 100 } },
    deg: { control: { type: "range", min: -90, max: 90, step: 5 } },
    loop: { control: "boolean" },
    enable: { control: "boolean" },
    enableOnHover: { control: "boolean" },
    enableOnTap: { control: "boolean" },
    asChild: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  args: {
    color: "#ffffff",
    opacity: 0.5,
    delay: 0,
    duration: 1200,
    loop: true,
    loopDelay: 800,
    deg: -15,
    enable: true,
    enableOnHover: false,
    enableOnTap: false,
  },
}

export const ShineEffects = (args: any) => (
  <div
    style={{
      display: "inline-block",
      padding: 24,
      borderRadius: 8,
      background: "#18181b",
    }}
  >
    <ShineImpl {...args} style={{ padding: "8px 16px", color: "#fff" }}>
      Shine effect
    </ShineImpl>
  </div>
)
