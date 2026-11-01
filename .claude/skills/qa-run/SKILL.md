---
name: qa-run
description: Run a QA test on design-system components under one theme: write the test log, fill the QA app's Results page, and hand the user a link to both. Use when the user pastes a `/qa-run --theme ... --states ... --components "..." --estimate N` prompt from the QA app's Run page.
---

# QA run

**Golden rule: you are only testing. Do not change any component while testing, not even a one-line fix.** Record the problem as a FAIL with a short code and leave the component as it is. Fixing is a separate step the user starts. Files under `qa/` (fixtures, the app) are the test tools and may change; files under `packages/ui` may not.

The prompt comes from the QA app (`qa/`, `pnpm --filter qa dev`, http://localhost:5174/qa/run):

```
/qa-run --theme <id> --states defaults|all --components "<path>,<path>" --estimate <minutes>
```

`<path>` is the Storybook title, lowercased (`components/actions/button`). Quote it in the shell: paths can contain spaces. Every database write goes through `node qa/server/cli.ts` (the header of that file lists the commands). Never write to the database any other way. Every command that changes a test rewrites its log, `qa/logs/test-<id>.md`: do not edit the log by hand.

## What you are testing

Tokens, for every element of every state:

1. **Tokens reach every element.** Each colour, font, size, space, radius, shadow and border on the component, and on each of its parts, comes from a design-system token. A literal value, or a Tailwind default that skips a token, is an issue.
2. **Sub-components are inherited.** A component builds on the system's own parts (Button, Badge, Card, ...) instead of redrawing them.
3. **The theme works.** The same state under the chosen theme shows that theme's tokens: its colours, fonts, radius, shadow, spacing, icon weight.
4. **It sits with its neighbours.** Size, spacing, font and colour agree with related components.

There are no theme overrides yet: test the theme as its presets define it.

## 1. Test brief

1. Read the request: which theme, which components, defaults or all states, and the estimate (minutes).
2. The states to test are already identified (they are the numbers on the Run page). Do not re-choose them. If a component has none, say so and identify them first with the `states` command (rules at the end of this file).
3. `node qa/server/cli.ts sync`. If Storybook is not running, restart it yourself: `preview_start` with the `stories` config in `.claude/launch.json` (port 6006; never a shell command), then run `sync` again. If it comes up on another port, or will not start, stop and ask the user. The same goes if it goes offline later in the run (a command says it cannot reach Storybook, or the app shows "Storybook offline"): restart it, and carry on from where you were.

## 2. Test log and Results page

1. `node qa/server/cli.ts begin --theme <id> --states <mode> --components "<paths>" --estimate <minutes>`. This starts the test: it records the date and time, the estimate, the theme, each component and the states you are testing, and starts the log. It prints the test id and the log path.
2. **Fixtures.** The Results page renders every state live, as the designs show. For each component, `qa/fixtures/<path with / as __>.tsx` must exist and draw each planned state, using the state names exactly. It exports `{ states: [{ name, render }], scenarios? }` of real design-system code, as `qa/fixtures/components__actions__button.tsx` does. The states flow freely under their labels (no rows or columns).
   - Draw a hover or keyboard-focus state by spreading `HOVER` or `FOCUS` (from `qa/src/lib/force-states.ts`) onto the element: the card then shows the component's own hover or focus styles, held on.
   - `scenarios.width` draws the default component at full, half and hug width of its container; `scenarios.longText` draws it with a very long label in a narrow container (the expected behaviour is an ellipsis). Leave one out when it does not apply.
   - If a test was begun before a component's states changed, `node qa/server/cli.ts replan <testId>` brings it in line (only while it has no results).
3. A component that cannot be rendered (it throws, or needs something the test page lacks) is not graded: `node qa/server/cli.ts exclude <testId> "<path>" --reason "<why, in one sentence>"`. This is not an issue and not Critical.
4. Open `http://localhost:5174/qa/results/<testId>`. It is the page the user will read: each component sits in a container drawn in the theme under test, with its states rendered.

## 3. Test, one component at a time

For each component, in the order the Results page lists them:

1. **List what you will check.** For every planned state, list the elements you will test and what you expect (the token, size or behaviour). Check ALL the rules the theme can put on an element, not only the obvious ones: fill, colour, border, radius, shadow, typography (family, size, weight, line height), texture (the theme's surface texture or material), icon style (the theme's icon weight, and icon size), and spacing. If a theme rule should reach an element and does not, that is a FAIL. If a rule does not apply to that element, say so in the expected result instead of leaving it out:
   `node qa/server/cli.ts expect <testId> "<path>" --json '[{"state":"hover","element":"fill","expected":"--muted at 40%"}]'`
2. **Test every element of every state, one by one** in the built-in browser, comparing computed styles with the theme's tokens in `packages/ui/src/themes/presets.ts` and `packages/ui/src/styles/tokens.css`. Write PASS or FAIL for each:
   `node qa/server/cli.ts check <testId> "<path>" --json '[{"state":"hover","element":"fill","outcome":"PASS"},{"state":"hover","element":"text","outcome":"FAIL","code":"not using theme token"}]'`
3. **A FAIL gets a short code** of a few words on why: "not using theme token", "literal size", "redrawn not inherited", "wrong theme value". One FAIL is one issue.
4. **Summarise the component** in plain words, a few sentences: the issues found, which tokens, how easy or hard each is to fix (or that there are none):
   `node qa/server/cli.ts result <testId> "<path>" --summary "..."`
   This sets its grade (no issues is A; 1-4, 5-9 and 10+ issues are B, C and D; a `+` means only some states have issues). The Results page lists each issue under the component.

Do not fix anything during a run, and do not rate: the rating (Perfect, Minor, Major, Critical) is the user's.

## 4. When you are done

1. `node qa/server/cli.ts finish <testId>`.
2. Send the user one message with two links: the test log (`qa/logs/test-<id>.md`, as a file link) and the Results page for this test (`http://localhost:5174/qa/results/<testId>`), plus the grade counts. Say they can rate and annotate it.
3. **Then wait.** The user opens the Results page in the Claude Code browser, sets priority ratings (Minor, Major, Critical) and sends annotations on issues they see. Do not reply to those messages. Keep each annotation: when they say they are done ("I'm done", "I've given all feedback"), record each one with `node qa/server/cli.ts feedback <testId> --text "..." [--component "<path>"] [--state <name>]`. The ratings are already in the database; the log picks them up.
4. Then ask the user: give you the fix prompt (from the app) to start fixes, or save the fixes for later. Everything they said and rated is in the log either way.

## Identifying states (only when a component has none)

Work them out from the component's code and what a user can experience; Storybook's args are only a hint. The test is about tokens: if you are 99% sure the tokens proven in one state also work in another, the second is not a state.

- Keep a state only when it puts a different set of token-bound styles on screen: a variant's colours, a size's spacing, the hover fill, the focus ring, disabled, invalid.
- Layout and content cases (long text, many items, narrow width) and brief transitions (pressed) are not states.
- A state a shared part already proves is not repeated: if Copy, Icon or Toggle Group reuse Button's variants, sizes or ring, test those on Button only.
- For sizes keep the smallest, the default and the largest.
- Mark the states Storybook shows on load as `default`, and give each a one-line reason:
  `node qa/server/cli.ts states "<path>" --json '[{"name":"default","default":true,"reason":"..."},...]'`
  The list replaces the component's recorded set; past tests keep their own record of what they ran.
