// Guards the site-theme extractor against a fixture that mimics a real site:
// a licensed face served by @font-face, a Google family loaded by link, a brand
// colour, and the usual heap of incidental colours.
//
// A fixture rather than a live fetch on purpose — the extractor is pure, the
// network is not, and a test that depends on nike.com's markup is a test that
// breaks when their marketing team ships a redesign.
//
//   node --test packages/ui/scripts/core/

import { strict as assert } from "node:assert"
import test from "node:test"

import {
  assignRoles,
  colorsIn,
  extractSiteTheme,
  familiesIn,
  googleAlternative,
  googleFamiliesIn,
  selfHostedFamiliesIn,
  shapeOf,
} from "./site-theme.mjs"
import { assertPublicUrl } from "./site-fetch.mjs"

const HTML = `<!doctype html><html><head>
  <meta name="theme-color" content="#1a7f4b">
  <meta property="og:image" content="/img/hero.jpg">
  <link rel="icon" href="/favicon.ico">
  <link rel="stylesheet" href="/app.css">
  <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;700&display=swap" rel="stylesheet">
</head><body><h1>Hi</h1></body></html>`

const CSS = `
  @font-face { font-family: "Untitled Sans"; src: url(/f/untitled.woff2) format("woff2"); }
  :root { --brand: #1a7f4b; }
  body { background: #ffffff; color: rgb(17, 17, 17); font-family: "Untitled Sans", Helvetica, sans-serif; }
  h1, h2 { font-family: "Canela", Georgia, serif; }
  .code { font-family: "Work Sans", sans-serif; }
  .cta { background-color: hsl(150, 66%, 30%); }
  .muted { color: #6b7280; }
`

