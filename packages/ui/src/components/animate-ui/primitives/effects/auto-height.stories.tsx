import { AutoHeight as AutoHeightImpl } from "./auto-height"

export default {
  title: "Animation/Transitions/Auto Height",
  component: AutoHeightImpl,
  argTypes: {
    deps: { table: { disable: true } },
    transition: { table: { disable: true } },
    animate: { table: { disable: true } },
    asChild: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  args: {},
}

export const AutoHeightEffects = (args: any) => (
  <AutoHeightImpl
    {...args}
    style={{
      width: 280,
      border: "1px solid #d4d4d8",
      borderRadius: 8,
    }}
  >
    <div style={{ padding: 16 }}>
      This box measures its content and animates height changes
      automatically.
    </div>
  </AutoHeightImpl>
)
