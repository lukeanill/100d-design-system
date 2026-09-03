// Builds packages/ui into a publishable dist/ package.
//
// The internal monorepo copy stays named "@workspace/ui" (unchanged, so
// apps/web and every other in-repo consumer keeps working exactly as
// before). This script produces a SEPARATE, self-contained package under
// dist/ named "@lukeanill/ui" for external repos (like the standalone
// LASC) to install from GitHub Packages.
//
// Steps:
//   1. (tsc already ran) compile src/**/*.{ts,tsx} -> dist/**/*.{js,d.ts}
//   2. copy styles (tokens.css + fonts) into dist/styles/
//   3. copy globals.publish.css -> dist/styles/globals.css
//   4. rewrite self-referential "@workspace/ui/..." imports -> "@lukeanill/ui/..."
//      in every emitted .js and .d.ts file
//   5. generate dist/package.json (publish name/version, exports map
//      rewritten to dist-relative paths, dependencies only)

import { readFileSync, writeFileSync, mkdirSync, cpSync, readdirSync, statSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const distDir = join(root, "dist")
const srcPkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"))

const PUBLISH_NAME = "@lukeanill/ui"

function walk(dir, exts, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) walk(full, exts, out)
    else if (exts.some((e) => entry.endsWith(e))) out.push(full)
  }
  return out
}

// 2. copy styles assets (tsc doesn't emit non-ts files)
mkdirSync(join(distDir, "styles"), { recursive: true })
cpSync(join(root, "src/styles/tokens.css"), join(distDir, "styles/tokens.css"))
cpSync(join(root, "src/styles/ai-keyframes.css"), join(distDir, "styles/ai-keyframes.css"))
cpSync(join(root, "src/styles/fonts"), join(distDir, "styles/fonts"), { recursive: true })

// 3. publish variant of globals.css
cpSync(join(root, "src/styles/globals.publish.css"), join(distDir, "styles/globals.css"))

// 4. rewrite self-referential import specifiers
const rewriteTargets = walk(distDir, [".js", ".d.ts"])
let rewriteCount = 0
for (const file of rewriteTargets) {
  const content = readFileSync(file, "utf8")
  const next = content.replaceAll("@workspace/ui/", `${PUBLISH_NAME}/`)
  if (next !== content) {
    writeFileSync(file, next)
    rewriteCount++
  }
}
console.log(`rewrote self-references in ${rewriteCount} files`)

// 5. generate dist/package.json
function toDistExport(sourcePath) {
  // "./src/components/*.tsx" -> { types: "./components/*.d.ts", default: "./components/*.js" }
  const rel = sourcePath.replace(/^\.\/src\//, "./")
  if (rel.endsWith(".css")) return rel
  const withoutExt = rel.replace(/\.(tsx|ts)$/, "")
  return {
    types: `${withoutExt}.d.ts`,
    default: `${withoutExt}.js`,
  }
}

const exportsOut = {}
for (const [key, value] of Object.entries(srcPkg.exports)) {
  exportsOut[key] = toDistExport(value)
}
exportsOut["./package.json"] = "./package.json"

const distPkg = {
  name: PUBLISH_NAME,
  version: srcPkg.version,
  type: "module",
  license: srcPkg.license ?? "UNLICENSED",
  publishConfig: {
    registry: "https://npm.pkg.github.com",
  },
  dependencies: srcPkg.dependencies,
  peerDependencies: {
    react: srcPkg.dependencies.react,
    "react-dom": srcPkg.dependencies["react-dom"],
  },
  exports: exportsOut,
}

writeFileSync(join(distDir, "package.json"), JSON.stringify(distPkg, null, 2) + "\n")
console.log(`wrote dist/package.json as ${PUBLISH_NAME}@${distPkg.version}`)
