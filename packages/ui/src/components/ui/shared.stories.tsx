import type { ComponentProps } from "react"
import { LazyLeafletMap as LazyLeafletMapImpl } from "./shared"

export default { title: "Components/Shared", component: LazyLeafletMapImpl }

export const Shared = (args: ComponentProps<typeof LazyLeafletMapImpl>) => <LazyLeafletMapImpl {...args} />
