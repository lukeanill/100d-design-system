---
name: design-system
description: The reference and rulebook for Luke's themeable AI design system (@workspace/ui, published as @lukeanill/ui; live at ds.lukeai.space with Storybook). Use it for ANY question about, or work with, this design system - the nine themes and their settings, design tokens (colour, type, radius, shadow, glass, motion), components and their props, animations and page transitions, breakpoints, the tech stack, design guidance and theming rules - and whenever a UI is about to be built, themed or reviewed in this repo, or a new component is about to be imported or added. Use it whenever someone starts a new build on the package (it asks twelve kickoff questions: theme, accessibility, devices, storage, hosting, performance, sign-in and data, scope, risks, how to prove it works, what to copy, plan first). Also use it for ANY mobile web browser work (iOS Safari, Chrome on Android, responsive or touch UI), because it carries the mandatory mobile web guidelines. Use it BEFORE the first call to any Figma tool (get_design_context, get_screenshot, get_metadata, get_variable_defs) and whenever the user shares a figma.com link or asks to build, check or compare against a Figma design. Make sure to use it before writing any UI here, even if the user only says "add a button", "which theme has glass", "what's the primary token", "link me the Storybook for X", or "bring in this shadcn component", and even if they never say "design system".
---

# Design system

> **Figma gate (read this first).** If the task involves a Figma design or a figma.com link, do not call any Figma tool until you have read `references/figma.md` in full. Screenshots and layer lists are not enough: the guide requires dev mode design context, `get_variable_defs`, annotations and comments, a numbered list of non-token values, and your questions and assumptions before you build. When you start, say you have read it and which of its steps you are doing.

This skill answers questions about the design system and keeps new work inside it. Everything lives in `references/`; read only the file the question needs. Most of it is generated from source (themes, tokens, components, animations), so it is exact as of the last run and can be refreshed.

Repo: `packages/ui` (the system), `apps/web` (site + Storybook), `qa` (QA app). Live: https://ds.lukeai.space, Storybook https://ds.lukeai.space/storybook/ (locally :6006).

## Which file answers what

| The user wants... | Read | Notes |
|---|---|---|
| The themes, their settings, palettes, fonts, UX direction | `references/themes.md` | Nine themes, fixed order, Berghain default. Never reorder. |
| What `--X` is in theme Y | `references/themes-resolved.md` | Every CSS custom property per theme. Long: search it, do not read it whole. |
| Design tokens: meaning, value, where applied | `references/tokens.md` | Colour, alpha, type, radius/shadow, motion, glass, `text-*` classes. |
| A component: props, where used, Storybook link | `references/components.md` (index) → `references/components/<group>.md` (detail) | Groups follow the Storybook sidebar. |
| An animation, transition or text effect | `references/animations.md` (index) → `references/animations/<group>.md` | Motion tokens are in `tokens.md`; the theme's motion choice in `themes.md`. |
| Direction, rules, what to do and not do | `references/guidance.md` | Working rules, component theming rules (numbered), theme direction, open questions, known gaps. |
| Breakpoints | `references/breakpoints.md` | The standard widths plus the fixed widths in code. |
| Tech stack, commands, hosting, publishing | `references/tech.md` | |
| Which sites are built with it | `references/sites.md` | Split into verified vs claimed. |
| Adding or importing a component | `references/import.md` | Follow it step by step; it starts by asking the user. |
| Building or checking anything from a Figma design | `references/figma.md` | Dev mode, annotations, flag non-token values, ask and state assumptions first. |
| Starting a new build on the package | `references/kickoff.md` | Ask these questions before writing code. |
| Anything that runs in a mobile web browser | `references/mobile-web-guidelines.md` | Mandatory, see "Mobile web work" below. |

## Numbering

Number every point you make to the user, so they can answer by number ("go with 2, change 4"). This covers questions, options, assumptions, flagged non-token values, risks, findings, deviations and next steps. Number questions 1, 2, 3 continuing across rounds (the kickoff questions already have fixed numbers: keep them), and use 1.1, 1.2 for sub-points. Numbers stay the same for the whole conversation: if you revisit point 4, call it 4, and number new points after the last one used. Keep tables, but add a number column.

## How to answer

