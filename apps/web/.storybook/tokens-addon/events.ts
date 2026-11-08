import type { TokenException } from "@workspace/ui/themes"
import type { TokenUse } from "./scan"

export const UPDATE_EVENT = "ds-tokens/update"
export const REQUEST_EVENT = "ds-tokens/request"

export interface TokensPayload {
  theme: string
  themeLabel: string
  title: string
  uses: TokenUse[]
  exceptions: TokenException[]
}
