import type { ComponentProps } from "react"
import { createZoomInterpolation as createZoomInterpolationImpl } from "./rain"

export default { title: "Map/Rain", component: createZoomInterpolationImpl }

export const Rain = (args: ComponentProps<typeof createZoomInterpolationImpl>) => <createZoomInterpolationImpl {...args} />
