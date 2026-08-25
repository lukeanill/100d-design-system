import type { ComponentProps } from "react"
import { Marker as MarkerImpl, MarkerContent } from "./marker"

export default {
  title: "Components/Marker",
  component: MarkerImpl,
  argTypes: {
    variant: { control: "select", options: ["default", "separator", "border"] },
  },
  args: { variant: "default" },
}

export const Marker = (args: ComponentProps<typeof MarkerImpl>) => (
  <MarkerImpl {...args}>
    <MarkerContent>Marker content</MarkerContent>
  </MarkerImpl>
)