1. **Find the entry first, then quote it.** For a component, open the group file and give the props table, the import path, the Storybook link, and where it is used. For a theme, give the setting values from `themes.md`. Do not answer from memory of other design systems: the tokens, text styles and theme settings here are the system's own.
2. **Give links as full URLs.** Storybook story links in the references are `https://ds.lukeai.space/storybook/?path=/story/<id>`. When showing the user a story locally, open the full UI (`/?path=/story/...`), never a bare `iframe.html`.
2a. **"Tell me about / show me / list the tokens" means list every token.** Give the full list from `references/tokens.md`, grouped by section, each token with its meaning and where it is applied (example components). Tokens that share a meaning may share a row, but every token name must appear. Do not give a summary of the groups, and do not ask which group first: the user asked for all of them. Offer a deeper dive (per-theme values) after the list, not instead of it.
3. **Say when something is missing.** "No story yet" and "not used in apps/web" are real answers. If a fact is not in the references and not in the source, say it is unknown rather than guessing. Known gaps are in `guidance.md` §5.
4. **If the references may be stale** (the user changed components, tokens or themes this session, or `git log` shows newer commits than the files), refresh them first:
   ```bash
   node .claude/skills/design-system/scripts/generate.mjs
   ```
   It rewrites `themes.md`, `themes-resolved.md`, `tokens.md`, `components*`, `animations*` from `packages/ui/src` and the `*.stories.tsx` files. It touches nothing else. `guidance.md`, `breakpoints.md`, `tech.md`, `sites.md` and `import.md` are written by hand: update them when the source they summarise changes.
5. **Check the source for anything load-bearing.** Props and token values come from code, but a reference is a snapshot. Before relying on one for an edit, open the file it points at.

## When building or changing UI in this repo

Follow `references/guidance.md` §1. In short, in this order: use `@workspace/ui` first; copy the closest existing pattern (the Themer, homepage tiles, Storybook stories); never fake what the system provides (no hand-made gradients, blurs, shadows, radii, colours); read Figma in dev mode and measure against it; and end by telling the user what was reused and what is new, what you tested and did not, and asking them to QA with URLs and what to check.

## Building from Figma

Whenever a Figma design is the source, read `references/figma.md` first, before the first Figma tool call (see the gate at the top). In short: read it in dev mode (specs, annotations, comments), flag every colour, font, radius, shadow or spacing that is not a design system token or variable, and ask your questions and state your assumptions before you build. Figma stays read-only unless the user explicitly tells you to write, and then only what they say, confirmed first (see `figma.md`).

## Starting a new build on the package

When someone starts building a new app, site or feature with the design system (the `@lukeanill/ui` package, or `@workspace/ui` here), do not start coding. Read `references/kickoff.md` and first invite the user to share the project context and any designs, and wait for their reply before recommending anything. Then ask the twelve questions in it (three rounds of four), in plain English with examples and a recommendation based on what they shared: theme, accessibility, devices and breakpoints, what gets saved, framework and hosting, performance, sign-in and personal data, scope and who tests on which devices, then how to work together (risks and failure cases, how we will know it works, what to copy or leave alone, plan first or not). The file also lists how Claude behaves while building (one issue at a time, rewind after two failed corrections, keep context clean, grow `CLAUDE.md` from mistakes). Look and feel and tone come with the theme, so do not ask about them. Skip anything the user has already answered, and write the answers down for later sessions. Small edits to something already built do not need this.

## Mobile web work

For any work that runs in a mobile web browser (a responsive page, a component or story meant for phones, mobile layout, touch, forms, viewport, iOS Safari or Chrome on Android), read `references/mobile-web-guidelines.md` first and follow it by default. Do not ask permission to apply it; ask only where a rule conflicts with an explicit request or needs product context. Where you deviate, say which rule and why. End front-end tasks with the summary format in its section 20. Never call mobile behaviour verified unless it was tested in real WebKit (Playwright WebKit, iOS Simulator or a device); Chromium emulation does not count. Where a guideline overlaps this system's rules (breakpoints, tokens, motion), the system's tokens and `guidance.md` decide the values and the guidelines decide the mobile behaviour.

## Adding a component

Never start on your own. When a new component comes up, ask the user whether they want it imported into the design system, then follow `references/import.md`: find what exists, bring it in, run the theme-cohesion checks (colour, text, radius, shadow, glass, hover, motion, icons, sizing), add the story, verify across the six-theme matrix, regenerate this skill's references, report, and ask for QA.

## Scope notes

- This skill documents the system; it does not change it. QA runs go through the `qa-run` skill, which only tests.
