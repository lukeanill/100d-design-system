import { Slide as SlideImpl } from "./slide"

export default {
  title: "Animation/Transitions/Slide",
  component: SlideImpl,
  argTypes: {
    direction: { control: "select", options: ["up", "down", "left", "right"] },
    offset: { control: { type: "range", min: 0, max: 300, step: 10 } },
    delay: { control: { type: "range", min: 0, max: 2000, step: 50 } },
    inView: { control: "boolean" },
    inViewOnce: { control: "boolean" },
    inViewMargin: { table: { disable: true } },
    transition: { table: { disable: true } },
    asChild: { table: { disable: true } },
    style: { table: { disable: true } },
    ref: { table: { disable: true } },
  },
  args: {
    direction: "up",
    offset: 100,
    delay: 0,
    inView: false,
    inViewOnce: true,
  },
}

export const SlideEffects = (args: any) => (
  <SlideImpl
    {...args}
    style={{
      padding: "24px 32px",
      borderRadius: 8,
      background: "#18181b",
      color: "#fff",
    }}
  >
    Slide in content
  </SlideImpl>
)
