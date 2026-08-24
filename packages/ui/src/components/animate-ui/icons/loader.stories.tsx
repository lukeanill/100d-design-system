import type { ComponentProps } from "react"
import { Loader as LoaderImpl } from "./loader"

export default { title: "Icon/Loader", component: LoaderImpl }

export const Loader = (args: ComponentProps<typeof LoaderImpl>) => <LoaderImpl {...args} />
