import type { ComponentProps } from "react"
import { pathClassName as pathClassNameImpl } from "./icon"

export default { title: "Icon/Icon", component: pathClassNameImpl }

export const Icon = (args: ComponentProps<typeof pathClassNameImpl>) => <pathClassNameImpl {...args} />
