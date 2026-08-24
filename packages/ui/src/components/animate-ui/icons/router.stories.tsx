import type { ComponentProps } from "react"
import { Router as RouterImpl } from "./router"

export default { title: "Icon/Router", component: RouterImpl }

export const Router = (args: ComponentProps<typeof RouterImpl>) => <RouterImpl {...args} />
