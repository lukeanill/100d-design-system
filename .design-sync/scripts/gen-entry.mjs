#!/usr/bin/env node
// Synthesizes a root barrel (dist/index.js + dist/index.d.ts) for
// @lukeanill/ui, whose package.json ships only per-component subpath
// exports (./components/*, ./hooks/*, ./lib/*) and no root ".".
//
// design-sync's package-build.mjs needs a single dist entry: for the JS
// bundle (--entry / cfg.entry) AND, independently, exportedNames()/loadDts()
// default to <PKG_DIR>/index.d.ts when package.json has no "types"/"typings"
// field (confirmed by reading lib/dts.mjs's projectFor). So dist/index.d.ts
// is picked up automatically — no config field needed for that half.
//
// This package layers four component families that reuse names across
// layers (e.g. "Tabs" exists in animate-ui/primitives/base, primitives/animate,
// AND components/base — 83 colliding export names total). A flat
// window.<Global> can only hold one binding per name, so:
//   - components/*.js (direct children)                 -> bare name (canonical DS layer)
//   - components/ui/*.js                                 -> bare name, unless it collides
//                                                            with a claimed name -> "Block" + name
//   - components/animate-ui/components/**/*.js           -> always "AnimateUI" + name
//   - components/animate-ui/primitives/**/*.js            -> always "AnimateUIPrimitive" + name
//   - components/fancy/**/*.js                            -> always "Fancy" + name
//
// Re-run after every `pnpm -F @workspace/ui... build` (cfg.buildCmd should
// chain this script after the package build).

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../../packages/ui/dist/', import.meta.url).pathname.replace(/\/$/, '');
const COMPONENTS = join(DIST, 'components');

function walk(dir, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.js') && !entry.name.endsWith('.d.js')) out.push(full);
  }
}

// Excluded from the bundle entirely — dynamically imports `shiki` (a syntax
// highlighter with megabytes of embedded grammars/themes), which alone pushed
// _ds_bundle.js from ~1.3MB to ~14.5MB, over the 12MB upload cap. Its story
// (Animation/Text/Reveal/Code Block) is excluded via cfg.titleMap.CodeBlock:
// null to match — see .design-sync/NOTES.md.
const EXCLUDE = new Set(['animate-ui/primitives/animate/code-block.js']);

const files = [];
walk(COMPONENTS, files);
files.sort();
for (const ex of EXCLUDE) {
  const i = files.findIndex((f) => f.endsWith('/' + ex) || f.endsWith(ex));
  if (i >= 0) files.splice(i, 1);
}

function familyFor(relPath) {
  // relPath is components-relative, forward-slashed. `root` is the family's
  // own directory prefix, stripped before computing a disambiguation infix
  // from the REMAINING path — so the infix reads "Base"/"Animate", not a
  // redundant restatement of the family root the prefix already encodes.
  if (relPath.startsWith('animate-ui/components/')) return { prefix: 'AnimateUI', always: true, root: 'animate-ui/components/' };
  if (relPath.startsWith('animate-ui/primitives/')) return { prefix: 'AnimateUIPrimitive', always: true, root: 'animate-ui/primitives/' };
  if (relPath.startsWith('fancy/')) return { prefix: 'Fancy', always: true, root: 'fancy/' };
  if (relPath.startsWith('ui/')) return { prefix: 'Block', always: false, root: 'ui/' };
  return { prefix: '', always: false, root: '' }; // top-level components/*.js
}

const claimed = new Map(); // exportName -> relPath (winner)
const fileExports = new Map(); // relPath -> [exportName,...] (real names, as shipped)
const fileFamily = new Map(); // relPath -> family

// Pass 1: extract real export names by reading the compiled ESM's own
// `export { A, B as C };` statement(s) — tsc emits these at file scope, so a
// plain regex is exact without needing to resolve/execute the module graph
// (dynamic import chokes on this repo's CJS deps like lodash under Node's
// native ESM loader).
// Returns [{name, isDefault}] — `name` is always the REAL identifier (even
// for a default export, captured from `export default <Identifier>;`, not
// derived from the filename — tsc-compiled names sometimes reorder words
// relative to the kebab-case filename, e.g. underline-center.js's default
// export is named `CenterUnderline`).
function exportNamesFromSource(src) {
  const byName = new Map(); // name -> isDefault
  // Matches both local re-exports (`export { A, B };`) and pass-through
  // re-exports of a third-party primitive (`export { A } from "pkg";` —
  // e.g. direction.js re-exporting @base-ui/react's DirectionProvider).
  const re = /export\s*\{([^}]*)\}(?:\s*from\s*["'][^"']*["'])?\s*;/g;
  let m;
  while ((m = re.exec(src))) {
    for (let part of m[1].split(',')) {
      part = part.trim();
      if (!part) continue;
      const asMatch = part.match(/^(\S+)\s+as\s+(\S+)$/);
      const name = asMatch ? asMatch[2] : part;
      if (name !== 'default' && /^[A-Z]/.test(name)) byName.set(name, false);
    }
  }
  const re2 = /export\s+(?:const|function|class)\s+([A-Za-z0-9_$]+)/g;
  while ((m = re2.exec(src))) {
    if (/^[A-Z]/.test(m[1])) byName.set(m[1], false);
  }
  // `export default <Identifier>;` — the dominant tsc-emitted form here.
  const re3 = /export\s+default\s+([A-Za-z0-9_$]+)\s*;/g;
  while ((m = re3.exec(src))) {
    if (/^[A-Z]/.test(m[1]) && !byName.has(m[1])) byName.set(m[1], true);
  }
  return [...byName.entries()].map(([name, isDefault]) => ({ name, isDefault }));
}

