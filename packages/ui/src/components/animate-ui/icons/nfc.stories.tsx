import type { ComponentProps } from "react"
import { Nfc as NfcImpl } from "./nfc"

export default { title: "Icon/Nfc", component: NfcImpl }

export const Nfc = (args: ComponentProps<typeof NfcImpl>) => <NfcImpl {...args} />
