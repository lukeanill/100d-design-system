// Reads a website and guesses a theme from it, for the studio's "Generate from
// URL" field.
//
// The deployed twin of the /__pull-theme route in theme-studio-plugin.ts. Both
// are thin: check the password, hand the URL to fetchSiteTheme, return what it
// found. Nothing is written — this only ever reads, so unlike api/themes.mjs it
// needs no GitHub token.

import { timingSafeEqual } from "node:crypto"

import { fetchSiteTheme } from "@workspace/ui/scripts/core/site-fetch"

const authorized = (header, password) => {
  if (!header) return false
  const a = Buffer.from(String(header))
  const b = Buffer.from(password)
  return a.length === b.length && timingSafeEqual(a, b)
}

const readBody = async (req) => {
  if (req.body && typeof req.body === "object") return req.body
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  if (!chunks.length) return {}
  return JSON.parse(Buffer.concat(chunks).toString())
}

export default async function handler(req, res) {
  const send = (code, body) => {
    res.statusCode = code
    res.setHeader("content-type", "application/json")
    res.end(JSON.stringify(body))
  }

  const password = process.env.THEME_STUDIO_PASSWORD ?? ""
  if (!password) {
    return send(503, {
      error:
        "THEME_STUDIO_PASSWORD is not set on this deployment. Add it in the Vercel project's environment variables.",
    })
  }
  if (!authorized(req.headers["x-theme-studio-key"], password)) {
    return send(401, { error: "Wrong password." })
  }
  if (req.method !== "POST") return send(405, { error: "Method not allowed." })

  try {
    const { url } = await readBody(req)
    if (!url?.trim()) return send(400, { error: "Enter a web address first." })
    return send(200, await fetchSiteTheme(url))
  } catch (error) {
    // the guard's messages are written to be shown, so they pass straight
    // through rather than being flattened into "something went wrong"
    return send(422, { error: error instanceof Error ? error.message : String(error) })
  }
}
