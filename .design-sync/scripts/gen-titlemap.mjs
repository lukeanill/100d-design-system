#!/usr/bin/env node
// Derives cfg.titleMap by cross-referencing the reference storybook's own
// index.json (title -> importPath) against gen-entry.mjs's sidecar
// (dist-components-relative file -> {realName: globalName}). This replaces
// hand-guessing titleMap entries: the title's rightmost space-stripped
// segment is what package-build.mjs's titleParts() tries to resolve, so we
// resolve it the same way, but with ground truth instead of guesswork.
//
// Prints a JSON object of {titleSegment: globalName | null} to stdout —
// merge it into .design-sync/config.json's "titleMap". Also prints
// diagnostics (unresolvable titles) to stderr.

import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(new URL('../../', import.meta.url).pathname);
const SIDECAR = JSON.parse(readFileSync(join(ROOT, '.design-sync/.cache/gen-entry-map.json'), 'utf8'));
const INDEX = JSON.parse(readFileSync(join(ROOT, '.design-sync/sb-reference/index.json'), 'utf8'));

// story-source path (…/src/components/<rest>.stories.tsx) -> dist-relative
// key used by the sidecar (<rest-without-.stories>.js). Handles both flat
// (button.stories.tsx -> button.js) and nested (ui/table.stories.tsx ->
// ui/table.js) — sidecar keys are exactly the dist/components-relative .js
// paths gen-entry.mjs emits.
function distRelFor(importPath) {
  const abs = resolve(dirname(join(ROOT, '.design-sync/sb-reference/index.json')), importPath);
  const marker = '/packages/ui/src/components/';
  const i = abs.replace(/\\/g, '/').indexOf(marker);
  if (i < 0) return null;
  let rest = abs.replace(/\\/g, '/').slice(i + marker.length);
  rest = rest.replace(/\.stories\.[cm]?[jt]sx?$/, '');
  return rest + '.js';
}

const squashSpace = (s) => s.replace(/\s+/g, '');

const entries = INDEX.entries ?? INDEX;
const titleToImportPaths = new Map();
for (const v of Object.values(entries)) {
  if (v.type !== 'story') continue;
  if (!titleToImportPaths.has(v.title)) titleToImportPaths.set(v.title, new Set());
  titleToImportPaths.get(v.title).add(v.importPath);
}

const titleMap = {};
const unresolved = [];
const nonComponent = [];
const alreadyOk = [];

for (const [title, importPaths] of titleToImportPaths) {
  const segs = title.split('/');
  const lastSeg = squashSpace(segs[segs.length - 1]);
  const hasSidecarFile = [...importPaths].some((ip) => { const r = distRelFor(ip); return r && SIDECAR[r]; });
  if (!hasSidecarFile) {
    nonComponent.push({ title, importPaths: [...importPaths] });
    continue;
  }
  let state = 'unknown'; // 'ok' | 'remap' | 'unknown'
  let mapped = null;
  for (const ip of importPaths) {
    const rel = distRelFor(ip);
    if (!rel || !SIDECAR[rel]) continue;
    const exports = SIDECAR[rel];
    if (exports[lastSeg] && exports[lastSeg] === lastSeg) { state = 'ok'; break; }
    if (exports[lastSeg]) { state = 'remap'; mapped = exports[lastSeg]; break; }
    const squash = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const target = squash(lastSeg);
    const hit = Object.entries(exports).find(([real]) => squash(real) === target);
    if (hit) { state = 'remap'; mapped = hit[1]; break; }
  }
  if (state === 'ok') {
    alreadyOk.push(title);
  } else if (state === 'remap') {
    if (!(lastSeg in titleMap) || titleMap[lastSeg] === mapped) titleMap[lastSeg] = mapped;
    else unresolved.push({ title, lastSeg, importPaths: [...importPaths], conflict: `already mapped to ${titleMap[lastSeg]}, this wants ${mapped}` });
  } else {
    unresolved.push({ title, lastSeg, importPaths: [...importPaths] });
  }
}

console.error(`[GEN_TITLEMAP] ${alreadyOk.length} already ok, ${Object.keys(titleMap).length} renames, ${nonComponent.length} non-component titles, ${unresolved.length} unresolved`);
if (nonComponent.length) {
  console.error('non-component (recommend titleMap: null):');
  for (const n of nonComponent) console.error(`  ${n.title}`);
}
if (unresolved.length) {
  console.error('UNRESOLVED (needs a manual look):');
  for (const u of unresolved) console.error(`  ${u.title} (lastSeg=${u.lastSeg}) <- ${u.importPaths.join(', ')}`);
}

console.log(JSON.stringify(titleMap, null, 2));
