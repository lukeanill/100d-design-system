/** Client for the dev-only theme API in apps/web/theme-studio-plugin.ts. */

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

const KEY = "theme-studio-key"

export const getKey = () => sessionStorage.getItem(KEY) ?? ""
export const setKey = (value: string) => sessionStorage.setItem(KEY, value)
export const clearKey = () => sessionStorage.removeItem(KEY)

async function request<T>(method: string, body?: unknown): Promise<T> {
  const res = await fetch("/__themes", {
    method,
    headers: { "content-type": "application/json", "x-theme-studio-key": getKey() },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`)
  return data as T
}

type ThemesResponse = { themes: Theme[]; contrast?: string }

export const listThemes = () => request<ThemesResponse>("GET")
export const saveTheme = (theme: Partial<Theme> & { name: string }) =>
  request<ThemesResponse>("PUT", theme)
export const deleteTheme = (name: string) => request<ThemesResponse>("DELETE", { name })
export const reorderThemes = (order: string[]) => request<ThemesResponse>("POST", { order })
