import type { ComponentProps } from "react"
import { Accordion as AccordionImpl } from "./accordion"

export default { title: "Components/Accordion", component: AccordionImpl }

export const Accordion = (args: ComponentProps<typeof AccordionImpl>) => <AccordionImpl {...args} />
