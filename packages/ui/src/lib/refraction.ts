/**
 * Refraction glass, as plain functions: no React, so the component and the
 * document-wide manager (glass-refraction.ts) draw the same thing.
 *
 * An SVG filter used as a backdrop-filter. A canvas-drawn displacement map
 * bends what is behind the element along its bezel (a ray refracted through a
 * convex surface, by Snell's law), and a second map adds a specular rim. The
 * maps are sized to the element, so a filter is built per size.
 *
 * SVG backdrop filters only work in Chromium.
 */

const surface = (x: number) => Math.pow(1 - Math.pow(1 - x, 4), 0.25)

const SAMPLES = 128

function refractionProfile(thickness: number, bezel: number, ior: number) {
  const eta = 1 / ior
  const profile = new Float64Array(SAMPLES)
  for (let i = 0; i < SAMPLES; i++) {
    const x = i / SAMPLES
    const y = surface(x)
    const dx = x < 1 ? 0.0001 : -0.0001
    const deriv = (surface(x + dx) - y) / dx
    const mag = Math.sqrt(deriv * deriv + 1)
    const nx = -deriv / mag
    const ny = -1 / mag
    const k = 1 - eta * eta * (1 - ny * ny)
    if (k < 0) continue
    const sq = Math.sqrt(k)
    const rx = -(eta * ny + sq) * nx
    const ry = eta - (eta * ny + sq) * ny
    profile[i] = rx * ((y * bezel + thickness) / ry)
  }
  return profile
}

/** Distance inside a rounded rect (0 on the edge) and its outward normal. */
function roundedRectField(px: number, py: number, w: number, h: number, r: number) {
  const hx = w / 2
  const hy = h / 2
  const cx = px - hx
  const cy = py - hy
  const qx = Math.abs(cx) - (hx - r)
  const qy = Math.abs(cy) - (hy - r)
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0))
  const sdf = outside + Math.min(Math.max(qx, qy), 0) - r
  let nx: number
  let ny: number
  if (qx > 0 && qy > 0) {
    nx = qx / outside
    ny = qy / outside
  } else if (qx > qy) {
    nx = 1
    ny = 0
  } else {
    nx = 0
    ny = 1
  }
  return { inside: -sdf, nx: nx * Math.sign(cx || 1), ny: ny * Math.sign(cy || 1) }
}

function drawMap(w: number, h: number, fill: (img: Uint8ClampedArray, i: number, x: number, y: number) => void, init?: (d: Uint8ClampedArray) => void) {
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")!
  const img = ctx.createImageData(w, h)
  init?.(img.data)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) fill(img.data, (y * w + x) * 4, x, y)
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL()
}

export type Maps = { displacement: string; specular: string; scale: number }

export function buildMaps(w: number, h: number, radius: number, thickness: number, bezel: number, ior: number, scaleRatio: number): Maps {
  const r = Math.min(radius, w / 2, h / 2)
  const b = Math.max(1, Math.min(bezel, Math.min(w, h) / 2 - 1))
  const profile = refractionProfile(thickness, b, ior)
  const maxDisp = Math.max(...Array.from(profile).map(Math.abs)) || 1

  const displacement = drawMap(
    w,
    h,
    (d, i, x, y) => {
      const f = roundedRectField(x + 0.5, y + 0.5, w, h, r)
      if (f.inside < 0 || f.inside > b) return
      const disp = profile[Math.min(((f.inside / b) * SAMPLES) | 0, SAMPLES - 1)] || 0
      d[i] = (128 + ((-f.nx * disp) / maxDisp) * 127 + 0.5) | 0
      d[i + 1] = (128 + ((-f.ny * disp) / maxDisp) * 127 + 0.5) | 0
    },
    (d) => {
      for (let i = 0; i < d.length; i += 4) {
        d[i] = 128
        d[i + 1] = 128
        d[i + 2] = 0
        d[i + 3] = 255
      }
    }
  )

  const angle = Math.PI / 3
  const sv = [Math.cos(angle), Math.sin(angle)]
  const specular = drawMap(w, h, (d, i, x, y) => {
    const f = roundedRectField(x + 0.5, y + 0.5, w, h, r)
    if (f.inside < 0 || f.inside > b * 2.5) return
    const dot = Math.abs(f.nx * sv[0] + -f.ny * sv[1])
    const edge = Math.sqrt(Math.max(0, 1 - (1 - f.inside) ** 2))
    const coeff = dot * edge
    const col = (255 * coeff) | 0
    d[i] = d[i + 1] = d[i + 2] = col
    d[i + 3] = (col * coeff) | 0
  })

  return { displacement, specular, scale: maxDisp * scaleRatio }
}

export function supportsSvgBackdrop() {
  if (typeof navigator === "undefined") return false
  return /Chrome\/|Chromium\/|Edg\//.test(navigator.userAgent)
}


export type FilterParams = {
  blur: number
  specularOpacity: number
  specularSaturation: number
}

/** The <filter> element for one element size; `w` and `h` are its pixel box. */
export function filterMarkup(id: string, w: number, h: number, maps: Maps, { blur, specularOpacity, specularSaturation }: FilterParams) {
  return `<filter id="${id}" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feGaussianBlur in="SourceGraphic" stdDeviation="${blur}" result="blurred" />
  <feImage href="${maps.displacement}" x="0" y="0" width="${w}" height="${h}" result="disp" />
  <feDisplacementMap in="blurred" in2="disp" scale="${maps.scale}" xChannelSelector="R" yChannelSelector="G" result="displaced" />
  <feColorMatrix in="displaced" type="saturate" values="${specularSaturation}" result="displacedSat" />
  <feImage href="${maps.specular}" x="0" y="0" width="${w}" height="${h}" result="spec" />
  <feComposite in="displacedSat" in2="spec" operator="in" result="specMasked" />
  <feComponentTransfer in="spec" result="specFaded"><feFuncA type="linear" slope="${specularOpacity}" /></feComponentTransfer>
  <feBlend in="specMasked" in2="displaced" mode="normal" result="withSat" />
  <feBlend in="specFaded" in2="withSat" mode="normal" />
</filter>`
}
