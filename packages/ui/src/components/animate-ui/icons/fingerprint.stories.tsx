import type { ComponentProps } from "react"
import { Fingerprint as FingerprintImpl } from "./fingerprint"

export default { title: "Icon/Fingerprint", component: FingerprintImpl }

export const Fingerprint = (args: ComponentProps<typeof FingerprintImpl>) => <FingerprintImpl {...args} />
