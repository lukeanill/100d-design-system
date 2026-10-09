import { useTheme } from "next-themes"

import { colorThemes } from "@workspace/ui/lib/theme-registry"
import {
  Tooltip,
  TooltipPanel,
  TooltipTrigger,
} from "@workspace/ui/components/animate-ui/components/base/tooltip"
import { cn } from "@workspace/ui/lib/utils"

/**
 * The theme picker as a row of specimens.
 *
 * Each tile wears the theme it selects: its own paper, its own ink, its own
 * heading face. That works because every theme has a class in tokens.css and
 * every font pairing an attribute, so carrying both scopes a whole theme to
 * one 64px box — the swatch is the theme, not a picture of it.
 *
 * The name is a tooltip, so it belongs to the tile you are pointing at rather
 * than standing under the row.
 */
const tiles = [...colorThemes].sort((a, b) => a.order - b.order)

export function ThemeTiles({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const active = theme === "system" ? resolvedTheme : theme

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-4", className)}>
      {tiles.map((t) => (
        <Tooltip key={t.id}>
          <TooltipTrigger
            render={
              <button
                type="button"
                // the theme's own class and font pairing, scoped to this tile
                className={cn(
                  t.id,
                  "size-16 rounded-[12.8px] bg-background text-primary transition-[box-shadow] outline-none",
                  "focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  active === t.id
                    ? // the drawn selection: an ink ring, held off the tile by
                      // a ring of the page's own paper
                      "ring-3 ring-foreground ring-offset-[3px] ring-offset-background"
                    : "hover:ring-2 hover:ring-foreground/30"
                )}
                data-font-theme={t.fontTheme}
                aria-label={`${t.label} theme`}
                aria-pressed={active === t.id}
                onClick={() => setTheme(t.id)}
              >
                {/* the specimen fills about half the tile, as drawn */}
                <span aria-hidden className="font-heading text-4xl leading-none">
                  Aa
                </span>
              </button>
            }
          />
          <TooltipPanel>{t.label}</TooltipPanel>
        </Tooltip>
      ))}
    </div>
  )
}
