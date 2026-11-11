"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "@phosphor-icons/react"

import { IconButton } from "@workspace/ui/components/animate-ui/components/buttons/icon"
import { ThemedIcon } from "@workspace/ui/components/themed-icon"

/** Copies a command to the clipboard; the icon turns to a tick for a moment. */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false)
  return (
    <IconButton
      type="button"
      variant="ghost"
      aria-label={copied ? "Copied" : "Copy command"}
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1500)
        })
      }}
    >
      <ThemedIcon phosphor={copied ? CheckIcon : CopyIcon} />
    </IconButton>
  )
}
