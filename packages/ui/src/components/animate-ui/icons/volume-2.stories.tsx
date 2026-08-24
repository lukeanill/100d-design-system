import type { ComponentProps } from "react"
import { Volume2 as Volume2Impl } from "./volume-2"

export default { title: "Icon/Volume 2", component: Volume2Impl }

export const Volume2 = (args: ComponentProps<typeof Volume2Impl>) => <Volume2Impl {...args} />
