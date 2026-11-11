import * as React from "react"
import { createHighlighterCore, createCssVariablesTheme, type HighlighterCore } from "shiki/core"
import { createJavaScriptRegexEngine } from "shiki/engine/javascript"

/**
 * Syntax highlighting for the code block. The theme is shiki's CSS-variables theme, so every token
 * is painted with a `--shiki-*` custom property and no colour lives in this file. The code block
 * maps those properties onto the design system's tokens (see components/code-block.tsx).
 */
const languages = {
  bash: () => import("shiki/langs/shellscript.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  diff: () => import("shiki/langs/diff.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  json: () => import("shiki/langs/json.mjs"),
  jsx: () => import("shiki/langs/jsx.mjs"),
  markdown: () => import("shiki/langs/markdown.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  sql: () => import("shiki/langs/sql.mjs"),
  tsx: () => import("shiki/langs/tsx.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  yaml: () => import("shiki/langs/yaml.mjs"),
}

const aliases: Record<string, keyof typeof languages> = {
  js: "javascript",
  md: "markdown",
  py: "python",
  sh: "bash",
  shell: "bash",
  shellscript: "bash",
  ts: "typescript",
  yml: "yaml",
  zsh: "bash",
}

const cssVariables = createCssVariablesTheme({ name: "design-system", variablePrefix: "--shiki-", fontStyle: false })

let highlighter: Promise<HighlighterCore> | undefined

function getHighlighter() {
  highlighter ??= createHighlighterCore({
    themes: [cssVariables],
    langs: [],
    engine: createJavaScriptRegexEngine({ forgiving: true }),
  })
  return highlighter
}

function getLanguage(language: string) {
  const name = language.toLowerCase()
  if (name in languages) return name as keyof typeof languages
  return aliases[name] ?? null
}

/** One React node per line, or null for a language that is not listed. */
export async function highlightCode(code: string, language: string): Promise<React.ReactNode[] | null> {
  const lang = getLanguage(language)
  if (!lang) return null
  const shiki = await getHighlighter()
  if (!shiki.getLoadedLanguages().includes(lang)) await shiki.loadLanguage(languages[lang])
  const { tokens } = shiki.codeToTokens(code, { lang, theme: "design-system" })
  return tokens.map((line) =>
    line.map((token, index) =>
      React.createElement("span", { key: index, style: { color: token.color } }, token.content)
    )
  )
}
