"use client"

import { useRef } from "react"

import { cn } from "@workspace/ui/lib/utils"
import { useDelayedInView } from "@workspace/ui/hooks/use-delayed-in-view"
import { StreamingText, type StreamingToken } from "@workspace/ui/components/ai/streaming-text"
import { ThemedCard } from "@workspace/ui/components/themed-card"
import { Skeleton } from "@workspace/ui/components/skeleton"

/* An insight about a piece of content: a picture beside a sentence that streams in as the card comes into
 * view, then a follow-up you can ask. A card by the component guidelines wrapped around the streaming
 * text's themed version. */

const CONTENT = "Fish pics are your top trending content thread – averaging 560 likes in 2026."
  .split(" ")
  .map((text) => ({ text }))

export interface ThreadInsightCardProps {
  /** The picture; it is the `edges/xs` corner at 64px square. */
  image: string
  content?: StreamingToken[]
  followUps?: string[]
  /** How long the card is in view before the sentence starts, in ms. */
  startDelay?: number
  onFollowUp?: (text: string) => void
  className?: string
}

export function ThreadInsightCard({ image, content = CONTENT, followUps = ["Do people like me or the fish?"], startDelay = 2000, onFollowUp, className }: ThreadInsightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const started = useDelayedInView(ref, startDelay)

  return (
    <ThemedCard ref={ref} className={cn("w-80", className)}>
      {/* the text starts a moment after the card is seen, so it is read as it streams in */}
      {started ? (
        <StreamingText
          appearance={{ loop: false, themed: true }}
          data={{
            content,
            followUps,
            // a skeleton holds the place until the sentence has finished, then the picture fades in over it
            leading: ({ done }: { done: boolean }) => (
              <div className="relative size-16 shrink-0">
                <Skeleton className="absolute inset-0 rounded-(--edges-xs)" />
                <img
                  src={image}
                  alt=""
                  className={cn(
                    "absolute inset-0 size-full rounded-(--edges-xs) object-cover transition-opacity duration-(--motion-fast) ease-(--motion-transition-ease)",
                    done ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>
            ),
          }}
          actions={{ onFollowUp: (text) => onFollowUp?.(text) }}
        />
      ) : (
        // the card's shape holds its place while it waits, with the picture's skeleton already showing
        <div className="h-[116px]">
          <Skeleton className="size-16 rounded-(--edges-xs)" />
        </div>
      )}
    </ThemedCard>
  )
}
