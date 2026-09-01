import { Particles as ParticlesImpl, ParticlesEffect } from "./particles"

export default {
  title: "Animation/Interactions/Particles",
  component: ParticlesImpl,
  argTypes: {
    animate: { control: "boolean" },
    inView: { control: "boolean" },
    inViewOnce: { control: "boolean" },
    inViewMargin: { table: { disable: true } },
    asChild: { table: { disable: true } },
    style: { table: { disable: true } },
    ref: { table: { disable: true } },
  },
  args: {
    animate: true,
    inView: false,
    inViewOnce: true,
  },
}

export const ParticlesEffects = (args: any) => (
  <ParticlesImpl
    {...args}
    style={{
      display: "inline-flex",
      padding: "24px 40px",
      borderRadius: 8,
      background: "#18181b",
      color: "#fff",
    }}
  >
    Confetti burst
    <ParticlesEffect
      side="top"
      align="center"
      count={8}
      radius={40}
      spread={360}
      duration={0.8}
      style={{
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#f97316",
      }}
    />
  </ParticlesImpl>
)
