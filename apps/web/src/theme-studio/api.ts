/**
 * Client for the theme API.
 *
 * Two implementations sit behind this, chosen by where the studio is running:
 *   dev  → /__themes   (apps/web/theme-studio-plugin.ts) writes to your working copy
 *   prod → /api/themes (api/themes.mjs) commits to the repo, which redeploys the site
 *
 * The request and response shapes are identical, so nothing above this file
 * needs to know which one it is talking to.
 */

export type Seeds = {
  background?: string
  foreground?: string
  primary?: string
  secondary?: string
}

export type Fonts = { primary?: string; emphasis?: string; body?: string }

export type Theme = {
  name: string
  label: string
  order: number
  selector: string
  seeds: Seeds
  fonts: Fonts
  edges: string
  fontSource?: "bundled" | "google"
  fontTheme?: string
  overrides: Record<string, string>
  tokens: Record<string, string>
  swatches?: string[]
}

export type ThemesResponse = {
  themes: Theme[]
  /** "local" writes to your working copy; "repo" commits and redeploys the site. */
  target?: "local" | "repo"
  branch?: string
  commit?: string
  deploying?: boolean
  /** Human-readable contrast report. Always a note, never a reason the save failed. */
  contrast?: string | null
  /** How many pairs sit below the rules after this save. */
  belowContrast?: number
}

const ENDPOINT = import.meta.env.DEV ? "/__themes" : "/api/themes"

const KEY = "theme-studio-key"

export const getKey = () => sessionStorage.getItem(KEY) ?? ""
export const setKey = (value: string) => sessionStorage.setItem(KEY, value)
export const clearKey = () => sessionStorage.removeItem(KEY)

async function request<T>(method: string, body?: unknown): Promise<T> {
  const res = await fetch(ENDPOINT, {
    method,
    headers: { "content-type": "application/json", "x-theme-studio-key": getKey() },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`)
  return data as T
}

export const listThemes = () => request<ThemesResponse>("GET")

export const saveTheme = (theme: Partial<Theme> & { name: string }) =>
  request<ThemesResponse>("PUT", theme)

export const deleteTheme = (name: string) => request<ThemesResponse>("DELETE", { name })

export const reorderThemes = (order: string[]) => request<ThemesResponse>("POST", { order })
