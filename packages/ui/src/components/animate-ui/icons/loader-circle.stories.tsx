import type { ComponentProps } from "react"
import { LoaderCircle as LoaderCircleImpl } from "./loader-circle"

export default { title: "Icon/Loader Circle", component: LoaderCircleImpl }

export const LoaderCircle = (args: ComponentProps<typeof LoaderCircleImpl>) => <LoaderCircleImpl {...args} />
