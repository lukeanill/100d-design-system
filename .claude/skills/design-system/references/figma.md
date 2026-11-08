# Building from Figma

Use whenever a design in Figma is the source for something you build or check. Figma is read-only by default. You write to it only when the user explicitly says to, and then only exactly what they say: before every write, state exactly what will change (file, page, collection, variable, value) and wait for a clear yes; add new things rather than overwriting or deleting unless they say so; afterwards report what you did and check it. Otherwise, if the design needs to change, tell the user what and why, and you change the code to match.

## 1. Read the design properly (dev mode)

Before you write any code:

1. **Use dev mode.** Read the design through the Figma tools' design context (load the `figma:figma-design-to-code` skill first, as its description requires). Use the CSS and measurements it gives, not a guess from a screenshot.
2. **Check the specs.** Size, spacing, radius, font family, size and weight, colours, shadows, and the variables each is bound to (`get_variable_defs`). Look at every state and variant the frame shows (hover, focus, disabled, empty, error) and every breakpoint frame.
3. **Read the annotations.** They are in the context as `data-annotations`. They hold decisions the visuals don't show: behaviour, rules, what to reuse. Treat them as part of the spec.
4. **Read the comments** on the frame. If your tools cannot read comments, say so and ask the user to paste any that matter. Do not assume there are none.
5. **Look at a screenshot** of the frame too, so you see what the numbers are meant to produce.

## 2. Flag anything that is not a design system token

While reading, compare every value to the system (`tokens.md`, `themes.md`). Flag each of these before you build:

- a colour that is a raw hex or fill, not a colour variable, or a variable the code has no token for
- a font family, size, weight, line height or letter spacing that is not a text style or typography variable (`text-*` classes, typescale)
- a radius, shadow, border width, spacing or icon size that is a loose number, not a `radius`, `shadow`, `spacing` or `icons` variable
- a blur, gradient or opacity drawn by hand where the system has a glass weight, alpha wash or named gradient
- a component drawn from scratch where the system already has one (`components.md`)
- a motion value (duration, easing) that is not in the `Timing` or `Easing` set

Report them as a short numbered table, so the user can answer "use the token for 1, keep 3". Do not fix them silently, and do not invent a token.

| # | Where in the design | What it uses | Closest system token or component | What you'd do |
|---|---|---|---|---|
| 1 | Hero card, background | `#1E1E1E` fill | `--alpha-dark-lg` | Use the token |
| 2 | Pricing title | Inter 38px | `text-h3-pri` (48px on the md scale) | Ask: use the style, or is 38 deliberate? |
| 3 | Promo badge | `rounded-[10px]` | none | Ask: add a token, or one-off? |

If a literal value stays, it is because Figma specifies it and no token matches. Say that in the report (rule 13.1.1 in `guidance.md`).

## 3. Ask questions and state assumptions before building

Do not start until you have done both, in this order, in plain English:

1. **Questions.** Numbered Q1, Q2, ... Anything the design leaves open or the notes contradict: missing states, unclear behaviour, a value that matches no token, a frame that conflicts with an annotation, how it should behave on a phone. Ask them together, closed where you can, with your recommended answer first (AskUserQuestion).
2. **Assumptions.** A short numbered list of what you will do if they don't answer, for example: "A1. I'll use the nearest token for the 38px title. A2. I'll treat the second frame as the mobile layout. A3. Empty and error states follow the Alert component." Ask the user to correct any that are wrong.

Wait for their reply. If they answer "go ahead", build on the assumptions and list them again in your final report.

## 4. Build and measure

Build from the design system first (`guidance.md` §1): reuse components, tokens and glass layers, and copy the nearest existing pattern. Afterwards, measure the build against the Figma numbers (size, radius, padding, font weight), in the browser, in the theme the design was drawn for. Report what matched, what differs and why, what you did not check, and the flagged-token table with what you decided for each. Then ask the user to QA, with URLs and what to look at.
