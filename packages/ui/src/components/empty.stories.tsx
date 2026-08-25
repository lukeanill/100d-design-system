import type { ComponentProps } from "react"
import {
  Empty as EmptyImpl,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "./empty"

export default { title: "Components/Empty", component: EmptyImpl }

export const Empty = (args: ComponentProps<typeof EmptyImpl>) => (
  <EmptyImpl {...args}>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" />
        </svg>
      </EmptyMedia>
      <EmptyTitle>No results</EmptyTitle>
      <EmptyDescription>Nothing to show here yet.</EmptyDescription>
    </EmptyHeader>
  </EmptyImpl>
)
