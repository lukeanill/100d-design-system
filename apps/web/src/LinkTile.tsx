import type { ReactNode } from "react"
import { Link } from "react-router"
import { PopoverTrigger } from "@workspace/ui/components/animate-ui/components/base/popover"
import { GlassLayer } from "@workspace/ui/components/liquid-glass"

/* The link tile from the Figma HOME frame, shared by the homepage and the Themer. */

export const MIGRA = "font-[family-name:Migra]"
// Inter Light stands in for the Figma's "Test Söhne"; Söhne sets about 2.5% narrower, so the tracking is pulled in to keep the same line breaks
export const BODY = "font-[family-name:Inter] font-light tracking-[-0.025em]"

// the tiles' rim, softer than the system default: they sit on a dark page, where a white rim reads much stronger
const TILE_EDGE = 0.35

function Arrow() {
  return <img alt="" src="/home/arrow-right.svg" className="size-4 shrink-0 transition-[width,height] duration-300 ease-out group-hover:size-[22px] motion-reduce:transition-none" />
}

/**
 * 320 × 380 tile: a 3D object behind a 36px title and a small link.
 * On hover the object softens (a 30px blur, which the Figma draws as a background
 * blur over it; blurring the image itself gives the same look and renders
 * reliably under the blend mode) under a faint dark wash, the
 * outline drops away, and the link grows from 16px to 20px with its arrow from
 * 16px to 22px (the Figma's hover frame).
 */
export function LinkTile({
  image,
  title,
  label,
  to,
  href,
  onClick,
  imageOpacity = 0.4,
  popoverTrigger,
  showArrow = true,
}: {
  image: string
  title: ReactNode
  /** the link text beside the arrow; leave it out for an arrow alone, on the right */
  label?: string
  /** an in-app route */
  to?: string
  /** a plain link, for another app on the same site */
  href?: string
  /** a plain button, for a tile that changes the page instead of leading elsewhere */
  onClick?: () => void
  /** how bright the tile's artwork is, 0 to 1 */
  imageOpacity?: number
  /** makes the tile the trigger of the surrounding <Popover> */
  popoverTrigger?: boolean
  showArrow?: boolean
}) {
  const className =
    "group relative flex h-[380px] w-full max-w-[320px] flex-col justify-end overflow-clip rounded-[16px] p-8 text-left isolate transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 sm:aspect-[320/380] sm:h-auto sm:min-w-0 sm:flex-1 sm:p-4 md:p-6 lg:p-10 motion-reduce:transition-none"
  const content = (
    <>
      {/* the Glass sheet's Soft weight, in the tile's own 16px corner */}
      <GlassLayer weight="soft" radius={16} edge={TILE_EDGE} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-white/[0.02]">
        <img
          alt=""
          src={image}
          style={{ opacity: imageOpacity }}
          className="absolute inset-0 size-full object-cover mix-blend-screen transition-[filter] duration-300 ease-out group-hover:blur-[30px] motion-reduce:transition-none"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[12px] bg-[rgba(30,30,30,0.08)] opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none"
      />
      <div className="relative flex w-full flex-col items-start justify-end gap-4 transition-[gap] duration-300 ease-out group-hover:gap-6 motion-reduce:transition-none">
        <p className={`${MIGRA} w-full [overflow-wrap:anywhere] text-[30px] leading-[1.14] font-extralight sm:text-[clamp(18px,2.8125vw,36px)]`}>{title}</p>
        {(label || showArrow) && (
          <div className={`flex w-full items-center gap-2 ${label ? "" : "justify-end"}`}>
            {label && (
              <p className={`${BODY} text-[16px] leading-[1.42] min-w-0 transition-[font-size] sm:text-[clamp(12px,1.25vw,16px)] duration-300 ease-out group-hover:text-[20px] motion-reduce:transition-none`}>
                {label}
              </p>
            )}
            {showArrow && <Arrow />}
          </div>
        )}
      </div>
    </>
  )
  if (to)
    return (
      <Link to={to} className={className}>
        {content}
      </Link>
    )
  if (href)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    )
  if (onClick)
    return (
      <button type="button" onClick={onClick} className={`${className} cursor-pointer`}>
        {content}
      </button>
    )
  return (
    <PopoverTrigger className={`${className} cursor-pointer`} data-popover-trigger={popoverTrigger || undefined}>
      {content}
    </PopoverTrigger>
  )
}

