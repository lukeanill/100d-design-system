import {
  FlipButton as FlipButtonImpl,
  FlipButtonFront,
  FlipButtonBack,
} from "./flip"

export default {
  title: "Animation/Flip Buttons",
  tags: ["!dev"],
  component: FlipButtonImpl,
  argTypes: {
    from: { control: "select", options: ["top", "bottom", "left", "right"] },
    tapScale: { control: { type: "range", min: 0.5, max: 1, step: 0.05 } },
    asChild: { table: { disable: true } },
    style: { table: { disable: true } },
  },
  args: {
    from: "top",
    tapScale: 0.95,
  },
}

const faceStyle = {
  padding: "8px 16px",
  borderRadius: 6,
  border: "1px solid #d4d4d8",
  color: "#fff",
}

export const FlipButtons = (args: any) => (
  <FlipButtonImpl {...args}>
    <FlipButtonFront style={{ ...faceStyle, background: "#18181b" }}>
      Hover me
    </FlipButtonFront>
    <FlipButtonBack style={{ ...faceStyle, background: "#2563eb" }}>
      Flipped!
    </FlipButtonBack>
  </FlipButtonImpl>
)
