import { CalendarBlankIcon, CaretDownIcon, HeartIcon as PhHeart, StarIcon as PhStar } from "@phosphor-icons/react"
import { Heart as LuHeart, Star as LuStar } from "lucide-react"
import type { CSSProperties } from "react"
import type { ThemeDraft } from "@workspace/ui/themes"

import { previewStyle } from "./state"

/**
 * The "Coeurdes Alpes" booking card, drawn at the size the Figma draws it.
 * It is a picture of a theme, not a screen: everything in it reads the same
 * custom properties a theme sets, so each choice shows up as it is made.
 * Before anything is chosen it shows the card exactly as designed.
 */

const HEART = "M5.21 1.1525C5.08231 1.02475 4.9307 0.923412 4.76384 0.854271C4.59697 0.78513 4.41812 0.749544 4.2375 0.749544C4.05688 0.749544 3.87803 0.78513 3.71116 0.854271C3.5443 0.923412 3.39269 1.02475 3.265 1.1525L3 1.4175L2.735 1.1525C2.47708 0.894577 2.12726 0.749677 1.7625 0.749677C1.39774 0.749677 1.04792 0.894577 0.79 1.1525C0.532077 1.41042 0.387177 1.76024 0.387177 2.125C0.387177 2.48976 0.532077 2.83958 0.79 3.0975L3 5.3075L5.21 3.0975C5.33775 2.96981 5.43909 2.8182 5.50823 2.65134C5.57737 2.48447 5.61296 2.30562 5.61296 2.125C5.61296 1.94438 5.57737 1.76553 5.50823 1.59866C5.43909 1.4318 5.33775 1.28019 5.21 1.1525Z"
const STAR = "M6.12009 3.00018L4.94465 4.01445L5.30277 5.53128C5.32253 5.61363 5.31744 5.69998 5.28815 5.77943C5.25885 5.85888 5.20667 5.92787 5.13819 5.97768C5.06971 6.02749 4.988 6.05588 4.90339 6.05928C4.81878 6.06267 4.73506 6.04092 4.66281 5.99676L3.34371 5.18492L2.02382 5.99676C1.95158 6.04066 1.86796 6.06221 1.78349 6.05869C1.69903 6.05517 1.61749 6.02674 1.54915 5.97697C1.48082 5.9272 1.42873 5.85833 1.39946 5.77902C1.37018 5.69971 1.36503 5.61352 1.38465 5.53128L1.74407 4.01445L0.568631 3.00018C0.504713 2.94493 0.458486 2.87209 0.435724 2.79073C0.412962 2.70937 0.414673 2.62311 0.440643 2.54272C0.466614 2.46232 0.515693 2.39136 0.581751 2.3387C0.64781 2.28604 0.72792 2.254 0.812077 2.24659L2.35321 2.12226L2.94771 0.683523C2.97989 0.605112 3.03466 0.538042 3.10506 0.490839C3.17545 0.443636 3.2583 0.418433 3.34305 0.418433C3.42781 0.418433 3.51065 0.443636 3.58105 0.490839C3.65144 0.538042 3.70621 0.605112 3.73839 0.683523L4.33264 2.12226L5.87377 2.24659C5.95809 2.25372 6.03844 2.28558 6.10473 2.33817C6.17103 2.39076 6.22034 2.46175 6.24647 2.54224C6.2726 2.62273 6.2744 2.70914 6.25164 2.79065C6.22888 2.87216 6.18257 2.94513 6.11852 3.00044L6.12009 3.00018Z"

type IconKind = "heart" | "star"

function Icon({ kind, draft, size }: { kind: IconKind; draft: ThemeDraft; size: number }) {
  const red = kind === "heart" ? "#ad3232" : "currentColor"
  // nothing chosen: the icons the Figma draws
  if (!draft.iconStyle && !draft.iconWeight) {
    return (
      <svg width={size} height={size} viewBox="0 0 6 6" aria-hidden>
        <path d={kind === "heart" ? HEART : STAR} fill={red} transform={kind === "star" ? "scale(0.897)" : undefined} />
      </svg>
    )
  }
  const weight = draft.iconWeight ?? "fill"
  if (draft.iconStyle === "lucide") {
    const L = kind === "heart" ? LuHeart : LuStar
    return <L size={size} color={red} fill={weight === "fill" || weight === "duotone" ? red : "none"} strokeWidth={weight === "thin" ? 1 : weight === "light" ? 1.5 : weight === "bold" ? 3 : 2} aria-hidden />
  }
  const P = kind === "heart" ? PhHeart : PhStar
  return <P size={size} color={red} weight={weight} aria-hidden />
}

