import { useEffect, useRef, useState } from "react"

/* The Slopes card's phone (Figma "Examples/Lock Screen", node 422:4249): a 204 × 443.5 iPhone whose screen plays
 * the Slopes recordings one after another while the card is hovered. The bezel sits over the screen, the Dynamic
 * Island pill blurs the recording's own status bar, and the card clips whatever runs past its bottom edge. At rest
 * the screen shows slopes2 at 0:02; hovering fades it out to the clips. */

const CLIPS = ["slopes1", "slopes2", "slopes3"] as const

export function SlopesPhone({ playing }: { playing: boolean }) {
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const [index, setIndex] = useState(0)

  // the active clip plays while the card is hovered and waits on its first frame otherwise
  useEffect(() => {
    const clip = videos.current[index]
    if (!clip) return
    if (playing) void clip.play().catch(() => {})
    else clip.pause()
  }, [playing, index])

  // leaving the card starts the sequence again from the top, as the card's single video did
  useEffect(() => {
    if (playing) return
    for (const clip of videos.current) if (clip) clip.currentTime = 0
    setIndex(0)
  }, [playing])

  const next = () => {
    const to = (index + 1) % CLIPS.length
    const clip = videos.current[to]
    if (clip) clip.currentTime = 0
    setIndex(to)
  }

  return (
    <div className="absolute top-[48px] left-1/2 h-[443.522px] w-[204px] -translate-x-1/2">
      <div className="absolute inset-0 overflow-clip rounded-[16.239px] bg-black">
        {CLIPS.map((name, i) => (
          <video
            key={name}
            ref={(el) => {
              videos.current[i] = el
            }}
            poster={`/home/slopes/${name}-poster.jpg`}
            muted
            playsInline
            preload="metadata"
            onEnded={next}
            className="absolute inset-0 size-full object-cover transition-opacity duration-300 motion-reduce:transition-none"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <source src={`/home/slopes/${name}.webm`} type="video/webm" />
            <source src={`/home/slopes/${name}.mp4`} type="video/mp4" />
          </video>
        ))}
        <img
          alt=""
          src="/home/slopes/slopes-rest.jpg"
          className="pointer-events-none absolute inset-0 size-full object-cover transition-opacity duration-300 motion-reduce:transition-none"
          style={{ opacity: playing ? 0 : 1 }}
        />
      </div>
      <img
        alt=""
        src="/home/slopes-phone.png"
        className="pointer-events-none absolute top-[-11.433px] left-[-12.179px] h-[466.866px] w-[228.358px] max-w-none"
      />
      <div aria-hidden className="absolute top-[4px] left-[7px] h-[25px] w-[189px] rounded-full bg-(--alpha-dark-xs) backdrop-blur-[4px]" />
    </div>
  )
}
