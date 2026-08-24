import type { ComponentProps } from "react"
import { Volume1 as Volume1Impl } from "./volume-1"

export default { title: "Icon/Volume 1", component: Volume1Impl }

export const Volume1 = (args: ComponentProps<typeof Volume1Impl>) => <Volume1Impl {...args} />