const px = (n: number) => `calc(${n}px * var(--card-space))`

export function AlpesCard({ draft, className }: { draft: ThemeDraft; className?: string }) {
  const style = previewStyle(draft) as CSSProperties
  const glass = style["--card-material" as keyof CSSProperties] === "glass"
  const gradient = style["--card-material" as keyof CSSProperties] === "gradient"
  const radius = (k: number) => `calc(var(--radius) * ${k})`
  const body = { fontFamily: "var(--font-body-token)", fontWeight: "var(--font-body-weight)" } as CSSProperties
  const label = { ...body, fontSize: 5, lineHeight: 1, color: "var(--foreground)" } as CSSProperties

  return (
    <div
      className={className}
      style={{
        ...style,
        width: 480,
        height: 340,
        flex: "none",
        overflow: "clip",
        background: "var(--background)",
        color: "var(--foreground)",
        padding: px(25.6),
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", gap: px(26.748), alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 9.115, width: 191.412, flex: "none" }}>
          {["alpes-1", "alpes-2"].map((name) => (
            <img
              key={name}
              src={`/themer/${name}.jpg`}
              alt=""
              style={{ height: 172.423, width: "100%", objectFit: "cover", borderRadius: radius(0.38), border: "0.38px solid var(--border)" }}
            />
          ))}
        </div>

        <div style={{ width: 210.638, display: "flex", flexDirection: "column", flex: "none" }}>
          <div style={{ display: "flex", justifyContent: "flex-end", height: 15.046, marginBottom: 16.717 }}>
            <span style={{ width: 15, height: "100%", borderRadius: 13.374, background: "#dbdbdb", display: "grid", placeItems: "center" }}>
              <Icon kind="heart" draft={draft} size={6} />
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 1.672, marginBottom: 3.343 }}>
            <Icon kind="star" draft={draft} size={6.687} />
            <span style={{ ...body, fontWeight: 700, fontSize: 6.269, lineHeight: 1, letterSpacing: 0.0627 }}>4.5</span>
          </div>
          <p style={{ fontFamily: "var(--font-primary)", fontWeight: "var(--display-weight)", fontSize: 33.435, lineHeight: 1.2, margin: 0, marginBottom: 3.343, overflowWrap: "anywhere" }}>
            Coeurdes Alpes
          </p>
          <p style={{ ...body, fontSize: 5.851, lineHeight: 1.6, margin: 0, color: "var(--muted-foreground)" }}>
            Aspen Snowmass is a resort that feels unlike anywhere else in the United States. Sitting in the heart of Colorado's Rocky Mountains, the town of Aspen itself carries a certain elegance - historic Victorian buildings line streets where you'll find world-class restaurants alongside local coffee shops, and there's a genuine sense of community beneath the glamour.
          </p>
          <p style={{ fontFamily: "var(--font-primary)", fontWeight: 700, fontSize: 27, lineHeight: 1.1, margin: 0, padding: "6.687px 0 10.03px", color: "var(--primary)" }}>
            $560
          </p>
          <div
            style={{
              background: gradient ? "linear-gradient(180deg, var(--card), var(--background))" : glass ? "color-mix(in oklab, var(--card), transparent 55%)" : "var(--card)",
              backdropFilter: glass ? "blur(12px)" : undefined,
              border: glass ? "0.38px solid var(--border)" : undefined,
              boxShadow: "var(--shadow-md)",
              borderRadius: radius(0.418),
              padding: px(10.03),
              display: "flex",
              flexDirection: "column",
              gap: px(10.03),
            }}
          >
            <div style={{ display: "flex", gap: 10.03, height: 29.255 }}>
              {[
                { name: "Guests", value: "8", icon: <CaretDownIcon size={5} /> },
                { name: "Arrival", value: "23 May 2027", icon: <CalendarBlankIcon size={5} /> },
              ].map((f) => (
                <div key={f.name} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={label}>{f.name}</span>
                  <span style={{ ...label, flex: 1, border: "0.38px solid var(--border)", borderRadius: radius(0.3), padding: "0 4px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--input, var(--card))" }}>
                    {f.value}
                    {f.icon}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[
                { bg: "var(--primary)", fg: "var(--primary-foreground)" },
                { bg: "var(--secondary)", fg: "var(--secondary-foreground)" },
              ].map((b, i) => (
                <span key={i} style={{ ...body, fontWeight: 700, fontSize: 5.5, height: 12, borderRadius: radius(0.3), background: b.bg, color: b.fg, display: "grid", placeItems: "center", boxShadow: "var(--shadow-md)" }}>
                  Reserve your space
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
