import type { ComponentProps } from "react"
import { DirectionProvider as DirectionProviderImpl } from "./direction"

export default { title: "Components/Direction", component: DirectionProviderImpl }

export const Direction = (args: ComponentProps<typeof DirectionProviderImpl>) => <DirectionProviderImpl {...args} />