for (const f of files) {
  const rel = relative(COMPONENTS, f).split('\\').join('/');
  const src = readFileSync(f, 'utf8');
  fileExports.set(rel, exportNamesFromSource(src));
  fileFamily.set(rel, familyFor(rel));
}

// Pass 2: assign global names family by family (top-level first, so it
// always wins the bare slot; ui/* next, checked against top-level; the
// always-prefixed families last, unconditionally prefixed).
const order = [...fileExports.keys()].sort((a, b) => {
  const rank = (r) => (fileFamily.get(r).prefix === '' ? 0 : fileFamily.get(r).prefix === 'Block' ? 1 : 2);
  return rank(a) - rank(b) || a.localeCompare(b);
});

// PascalCase a kebab-case/slash path segment chain, e.g.
// "primitives/animate" -> "PrimitivesAnimate".
const toPascal = (s) => s.split(/[-/]/).filter(Boolean)
  .map((w) => w[0].toUpperCase() + w.slice(1)).join('');

const globalNameFor = new Map(); // relPath -> Map(realName -> globalName)
for (const rel of order) {
  const { prefix, always, root } = fileFamily.get(rel);
  const names = fileExports.get(rel);
  let usePrefix = always;
  if (!always) {
    // ui/* (or top-level, prefix='') — prefix the WHOLE file if any of its
    // names are already claimed by an earlier (higher-priority) file.
    usePrefix = prefix !== '' && names.some((n) => claimed.has(n.name));
  }
  // Disambiguation candidates, tried in order until one is free. Path
  // segments are relative to the family's OWN root (stripped above) so the
  // infix reads "Base"/"Animate", not a redundant restatement of the family
  // root the prefix already encodes:
  //  1. prefix + name
  //  2. prefix + <dir-segments-since-family-root> + name   (same basename,
  //     different directory — e.g. primitives/animate/tabs.js vs
  //     primitives/base/tabs.js)
  //  3. prefix + <dir-segments> + <own-basename> + name     (same directory,
  //     one file re-exporting another's symbol — e.g. toggle-group.js
  //     re-exporting toggle.js's `Toggle`)
  //  4. + numeric suffix (last-resort guarantee)
  const relFromRoot = rel.startsWith(root) ? rel.slice(root.length) : rel;
  const dir = relFromRoot.includes('/') ? relFromRoot.slice(0, relFromRoot.lastIndexOf('/')) : '';
  const base = relFromRoot.slice(relFromRoot.lastIndexOf('/') + 1).replace(/\.js$/, '');
  const dirInfix = toPascal(dir);
  const baseInfix = toPascal(base);
  const map = new Map(); // realName -> {gname, isDefault}
  for (const { name: n, isDefault } of names) {
    const candidates = usePrefix
      ? [`${prefix}${n}`, `${prefix}${dirInfix}${n}`, `${prefix}${dirInfix}${baseInfix}${n}`]
      : [n, `${prefix}${dirInfix}${n}`, `${prefix}${dirInfix}${baseInfix}${n}`];
    let gname = candidates.find((c) => !claimed.has(c));
    if (!gname) {
      let i = 2;
      do { gname = `${candidates[candidates.length - 1]}${i++}`; } while (claimed.has(gname));
    }
    map.set(n, { gname, isDefault });
    claimed.set(gname, rel);
  }
  globalNameFor.set(rel, map);
}

// Pass 3: emit dist/index.js (re-export barrel, real name -> global name)
// and dist/index.d.ts (matching type re-exports from each component's own
// shipped .d.ts, so ts-morph's exportedNames()/loadDts() see the same
// global names as the JS bundle).
const jsLines = [];
const dtsLines = [];
for (const rel of order) {
  const map = globalNameFor.get(rel);
  if (map.size === 0) continue;
  const specJs = './components/' + rel.replace(/\.js$/, '.js');
  const specDts = './components/' + rel.replace(/\.js$/, '');
  const parts = [...map.entries()].map(([realName, { gname, isDefault }]) => {
    const real = isDefault ? 'default' : realName;
    return real === gname ? real : `${real} as ${gname}`;
  });
  jsLines.push(`export { ${parts.join(', ')} } from ${JSON.stringify(specJs)};`);
  dtsLines.push(`export { ${parts.join(', ')} } from ${JSON.stringify(specDts)};`);
}

writeFileSync(join(DIST, 'index.js'), jsLines.join('\n') + '\n');
writeFileSync(join(DIST, 'index.d.ts'), dtsLines.join('\n') + '\n');

// Sidecar: rel (src/components-relative, mirrors dist) -> {realName: globalName}
// — gen-titlemap.mjs cross-references this against sb-reference/index.json to
// derive cfg.titleMap without hand-guessing 96 entries.
const sidecar = {};
for (const rel of order) {
  const map = globalNameFor.get(rel);
  if (map.size === 0) continue;
  sidecar[rel] = Object.fromEntries([...map.entries()].map(([real, { gname }]) => [real, gname]));
}
const sidecarDir = new URL('../.cache/', import.meta.url).pathname;
mkdirSync(sidecarDir, { recursive: true });
writeFileSync(join(sidecarDir, 'gen-entry-map.json'), JSON.stringify(sidecar, null, 2));

console.error(`[GEN_ENTRY] wrote dist/index.js + dist/index.d.ts — ${claimed.size} global names from ${files.length} source files`);
