import type { ComponentProps } from "react"
import {
  ContactForm as ContactFormImpl,
  ContactFormContent,
  ContactFormHeader,
  ContactFormNameFields,
  ContactFormContactFields,
  ContactFormMessageField,
  ContactFormActions,
} from "./contact-form"

export default { title: "Components/Contact Form", component: ContactFormImpl }

export const ContactForm = (args: ComponentProps<typeof ContactFormImpl>) => (
  <ContactFormImpl {...args} className="w-96">
    <ContactFormContent>
      <ContactFormHeader />
      <ContactFormNameFields />
      <ContactFormContactFields />
      <ContactFormMessageField />
      <ContactFormActions />
    </ContactFormContent>
  </ContactFormImpl>
)
