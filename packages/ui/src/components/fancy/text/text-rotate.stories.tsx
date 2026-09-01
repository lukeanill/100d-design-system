import type { ComponentProps } from "react"
import TextRotateImpl from "./text-rotate"

export default {
  title: "Animation/Text/Loops/Text Rotate",
  component: TextRotateImpl,
  argTypes: {
    splitBy: { control: "select", options: ["words", "characters", "lines"] },
    staggerFrom: { control: "select", options: ["first", "last", "center", "random"] },
    rotationInterval: { control: { type: "range", min: 500, max: 5000, step: 100 } },
    staggerDuration: { control: { type: "range", min: 0, max: 0.2, step: 0.01 } },
    loop: { control: "boolean" },
    auto: { control: "boolean" },
  },
  args: {
    texts: ["Design", "Build", "Ship"],
    rotationInterval: 2000,
    staggerDuration: 0.02,
    staggerFrom: "first",
    splitBy: "characters",
    loop: true,
    auto: true,
  },
}

export const TextRotate = (args: ComponentProps<typeof TextRotateImpl>) => <TextRotateImpl {...args} />
