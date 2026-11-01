import { getPreset } from "@workspace/ui/themes"
import { cn } from "@workspace/ui/lib/utils"

/** The six themes the design offers. The other presets are not test subjects. */
export const TEST_THEMES = ["illuzion", "bootshaus", "berghain", "pacha", "amnesia", "ushuaia"] as const

/** A theme as its own card: its background, and its name in its heading face and accent. */
export function themeCardStyle(id: string) {
  const preset = getPreset(id)
  if (!preset) return {}
  const { palette, fonts } = preset
  // Berghain's accent is its own background; the Figma sets its name in the foreground instead.
  const color = palette.primaryForeground.toLowerCase() === palette.background.toLowerCase() ? palette.foreground : palette.primaryForeground
  return {
    backgroundColor: palette.background,
    color,
    fontFamily: `"${fonts.display.family}", serif`,
    fontWeight: fonts.display.weight,
  }
}

export function ThemeLabel({ id }: { id: string }) {
  return <>{id === "illuzion" ? "ILLUZION" : (getPreset(id)?.label ?? id)}</>
}

/** One theme only is the subject of a test. */
export function ThemeCards({ value, onChange }: { value: string | null; onChange: (id: string) => void }) {
  return (
    <div role="radiogroup" aria-label="Theme to test" className="flex gap-4">
      {TEST_THEMES.map((id) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={value === id}
          onClick={() => onChange(id)}
          style={themeCardStyle(id)}
          className={cn(
            "flex min-w-px flex-1 items-center justify-center overflow-clip rounded-2xl px-6 py-8 text-center text-[28px] leading-[1.14] whitespace-nowrap",
            value === id && "outline-2 -outline-offset-2 outline-foreground",
          )}
        >
          <ThemeLabel id={id} />
        </button>
      ))}
    </div>
  )
}
