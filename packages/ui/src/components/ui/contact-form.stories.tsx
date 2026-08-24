import type { ComponentProps } from "react"
import { ContactForm as ContactFormImpl } from "./contact-form"

export default { title: "Components/Contact Form", component: ContactFormImpl }

export const ContactForm = (args: ComponentProps<typeof ContactFormImpl>) => <ContactFormImpl {...args} />
