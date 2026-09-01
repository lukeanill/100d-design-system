import { Tilt as TiltImpl, TiltContent } from "./tilt"

export default {
  title: "Animation/Interactions/Tilt",
  component: TiltImpl,
  argTypes: {
    maxTilt: { control: { type: "range", min: 0, max: 45, step: 1 } },
    perspective: { control: { type: "range", min: 200, max: 2000, step: 50 } },
    transition: { table: { disable: true } },
    asChild: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  args: {
    maxTilt: 10,
    perspective: 800,
  },
}

export const TiltEffects = (args: any) => (
  <TiltImpl {...args} style={{ display: "inline-block" }}>
    <TiltContent
      style={{
        padding: "24px 40px",
        borderRadius: 12,
        background: "#18181b",
        color: "#fff",
      }}
    >
      Tilt me
    </TiltContent>
  </TiltImpl>
)
