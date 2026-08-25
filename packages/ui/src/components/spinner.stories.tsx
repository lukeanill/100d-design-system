import type { ComponentProps } from "react"
import { Spinner as SpinnerImpl } from "./spinner"

export default { title: "Components/Spinner", component: SpinnerImpl, args: { className: "size-6" } }

export const Spinner = (args: ComponentProps<typeof SpinnerImpl>) => <SpinnerImpl {...args} />
