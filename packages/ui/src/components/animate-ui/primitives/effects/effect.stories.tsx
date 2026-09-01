import { Effect as EffectImpl } from "./effect"

export default {
  title: "Animation/Transitions/Effect",
  component: EffectImpl,
  argTypes: {
    delay: { control: { type: "range", min: 0, max: 2000, step: 50 } },
    blur: { control: "boolean" },
    slide: { control: "boolean" },
    fade: { control: "boolean" },
    zoom: { control: "boolean" },
    inView: { control: "boolean" },
    inViewOnce: { control: "boolean" },
    inViewMargin: { table: { disable: true } },
    transition: { table: { disable: true } },
    asChild: { table: { disable: true } },
    style: { table: { disable: true } },
    ref: { table: { disable: true } },
  },
  args: {
    delay: 0,
    fade: true,
    slide: true,
    zoom: false,
    blur: false,
    inView: false,
    inViewOnce: true,
  },
}

export const EffectEffects = (args: any) => (
  <EffectImpl
    {...args}
    style={{
      padding: "24px 32px",
      borderRadius: 8,
      background: "#18181b",
      color: "#fff",
    }}
  >
    Animated content
  </EffectImpl>
)
