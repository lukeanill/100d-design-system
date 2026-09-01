import { Zoom as ZoomImpl } from "./zoom"

export default {
  title: "Animation/Transitions/Zoom",
  component: ZoomImpl,
  argTypes: {
    delay: { control: { type: "range", min: 0, max: 2000, step: 50 } },
    initialScale: { control: { type: "range", min: 0, max: 2, step: 0.05 } },
    scale: { control: { type: "range", min: 0, max: 2, step: 0.05 } },
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
    initialScale: 0.5,
    scale: 1,
    inView: false,
    inViewOnce: true,
  },
}

export const ZoomEffects = (args: any) => (
  <ZoomImpl
    {...args}
    style={{
      padding: "24px 32px",
      borderRadius: 8,
      background: "#18181b",
      color: "#fff",
    }}
  >
    Zoom in content
  </ZoomImpl>
)
