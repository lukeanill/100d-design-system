import { Fade as FadeImpl } from "./fade"

export default {
  title: "Animation/Transitions/Fade",
  component: FadeImpl,
  argTypes: {
    delay: { control: { type: "range", min: 0, max: 2000, step: 50 } },
    initialOpacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
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
    initialOpacity: 0,
    opacity: 1,
    inView: false,
    inViewOnce: true,
  },
}

export const FadeEffects = (args: any) => (
  <FadeImpl
    {...args}
    style={{
      padding: "24px 32px",
      borderRadius: 8,
      background: "#18181b",
      color: "#fff",
    }}
  >
    Fade in content
  </FadeImpl>
)
