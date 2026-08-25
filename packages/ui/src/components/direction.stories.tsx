import type { ComponentProps } from "react"
import { DirectionProvider as DirectionProviderImpl } from "./direction"

export default {
  title: "Components/Direction",
  component: DirectionProviderImpl,
  argTypes: { direction: { control: "select", options: ["ltr", "rtl"] } },
  args: { direction: "rtl" },
}

export const Direction = (args: ComponentProps<typeof DirectionProviderImpl>) => (
  <DirectionProviderImpl {...args}>
    <p className="text-sm">This text direction is controlled by the provider.</p>
  </DirectionProviderImpl>
)
