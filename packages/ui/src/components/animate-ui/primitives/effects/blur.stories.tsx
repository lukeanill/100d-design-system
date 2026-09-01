import { Blur as BlurImpl } from "./blur"

export default {
  title: "Animation/Transitions/Blur",
  component: BlurImpl,
  argTypes: {
    delay: { control: { type: "range", min: 0, max: 2000, step: 50 } },
    initialBlur: { control: { type: "range", min: 0, max: 40, step: 1 } },
    blur: { control: { type: "range", min: 0, max: 40, step: 1 } },
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
    initialBlur: 10,
    blur: 0,
    inView: false,
    inViewOnce: true,
  },
}

export const BlurEffects = (args: any) => (
  <BlurImpl
    {...args}
    style={{
      padding: "24px 32px",
      borderRadius: 8,
      background: "#18181b",
      color: "#fff",
    }}
  >
    Blur in content
  </BlurImpl>
)
