#!/usr/bin/env node
// npx @lukeanill/ui install-skill [--global] [--dir <folder>]
//
// Copies the design-system skill that ships inside this package into a project's
// .claude/skills folder, where Claude Code looks for skills. It writes only
// <target>/.claude/skills/design-system and touches nothing else.
//
//   (no flag)      the current folder:   ./.claude/skills/design-system
//   --global       your home folder:     ~/.claude/skills/design-system
//   --dir <path>   another project folder

import { cpSync, existsSync, rmSync, mkdirSync } from "node:fs"
import { homedir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const args = process.argv.slice(2)
const command = args[0]

if (command !== "install-skill") {
  console.log("Usage: npx @lukeanill/ui install-skill [--global] [--dir <folder>]")
  process.exit(command ? 1 : 0)
}

const here = dirname(fileURLToPath(import.meta.url))
const source = join(here, "..", "skills", "design-system")
if (!existsSync(source)) {
  console.error(`Could not find the skill inside the package (looked in ${source}).`)
  process.exit(1)
}

const dirFlag = args.indexOf("--dir")
if (dirFlag !== -1 && !args[dirFlag + 1]) {
  console.error("--dir needs a folder, for example: --dir ../my-app")
  process.exit(1)
}
const base = args.includes("--global") ? homedir() : resolve(dirFlag !== -1 ? args[dirFlag + 1] : process.cwd())
const target = join(base, ".claude", "skills", "design-system")

const updating = existsSync(target)
if (updating) rmSync(target, { recursive: true, force: true })
mkdirSync(dirname(target), { recursive: true })
cpSync(source, target, { recursive: true })

console.log(`${updating ? "Updated" : "Installed"} the design-system skill at ${target}`)
console.log("Claude Code will pick it up in your next session. Run this command again after you update the package.")
