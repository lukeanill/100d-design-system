import type { ComponentProps } from "react"
import { Disclosure as DisclosureImpl } from "./disclosure"

export default { title: "Animation/Disclosure (Headless)", component: DisclosureImpl }

export const Disclosure = (args: ComponentProps<typeof DisclosureImpl>) => <DisclosureImpl {...args} />
