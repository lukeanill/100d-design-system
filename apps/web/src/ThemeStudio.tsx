import { useEffect, useMemo, useState } from "react"

import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Slider } from "@workspace/ui/components/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
// @ts-expect-error - shared .mjs colour engine, also used by the build scripts
import { derivePalette, checkContrast, oklchToHex } from "@workspace/ui/tokens/color"

/* Dev-only theme manager. Seeds in, full palette out: you pick three fonts,
 * three colours and a radius, and every other token is derived so the theme
 * cannot land below the contrast the CI gate enforces. */

type Theme = {
  name: string
  selector: string
  fonts?: { heading?: string; body?: string; serif?: string }
  tokens: Record<string, string>
}

const KEY = "theme-studio-key"
const api = async (method: string, body?: unknown) => {
  const res = await fetch("/__themes", {
    method,
    headers: {
      "content-type": "application/json",
      "x-theme-studio-key": sessionStorage.getItem(KEY) ?? "",
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`)
  return data
}

const googleHref = (families: string[]) =>
  families.filter(Boolean).length
    ? `https://fonts.googleapis.com/css2?${families
        .filter(Boolean)
        .map((f) => `family=${encodeURIComponent(f).replace(/%20/g, "+")}:wght@300;400;500;700`)
        .join("&")}&display=swap`
    : null

function Lock({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    sessionStorage.setItem(KEY, value)
    try {
      await api("GET")
      onUnlock()
    } catch (e) {
      sessionStorage.removeItem(KEY)
      setError(e instanceof Error ? e.message : "Could not unlock.")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <form onSubmit={submit} className="flex w-80 flex-col gap-3">
        <h1 className="text-sm font-medium text-foreground">Theme studio</h1>
        <p className="text-sm text-muted-foreground">
          Enter the password from your <code>.env.local</code>.
        </p>
        <Input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Password"
          aria-label="Theme studio password"
          autoFocus
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit">Unlock</Button>
      </form>
    </div>
  )
}

export function ThemeStudio() {
  const [unlocked, setUnlocked] = useState(false)
  const [themes, setThemes] = useState<Theme[]>([])
  const [status, setStatus] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const [name, setName] = useState("")
  const [base, setBase] = useState("")
  const [heading, setHeading] = useState("Fraunces")
  const [body, setBody] = useState("Inter")
  const [serif, setSerif] = useState("Lora")
  const [background, setBackground] = useState("#fffcfa")
  const [foreground, setForeground] = useState("#4a4a4a")
  const [primary, setPrimary] = useState("#212121")
  const [radius, setRadius] = useState(14)

  useEffect(() => {
    if (!unlocked) return
    api("GET")
      .then((d) => setThemes(d.themes))
      .catch((e) => setStatus(e.message))
  }, [unlocked])

  // load the chosen Google families so the preview uses the real faces
  useEffect(() => {
    const href = googleHref([heading, body, serif])
    if (!href) return
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    document.head.appendChild(link)
    return () => link.remove()
  }, [heading, body, serif])

  const tokens = useMemo(
    () => derivePalette({ background, foreground, primary, radius: `${radius / 16}rem` }),
    [background, foreground, primary, radius]
  )
  const checks = useMemo(() => checkContrast(tokens), [tokens])
  const failures = checks.filter((c: { pass: boolean }) => !c.pass)

  const loadBase = (themeName: string) => {
    const theme = themes.find((t) => t.name === themeName)
    if (!theme) return
    setBase(themeName)
    const hex = (token: string) => {
      const raw = theme.tokens[token]
      const m = raw && /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(raw)
      return m ? oklchToHex({ L: +m[1], C: +m[2], H: +m[3] }) : null
    }
    setBackground(hex("background") ?? background)
    setForeground(hex("foreground") ?? foreground)
    setPrimary(hex("primary") ?? primary)
    if (theme.fonts?.heading) setHeading(theme.fonts.heading)
    if (theme.fonts?.body) setBody(theme.fonts.body)
    if (theme.fonts?.serif) setSerif(theme.fonts.serif)
  }

  const save = async () => {
    setBusy(true)
    setStatus(null)
    try {
      const data = await api("PUT", {
        name,
        fonts: { heading, body, serif },
        tokens,
      })
      setThemes(data.themes)
      setStatus(`Saved ${name}. tokens.css regenerated.`)
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Save failed.")
    } finally {
      setBusy(false)
    }
  }

  if (!unlocked) return <Lock onUnlock={() => setUnlocked(true)} />

  const previewStyle = Object.fromEntries(
    Object.entries(tokens).map(([k, v]) => [`--${k}`, v as string])
  ) as React.CSSProperties

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex items-baseline justify-between">
          <h1 className="text-lg font-medium">Theme studio</h1>
          <span className="text-sm text-muted-foreground">
            {themes.length} themes in packages/ui/tokens
          </span>
        </header>

        <div className="grid gap-6 md:grid-cols-[320px_1fr]">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="theme-name">Theme name</Label>
              <Input
                id="theme-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="midnight-orchard"
              />
              <p className="text-xs text-muted-foreground">
                Saves as tokens/{name ? name : "<name>"}.json and .{name || "<name>"} in CSS.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Start from</Label>
              <Select value={base} onValueChange={(v) => v && loadBase(v)}>
                <SelectTrigger aria-label="Base theme">
                  <SelectValue placeholder="Blank" />
                </SelectTrigger>
                <SelectContent>
                  {themes.map((t) => (
                    <SelectItem key={t.name} value={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 text-sm font-medium">Fonts</legend>
              {[
                ["Heading", heading, setHeading],
                ["Body", body, setBody],
                ["Serif", serif, setSerif],
              ].map(([label, value, set]) => (
                <div key={label as string} className="flex flex-col gap-1.5">
                  <Label htmlFor={`font-${label}`}>{label as string}</Label>
                  <Input
                    id={`font-${label}`}
                    value={value as string}
                    onChange={(e) => (set as (v: string) => void)(e.target.value)}
                    placeholder="Google font name"
                  />
                </div>
              ))}
            </fieldset>

            <fieldset className="flex flex-col gap-3">
              <legend className="mb-1 text-sm font-medium">Colors</legend>
              {[
                ["Background", background, setBackground],
                ["Foreground", foreground, setForeground],
                ["Primary", primary, setPrimary],
              ].map(([label, value, set]) => (
                <div key={label as string} className="flex items-center gap-3">
                  <input
                    type="color"
                    aria-label={label as string}
                    value={value as string}
                    onChange={(e) => (set as (v: string) => void)(e.target.value)}
                    className="size-9 cursor-pointer rounded-lg border border-border bg-card"
                  />
                  <div className="flex flex-1 flex-col gap-1">
                    <Label>{label as string}</Label>
                    <Input
                      value={value as string}
                      onChange={(e) => (set as (v: string) => void)(e.target.value)}
                      aria-label={`${label} hex`}
                    />
                  </div>
                </div>
              ))}
            </fieldset>

            <div className="flex flex-col gap-2">
              <Label>Corner radius: {radius}px</Label>
              <Slider
                aria-label="Corner radius"
                value={[radius]}
                min={0}
                max={28}
                step={1}
                onValueChange={(v) => setRadius(Array.isArray(v) ? (v[0] ?? 0) : v)}
              />
            </div>

            <Button onClick={save} disabled={!name || busy}>
              {busy ? "Saving…" : "Save theme"}
            </Button>
            {status && <p className="text-sm text-muted-foreground">{status}</p>}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {checks.map((c: { label: string; ratio: number; pass: boolean }) => (
                <Badge key={c.label} variant={c.pass ? "secondary" : "destructive"}>
                  {c.label} {c.ratio}:1
                </Badge>
              ))}
            </div>
            {failures.length > 0 && (
              <p className="text-sm text-destructive">
                {failures.length} pair(s) below target — adjust the seeds above.
              </p>
            )}

            <div
              style={{ ...previewStyle, fontFamily: `'${body}', ui-sans-serif, system-ui` }}
              className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6"
            >
              <h2
                className="text-2xl"
                style={{ fontFamily: `'${heading}', ui-sans-serif, system-ui` }}
              >
                The quick brown fox
              </h2>
              <p style={{ fontFamily: `'${serif}', Georgia, serif` }} className="text-base">
                Serif sample — jumps over the lazy dog.
              </p>
              <p className="text-sm text-muted-foreground">
                Muted text, the pair that most often fails.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="destructive">Destructive</Button>
                <Badge>Badge</Badge>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Card surface</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Cards, popovers and inputs all sit on the derived card color.
                </CardContent>
              </Card>
              <Input placeholder="Input on the card surface" aria-label="Preview input" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
