# QA

Tests the design system with Claude Code and keeps the record.

```bash
pnpm --filter qa dev     # http://localhost:5174/qa/run, needs Storybook on :6006
pnpm --filter qa test    # grade rules, Storybook parsing
```

**Run** picks a theme and components and gives you a prompt (`/qa-run ...`) to paste into Claude Code. The `qa-run` skill (`.claude/skills/qa-run/SKILL.md`) does the test and writes to `data/qa.db`. **Results** shows the findings and takes your rating.

- Components and their states are one thing; tests and results are another. A test keeps its own record of the components and states it ran, so changing the states never rewrites a past test.
- Components come from Storybook's story index and are re-read while the app is open.
- `fixtures/` holds one file per tested component, drawing the states Claude chose.
- `server/cli.ts` is the only way Claude writes to the database. Set `QA_DB` to use another file, `QA_STORYBOOK_URL` for another Storybook.

Phase 1: Run and Results. Theme overrides (2), Dashboard (3) and component sorting (4) come later; the database already holds what they need.
