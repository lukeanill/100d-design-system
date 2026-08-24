import type { ComponentProps } from "react"
import { LoaderPinwheel as LoaderPinwheelImpl } from "./loader-pinwheel"

export default { title: "Icon/Loader Pinwheel", component: LoaderPinwheelImpl }

export const LoaderPinwheel = (args: ComponentProps<typeof LoaderPinwheelImpl>) => <LoaderPinwheelImpl {...args} />
