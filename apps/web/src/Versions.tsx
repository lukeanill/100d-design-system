import { useNavigate } from "react-router"
import { GlassLayer } from "@workspace/ui/components/liquid-glass"
import { Backdrop } from "./Showcase"
import { DragScroll } from "./DragScroll"
import { BackButton, Header } from "./themer/Chrome"
import { versionEntries, type VersionEntry } from "./versions-data"

/* The version details page, built to the Figma "versions" frame (Themes file, node 511:5777).
 * Sizes and gaps are the frame's own values; type uses the text styles it names. */

// the tiles' rim, as on the homepage tiles: softer than the system default on a dark page
const TILE_EDGE = 0.35

/** "10 Nov 2026", in UTC, the day the package registry records. */
const formatDate = (iso: string) => {
  const d = new Date(iso)
  const part = (opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...opts }).format(d)
  return `${part({ day: "numeric" })} ${part({ month: "short" })} ${part({ year: "numeric" })}`
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
    <section className="relative isolate w-full overflow-clip rounded-[16px] bg-white/[0.02] p-[clamp(20px,3.125vw,40px)]">
      <GlassLayer weight="soft" radius={16} edge={TILE_EDGE} />
      {/* the content sits above the glass layer, as in the homepage tiles */}
      <div className="relative flex flex-col gap-4">
      <h2 className="text-h5-sec-bold pb-4">version {major}</h2>
      {releases.map((release) => (
        <div key={release.version} className="flex flex-col gap-4">
          <p className="text-md-bold">{release.version}</p>
          {release.newComponents && (
            <DragScroll label={`New in ${release.version}`}>
              {release.newComponents.map((component) => (
                <figure key={component.name} className="flex shrink-0 flex-col gap-2">
                  <img
                    alt={`${component.name}, new in ${release.version}`}
                    src={component.image}
                    width={component.width}
                    height={component.height}
                    loading="lazy"
                    draggable={false}
                    className="h-[180px] w-auto max-w-none rounded-[12px] border border-white/10 object-contain"
                  />
                  <figcaption className="text-sm opacity-75">{component.name}</figcaption>
                </figure>
              ))}
            </DragScroll>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <p className="text-md shrink-0 sm:w-[120px]">{formatDate(release.at)}</p>
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
      </div>
    </section>
  )
}

export function Versions() {
  const navigate = useNavigate()

  return (
    <div className="relative isolate flex min-h-svh flex-col items-center overflow-x-clip bg-black text-[#fbfbfc]">
      <Backdrop />

      <div className="relative z-10 flex w-full flex-col">
        {/* Figma 511:6515: the Themer's bar (fixed, closes up and blurs once the page scrolls); Back sits 40 from the top with the title centred on it; the hidden Continue is left out */}
        <Header
          alignTop
          nav={<BackButton onClick={() => navigate("/")} />}
          center={
            <div className="flex h-12 items-center">
              <h1 className="text-h5-pri">Versioning</h1>
            </div>
          }
          actions={<span aria-hidden className="w-[120px]" />}
        />

        <div className="w-full px-[clamp(20px,9.375vw,120px)] pt-[177px] pb-[clamp(48px,6.25vw,80px)]">
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