test("colours are normalised to hex from every notation", () => {
  const found = colorsIn(CSS)
  assert.ok(found.includes("#ffffff"), "hex")
  assert.ok(found.includes("#111111"), "rgb() converted")
  assert.ok(found.some((c) => /^#1a/.test(c)), "hsl() converted")
})

test("roles land on the extremes of lightness and the most chromatic", () => {
  const seeds = assignRoles(colorsIn(CSS), { themeColor: "#1a7f4b" })
  assert.equal(seeds.background, "#ffffff", "the lightest is the page")
  assert.equal(seeds.foreground, "#111111", "the darkest is the ink")
  assert.equal(seeds.primary, "#1a7f4b", "theme-color wins the brand slot")
})

test("a Google family loaded by the page is found", () => {
  assert.deepEqual(googleFamiliesIn(HTML, CSS), ["Work Sans"])
})

test("a @font-face family is recognised as self-hosted", () => {
  assert.deepEqual(selfHostedFamiliesIn(CSS), ["Untitled Sans"])
})

test("generic families are never mistaken for a choice", () => {
  const families = familiesIn(CSS)
  for (const generic of ["sans-serif", "serif", "Helvetica", "Georgia"]) {
    // only the first real family of each stack counts, so the fallbacks
    // a site lists after its own face never become the site's font
    assert.ok(!families.includes(generic), `${generic} should not be a choice`)
  }
  assert.ok(families.includes("Untitled Sans"))
  assert.ok(families.includes("Canela"))
})

test("shape is read from the name so an unknown family still gets a sane stand-in", () => {
  assert.equal(shapeOf("Canela"), "sans", "no serif signal in the name")
  assert.equal(shapeOf("Publico Text Serif"), "serif")
  assert.equal(shapeOf("Berkeley Mono"), "mono")
  assert.equal(shapeOf("Helvetica Neue Sans-Serif"), "sans", "sans-serif is not serif")
})

test("a family the site already loads from Google needs no substitute", () => {
  assert.equal(googleAlternative("Work Sans", ["Work Sans"]), null)
  assert.equal(googleAlternative("work sans", ["Work Sans"]), null, "case insensitive")
})

test("a licensed face is swapped for a Google stand-in", () => {
  assert.equal(googleAlternative("Helvetica Now", []), "Inter")
  assert.equal(googleAlternative("Futura", []), "Jost")
  // unknown name, so fall back to matching the shape rather than guessing
  assert.equal(googleAlternative("Canela", []), "Inter")
})

test("the whole extraction reports what it swapped and what it saw", () => {
  const out = extractSiteTheme({ html: HTML, css: CSS, url: "https://example.com/shop" })

  assert.equal(out.seeds.background, "#ffffff")
  assert.equal(out.seeds.primary, "#1a7f4b")

  // every font slot is filled with something that will actually load
  for (const role of ["primary", "emphasis", "body"]) {
    assert.ok(out.fonts[role], `${role} was left empty`)
  }

  assert.ok(out.selfHostedFamilies.includes("Untitled Sans"))
  assert.ok(
    out.substituted.some((s) => s.found === "Untitled Sans"),
    "the licensed face must be reported as substituted, not silently replaced"
  )

  // relative paths resolve against the page, not the studio
  assert.equal(out.preview.ogImage, "https://example.com/img/hero.jpg")
  assert.equal(out.preview.favicon, "https://example.com/favicon.ico")
})

test("an empty or hostile page yields nothing rather than throwing", () => {
  for (const input of [{}, { html: "", css: "" }, { html: "<html></html>", css: "}{;;" }]) {
    const out = extractSiteTheme(input)
    assert.ok(out.seeds, "seeds object always present")
    assert.ok(Array.isArray(out.substituted))
  }
})

/* The URL guard is the part of this feature most worth a test: it takes an
   address a person typed and makes the server fetch it, so a missing check
   would let the studio read things on the network the person cannot reach. */

test("private, loopback and metadata addresses are refused", async () => {
  const blocked = [
    "http://localhost:3000",
    "http://127.0.0.1",
    "https://[::1]/",
    "http://10.1.2.3",
    "http://192.168.1.1",
    "http://172.16.0.5",
    "http://100.64.0.1",
    "http://169.254.169.254/latest/meta-data/", // cloud metadata, the classic target
  ]
  for (const url of blocked) {
    await assert.rejects(() => assertPublicUrl(url), `${url} was allowed through`)
  }
})

test("only http and https are read", async () => {
  for (const url of ["file:///etc/passwd", "ftp://example.com", "javascript:alert(1)"]) {
    await assert.rejects(
      () => assertPublicUrl(url),
      /http and https/,
      `${url} was not rejected on protocol`
    )
  }
})

test("a bare host is treated as https", async () => {
  const url = await assertPublicUrl("example.com")
  assert.equal(url.protocol, "https:")
  assert.equal(url.hostname, "example.com")
})

/* fetchSiteTheme with the network stubbed. This container's egress policy
   allows github.com but not github.githubassets.com, where its CSS lives, so a
   live end-to-end read cannot be done here — a stub covers the orchestration:
   discovering the sheets, fetching them together, and reading fonts that exist
   only in a linked stylesheet. */

import { fetchSiteTheme } from "./site-fetch.mjs"

const serve = (routes) => {
  const seen = []
  globalThis.fetch = async (url) => {
    seen.push(String(url))
    const body = routes[String(url)]
    return body === undefined
      ? { ok: false, status: 404, url: String(url), text: async () => "" }
      : { ok: true, status: 200, url: String(url), text: async () => body }
  }
  return seen
}

test("fonts in a linked stylesheet are found, and sheets fetch together", async (t) => {
  const real = globalThis.fetch
  t.after(() => {
    globalThis.fetch = real
  })

  const page = `<!doctype html><html><head>
    <link rel="stylesheet" href="/a.css">
    <link rel="stylesheet" href="/b.css">
  </head><body></body></html>`

  const seen = serve({
    "https://example.com/": page,
    "https://example.com/a.css":
      ":root{--stack:'Sohne',sans-serif}body{font-family:var(--stack);background:#fdfdfd;color:#141414}",
    "https://example.com/b.css": "h1{font-family:'Tiempos Headline',serif}",
  })

  const out = await fetchSiteTheme("https://example.com")

  assert.equal(out.sheets, 2, "both stylesheets were discovered")
  assert.ok(seen.includes("https://example.com/a.css"), "a.css fetched")
  assert.ok(seen.includes("https://example.com/b.css"), "b.css fetched")

  // the body font is behind a custom property, which is how most sites do it
  assert.ok(
    out.substituted.some((s) => s.found === "Sohne"),
    "a font reached only through var() must still be found"
  )
  assert.ok(out.substituted.some((s) => s.found === "Tiempos Headline"))
  assert.equal(out.seeds.background, "#fdfdfd")
})

test("an unreachable stylesheet does not lose the rest of the read", async (t) => {
  const real = globalThis.fetch
  t.after(() => {
    globalThis.fetch = real
  })

  serve({
    "https://example.com/": `<link rel="stylesheet" href="/gone.css"><link rel="stylesheet" href="/ok.css">`,
    "https://example.com/ok.css": "body{background:#101010;color:#fafafa}",
  })

  const out = await fetchSiteTheme("https://example.com")
  assert.equal(out.seeds.background, "#fafafa", "the reachable sheet still read")
})
