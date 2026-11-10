import { Link } from "react-router"
import { GlassLayer } from "@workspace/ui/components/liquid-glass"
import { Backdrop } from "./Showcase"
import { versionEntries, type VersionEntry } from "./versions-data"

/* The version details page, built to the Figma "versions" frame (Themes file, node 511:5777).
 * Sizes and gaps are the frame's own values; type uses the text styles it names. */

// the tiles' rim, as on the homepage tiles: softer than the system default on a dark page
const TILE_EDGE = 0.35

/** "10 Nov 2026, 13:52", in UTC, the time the package registry records. */
const formatTime = (iso: string) => {
  const d = new Date(iso)
  const part = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...opts }).format(d)
  return `${part({ day: "numeric" })} ${part({ month: "short" })} ${part({ year: "numeric" })}, ${part({ hour: "2-digit", minute: "2-digit", hour12: false })}`
}

/** The releases grouped by major version, newest first. */
const byMajor = (entries: VersionEntry[]) => {
  const groups = new Map<string, VersionEntry[]>()
  for (const entry of entries) {
    const major = entry.version.split(".")[0]
    groups.set(major, [...(groups.get(major) ?? []), entry])
  }
  return [...groups.entries()]
}

/** One card: a major version and every release of it (Figma "glass-tile", node 511:6535). */
function VersionCard({ major, releases }: { major: string; releases: VersionEntry[] }) {
  return (
    <section className="relative isolate flex w-full flex-col gap-4 overflow-clip rounded-[16px] bg-white/[0.02] p-[clamp(20px,3.125vw,40px)]">
      <GlassLayer weight="soft" radius={16} edge={TILE_EDGE} />
      <h2 className="text-h5-sec-bold pb-4">version {major}</h2>
      {releases.map((release) => (
        <div key={release.version} className="flex flex-col gap-4">
          <p className="text-md-bold">{release.version}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <p className="text-md shrink-0 sm:w-[160px]">{formatTime(release.at)}</p>
            {release.notes.length > 0 && (
              <ul className="text-md min-w-0 flex-1 list-disc ps-6">
                {release.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}

export function Versions() {
  return (
    <div className="relative isolate flex min-h-svh flex-col items-center overflow-x-clip bg-black text-[#fbfbfc]">
      <Backdrop />

      <div className="relative z-10 flex w-full flex-col">
        {/* Figma 511:6515: Back, the title, and a hidden Continue that is left out */}
        <header className="flex h-[129px] w-full items-center justify-between p-[clamp(20px,3.125vw,40px)]">
          <Link
            to="/"
            className="text-action-sm flex h-12 w-[120px] shrink-0 items-center justify-center gap-2 rounded-[12px] border border-[#fbfbfc] px-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
          >
            <img alt="" src="/versions/arrow-up-right.svg" className="size-6 shrink-0 -scale-y-100 rotate-180" />
            Back
          </Link>
          <h1 className="text-h5-pri">Versioning</h1>
          <span aria-hidden className="w-[120px] shrink-0" />
        </header>

        <div className="w-full px-[clamp(20px,9.375vw,120px)] pt-[105px] pb-[clamp(48px,6.25vw,80px)]">
          <div className="mx-auto flex w-full max-w-[1040px] flex-col gap-6">
            {byMajor(versionEntries).map(([major, releases]) => (
              <VersionCard key={major} major={major} releases={releases} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
