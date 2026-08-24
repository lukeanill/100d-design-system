import type { ComponentProps } from "react"
import { Accordion as AccordionImpl } from "./accordion"

export default { title: "Animation/Accordion (Base)", component: AccordionImpl }

export const Accordion = (args: ComponentProps<typeof AccordionImpl>) => <AccordionImpl {...args} />
