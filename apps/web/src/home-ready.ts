import { useEffect, useState } from "react"

/* The homepage waits for what the intro needs before it plays: the headline fonts
 * and the glow, texture and tile images. Until then the page is plain black, so
 * the text never cuts in with a stand-in font and the tiles never arrive one by one.
 * A short cap means a slow or failed file can never hold the page back for good. */

const FONTS = [
  "200 36px Migra",
  "800 60px Migra",
  "italic 200 48px Migra",
  "300 16px 'Akkurat LL TT'",
  "700 16px 'Akkurat LL TT'",
]

const IMAGES = [
  "/home/bg-glow.jpg",
  "/home/bg-texture.jpg",
  "/home/tile-blob.png",
  "/home/tile-box.png",
  "/home/tile-star.png",
  "/home/luke.png",
  "/home/claude.svg",
]

const MAX_WAIT_MS = 3000

let started: Promise<void> | null = null

/** Starts every download the intro needs, once. Call it as early as possible. */
export function startHomePreload(): Promise<void> {
  if (started) return started
  const fonts = FONTS.map((f) => document.fonts.load(f).catch(() => undefined))
  const images = IMAGES.map(
    (src) =>
      new Promise<void>((resolve) => {
        const img = new Image()
        img.src = src
        img.decode().then(() => resolve(), () => resolve())
      })
  )
  started = Promise.all([...fonts, ...images]).then(() => undefined)
  return started
}

/** True once the intro's fonts and images are ready (or after the cap). */
export function useHomeReady(): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    const done = () => alive && setReady(true)
    const cap = window.setTimeout(done, MAX_WAIT_MS)
    startHomePreload().then(done)
    return () => {
      alive = false
      window.clearTimeout(cap)
    }
  }, [])
  return ready
}
