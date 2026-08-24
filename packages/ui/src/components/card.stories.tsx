import type { ComponentProps } from "react"
import { Card as CardImpl } from "./card"

export default { title: "Components/Card", component: CardImpl }

export const Card = (args: ComponentProps<typeof CardImpl>) => <CardImpl {...args} />
