import { Highlight as HighlightImpl } from "./highlight"

export default {
  title: "Animation/Interactions/Highlight",
  component: HighlightImpl,
  argTypes: {
    mode: { control: "select", options: ["children", "parent"] },
    hover: { control: "boolean" },
    click: { control: "boolean" },
    disabled: { control: "boolean" },
    enabled: { control: "boolean" },
    exitDelay: { control: { type: "range", min: 0, max: 1000, step: 50 } },
    as: { table: { disable: true } },
    ref: { table: { disable: true } },
    style: { table: { disable: true } },
    className: { table: { disable: true } },
    transition: { table: { disable: true } },
    value: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    onValueChange: { table: { disable: true } },
    controlledItems: { table: { disable: true } },
    itemsClassName: { table: { disable: true } },
  },
  args: {
    mode: "children",
    hover: true,
    click: true,
    disabled: false,
    enabled: true,
    exitDelay: 200,
    style: { background: "#e4e4e7", borderRadius: 6 },
  },
}

const itemStyle = {
  padding: "8px 16px",
  borderRadius: 6,
  cursor: "pointer",
}

export const HighlightEffects = (args: any) => (
  <HighlightImpl {...args}>
    <div style={itemStyle}>Home</div>
    <div style={itemStyle}>About</div>
    <div style={itemStyle}>Contact</div>
  </HighlightImpl>
)
