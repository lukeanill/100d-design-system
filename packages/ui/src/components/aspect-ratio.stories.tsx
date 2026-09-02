import type { ComponentProps } from "react"
import { AspectRatio as AspectRatioImpl } from "./aspect-ratio"

export default {
  title: "Components/Layout/Aspect Ratio",
  component: AspectRatioImpl,
  argTypes: {
    ratio: { control: { type: "number", step: 0.01 } },
  },
  args: { ratio: 16 / 9 },
}

export const AspectRatio = (args: ComponentProps<typeof AspectRatioImpl>) => (
  <div className="w-96">
    <AspectRatioImpl {...args}>
      <div className="flex size-full items-center justify-center rounded-lg bg-muted text-muted-foreground">
        16:9
      </div>
    </AspectRatioImpl>
  </div>
)
