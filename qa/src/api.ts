import type { Rating } from "../shared/grade.ts"
import type { CategoryRows, TestDetail } from "../server/queries.ts"

export type { CategoryRows, TestDetail }
export type { Rating }

/** The API sits under the app's base path: /qa/api/. */
const API = `${import.meta.env.BASE_URL}api/`

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) throw new Error(((await response.json().catch(() => null)) as { error?: string } | null)?.error ?? response.statusText)
  return (await response.json()) as T
}

export const getComponents = () =>
  request<{ storybookUrl: string; offline: string | null; categories: CategoryRows[] }>(`${API}components`)

export const getEstimate = (paths: string[], mode: "defaults" | "all") =>
  request<{ minutes: number }>(`${API}estimate?mode=${mode}&paths=${encodeURIComponent(paths.join(","))}`)

export const getTest = (id?: string) =>
  request<{ test: TestDetail | null; storybookUrl: string }>(id ? `${API}tests/${id}` : `${API}tests/latest`)

export const rate = (testId: number, component: string, rating: Rating) =>
  request<{ ok: true }>(`${API}tests/${testId}/rating`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ component, rating }),
  })
