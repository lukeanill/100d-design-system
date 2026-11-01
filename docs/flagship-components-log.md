# Flagship Components: change log

Every change you prompted on the three components in the Preview section (the nav bar `FluidTabs`, the prompt bar `PromptBar` with its menus, and the metal buttons `ControlButton` with `metal`), in the order you asked for them. Each entry has your words, what was done, and the principle you gave.

How to read it:
- **You said** is quoted from your messages. Nothing there is paraphrased.
- **Principle** is the rule in your own words where you stated one. Where you gave an instruction and no rule, it says "no rule stated" and does not invent one.
- **Result** is where the change ended up. When a later message replaced it, it says so.
- Changes that did not work, or that you rejected, are not entries. They appear only in "Steps along the way" inside the entry they led to.
- Scope: component work from the metal fill fix through the input padding. The homepage layout work before it is not in this log.

Files are in `packages/ui/src/` unless a path says otherwise. Tokens are mirrored in `packages/ui/tokens/*.json` for all nine themes.

---

## 1. Metal: a translucent fill, not solid white

**You said:** "metal should use a glass button effect not solid white" … "metal should use an opacity background like in the original component http://libraries.dev/metal … its impossible to see the effect bwcausw youve added a white solid fill"

**Principle:** The effect has to be visible. A solid fill hides it. The background is an opacity background, as in the original Metal component.

**What was done:** `components/metal-surface.tsx`: the surface became a translucent tint of the foreground colour (8%, 12% on hover) over a soft blur, with the text in the foreground colour. The metal-fx styles needed `!` to win over it.

---

## 2. Preview: both metal engines on, alive and the same height

**You said:** "they still arent animating" (with the selected buttons: "should be the same height. both should have the metal and halo effect. both should be actively animating")

**Principle:** Both versions (v1 and v2) show the metal and halo effect, are actively animating, and are the same height.

**What was done:** `apps/web/src/Preview.tsx`: each engine renders a circle and a pill with `metal halo` at `size="lg"`. The reveal problem in the development server was not solved at this point; it was solved in entry 19.

---

## 3. Alpha washes in every theme file

**You said:** "add the alpha/light/md fill to each theme file" … "they're all in the figma variables" … "there's an alpha collection"

**Principle:** The values come from the Figma `alpha` collection, one value for every theme.

**What was done:** `themes/css.ts` writes `--alpha-dark-*` and `--alpha-light-*` (steps none, xs, sm, md, lg, xl) into every theme, and all nine `tokens/*.json` files were updated.

---

## 4. All displayed components use the theme's tokens

**You said:** "ensure these components (displayed) all correctly use/apply the themes token settings for: fonts, radius, color, shadow, icon styles. Ensure the prompt bar and nav bar match the height of the metal buttons"

**Principle:** Fonts, radius, colour, shadow and icon style all come from the theme's tokens. The prompt bar and nav bar match the metal buttons' height.

**What was done:** the nav bar, prompt bar and metal buttons read the theme's font, radius (`--radius`), shadow tokens and icon settings. The Preview container sets the theme's body font and weight. Heights were matched to the metal buttons (finalised in entry 10).

---

## 5. Fill follows texture and colour

**You said:** "the background fill of all components should be based on theme tokens: Texture and Color (light/dark). If texture is fill use the token for 'card' with an additional alpha (dark/light) sm overlay. If texture is gradient use the tokens: alpha (dark/light) md to alpha (dark/light) lg. If texture is glass use the relevant glass effect from storybook based on light/dark color" … then "just apply to the ones on this page for now"

**Principle:** The fill is decided by the theme's texture (solid, gradient or glass) and colour (light or dark), from the `alpha` and `card` tokens and the Glass sheet.

**What was done:** `themes/css.ts` writes `--control-fill` (solid: card colour under the wash; gradient: wash md to wash lg; glass: none). `components/themed-surface.tsx` (`SurfaceFill`) draws the fill, using the Soft glass layer on glass themes. Applied to the Preview components only, as you said.

**Refined by:** entry 6 (the solid wash step and the alpha percentages).

---

## 6. The dark wash on solid is always xs; alpha steps set to 4 / 8 / 16 / 32

**You said:** "Illuzion solid, dark card colour under the 16% dark wash - use xs instead" … "i mean set the dark wash on solid fills to always be xs" … "so the dark wash is now 8%?" … "lets change the xs token to 4% opacity, sm to 8%, md to 16% and lg to 32%" … "ive updated dont worry."

**Principle:** The dark wash on a solid fill is always `xs`. The dark alpha steps are xs 4%, sm 8%, md 16%, lg 32%.

**What was done:** `themes/css.ts`: the solid fill uses `alpha/dark/xs` for a dark tone and `alpha/light/sm` for a light tone. The `ALPHA` table was set to the percentages you gave (you had already updated Figma).

---

## 7. One text style in every component

**You said:** "make sure any text within these components uses the same style. Here's an example to follow <Figma 310-6420>"

**Principle:** All text in the components uses the Figma style `body/sans/md/regular`.

**What was done:** `styles/tokens.css` defines `.text-body-md` (theme body font, weight, line height and letter spacing). It was applied to every piece of text in the nav bar, prompt bar and metal pill. `lib/utils.ts` was changed so the class survives class merging.

---

## 8. Fonts too bold

**You said:** "why do all the fonts look so bold?" … "list the font css for body/md in each of the 4 themes"

**Principle:** No rule stated beyond the question. Weight comes from the theme's body weight (Figma `Font/Sans/weight`).

**What was done:** the Preview container and `.text-body-md` take the weight from the theme (`--font-body-weight`) instead of a fixed medium weight. I then listed the body font CSS for the four themes.

---

## 9. Line height and letter spacing from Figma variables

**You said:** "make sure you use the line-height and letter-spacing as variables provided in figma"

**Principle:** Line height and letter spacing are the per-theme variables in Figma (`Font/Sans/line-height`, `letter-spacing`), not constants.

**What was done:** `themes/types.ts` and `themes/css.ts` add `--font-body-line-height` and `--font-body-letter-spacing`. `themes/presets.ts`: Illuzion and Pacha body letter spacing 1, Berghain body line height 146. The prompt bar's input height was changed so a taller line height does not make the bar taller.

**Not confirmed with you:** whether the letter spacing "1" in Figma is a percent (what was assumed) or pixels.

---

## 10. Phosphor icons in 20 × 20 boxes, 44px height, 4px minimum padding

**You said:** "now make all icons (in these components) use Phospher - and the themes selected weight" … "and make all the icons work in a 20x20px container - <Figma 310-6420> like this example" … "I've updated the reference - please follow it carefully (especially for the tab bar) - the height of all components should should now be 44px with minimum 4px padding"

**Principle:** Icons are Phosphor only, at the theme's icon weight, each in a 20 × 20 box. These components are 44px high with at least 4px of padding.

**What was done:** `components/themed-icon.tsx` (`ThemedIcon`) renders a Phosphor icon at the theme's weight in a 20px box, and every icon in the three components uses it. The nav bar track and the prompt bar are 44px with 36px inner elements.

**Later:** you said not every component is 44px. That number is where these three land, not a rule for every component.

---

## 11. Glass corners ("this is broken")

**You said:** "this is broken" (the prompt bar's corners on a glass theme)

**Principle:** No rule stated; the glass has to follow the component's corners as the theme changes.

**What was done:** `components/themed-surface.tsx` re-reads the component's corner radius when the theme changes, after its transition ends and when it is resized.

---

## 12. Hover: only a wash, and the colour never changes

**You said:** "ensure all hover effects are consistent across these components. They should be: 1. Never change the text/icon color 2. Only change the background layer by adding an alpha overlay: Light themes: dark/md, Dark themes: light/md"

**Principle:** A hover never changes the text or icon colour. It only adds an alpha overlay to the background: the dark wash on light themes and the light wash on dark themes.

**What was done:** `themes/css.ts` writes `--control-hover`. Every hover class that changed the text or icon colour was removed from the nav bar, prompt bar and metal pill; their hover is now `hover:bg-(--control-hover)`.

**Later:** the step was lowered from md to sm (entry 22).

---

## 13. Hover timing follows the theme's motion

**You said:** "hover effect should use a transition based on the themes motion/animation style"

**Principle:** The hover transition uses the theme's motion style (its easing and its none, ease, emphatic or springy setting).

**What was done:** the hovers use `--motion-transition-ease` (the theme's curve, linear for none, a spring curve for springy). The duration was then set from the Timing set (entry 15).

---

## 14. Illuzion is a light theme

**You said:** "why do the components still look so dark in ILLUZION" … "yeah lets change illuzion to light"

**Principle:** No rule stated.

**What was done:** `themes/presets.ts`: Illuzion's tone is light. `themes/themes.test.ts` and `tokens/illuzion.json` were updated to match.

---

## 15. Guideline note: motion and elevation

**You said:** "Make a design system guideline note that for… 1. All component motion/animation should follow Material Designs principles on 'Choosing a duration' and select an appropriate variable from my 'timing' set (only) … The exception is where animation is part of the components core identity (such as metal - where the effect is 'the point' of it). 2. All component shadow/ elevation should follow Material Design elevation principles … You must only: use the tokens in my design system. And: Use the appropriate tokens for the theme setting e.g. subtle or strong (or apply no shadow if none is set)"

**Principle:** Durations only from the Timing set, chosen by Material's guidance, with a metal-style exception. Shadows only from the shadow tokens, at the theme's strength (or none), by Material's elevation guidance.

**What was done:** `.design-sync/conventions.md` got a "Motion" and an "Elevation" section. They were written from my own knowledge of the Material pages, because you stopped my fetch of the elevation page. The wording has not been checked against Material by you.

Then you said "yes" to aligning the hovers: `themes/css.ts` writes `--motion-fast` (the Timing `fast`, 200ms; `instant` for a theme set to none), and the tabs, prompt bar buttons, menu highlight and metal pill use it. Measured at 0.2s on the five Preview states.

---

## 16. Borders: 1px, by scheme

**You said:** "now lets fix borders - (the outer shell of) components should have a 1px border. for light themes the color is: alpha/dark/xs and dark themes: alpha/light/xs. the exception is: glass textures & any components where border is part of the effect (like metal)"

**Principle:** The outer shell has a 1px border. Light themes use `alpha/dark/xs`, dark themes `alpha/light/xs`. Glass, and components whose border is part of the effect, are the exceptions.

**What was done:** `themes/css.ts` writes `--control-edge` (transparent on glass). The nav bar, prompt bar and both popups use it.

**Later:** the border became a centred outline (entry 24).

---

## 17. A popup is one shadow level above its component

**You said:** "if a theme has shadow - make sure you follow elevation principles with popups it creates so if the components shadow is xs, the popup is sm (for example) so always 1 level higher for a popup"

**Principle:** A popup's shadow is always one level above the component that opens it.

**What was done:** `components/ai/prompt-bar.tsx`: the composer is `shadow-xs` and its menus are `shadow-sm`; a comment records the rule.

---

## 18. Theme tiles: fills and a metal border

**You said:** "change the theme tile background colors so: deselected themes use an alpha/dark/xs overlay, selected themes use an alpha/light/sm overlay and selected themes use a metal v1 effect border"

**Principle:** Deselected tiles `alpha/dark/xs`; selected tiles `alpha/light/sm`; selected tiles have a metal v1 border.

**What was done:** `apps/web/src/Preview.tsx`. (These tiles are part of the Preview section, not a component; they are here because the metal effect and the alpha washes are used on them.)

---

## 19. Metal not appearing consistently

**You said:** "its not working consistently"

**Principle:** No rule stated; the effect has to show every time.

**What was done:** the cause was that the metal effect was mounted twice at start-up (once before its corner radius was known), and the first mount never revealed. `components/metal-surface.tsx` now waits for the radius before mounting the effect. The tile's metal ring is always mounted and fades in on selection. After the fix all eight metal instances were visible, including the two metal buttons that had never appeared in the development server.

---

## 20. A darker line under the metal ring on light themes

**You said:** "if the theme is light we need to put a darker border underneath the metal effect so it's mroe visible" … then "and only apply the darker border underlay on light themes. make the darker border underlay use alpha/dark/xs"

**Principle:** On a light scheme the metal ring needs a darker line against it; the line uses `alpha/dark/xs`; light themes only.

**What was done:** `apps/web/src/Preview.tsx`. A layer under the ring was hidden by the ring, so the line became the tile's own border, just outside the ring, using `alpha/dark/xs`, only when the theme's scheme is light. The metal ring also follows the theme's light or dark scheme.

**Not checked on screen:** the final `xs` border on Illuzion and Pacha. It is 4%, so it is faint.

---

## 21. Metal ring thickness

**You said:** "try making the metal effect a thicker border on all tiles" … "2px"

**Principle:** No rule stated beyond the value.

**What was done:** `components/metal-surface.tsx` gained a `ringWidth` option (v1 only); `apps/web/src/Preview.tsx` sets it to 2.

---

## 22. Hover one step lower

**You said:** "hover effects are a bit too extreme. can you drop them by 1 e.g. sm to xs"

**Principle:** Drop the hover wash by one alpha step.

**What was done:** `themes/css.ts` and the nine token files: `--control-hover` is now the `sm` step (it was `md`). This is the shared token, so it changes everything that uses it, not only the Preview section.

---

## 23. Popups: 8px padding and half the width

**You said:** "give all popup containers a min. 8px padding. make component popups width at least 50% of the component width"

**Principle:** Popup padding is at least 8px. A popup is at least half the width of its component.

**What was done:** `components/ai/prompt-bar.tsx`: both menus have 8px padding. The model menu has a 50% minimum width (measured 216.5px against a 433px composer). The `@` menu already spans the full width.

---

## 24. Corners: inner from the theme, outer = inner + padding

**You said:** "the calculation for radius (all components) between outer and inner elements should work like this: Essentially that for themes with 'Subtle' and 'Strong' components inner elements have 'sm' edges variable set. The outer radius is calculated by = sm (inner) + padding (of outer component)" <Figma 313-6899>

**Principle:** Inner elements wear the theme's `edges/sm`. The outer corner is that value plus the outer component's padding.

**Steps along the way (all corrected by you):**
- I first counted the border into the padding (a 4px bar as 3px of padding plus 1px of border, and 8px popup padding plus 1px as 9px). You said: "never include the border in the calculation."
- You said "borders ARE center applied i mean", and then: "no padding should be an odd number". The 3px padding became 4px, and the border became an outline centred on the edge (entry 16 now uses `outline` with a −0.5px offset).
- You then corrected the values: "All rounded are 9999px. All sharp/none are 0px." I had assumed 20px for rounded; I looked in Figma, and its `edges` collection has `sharp` at 0 on every step and `rounded/button` at 9999.

**Result:** `themes/css.ts` writes `--radius-inner` (sharp 0, subtle 4px, strong 8px, rounded 9999px) and `--radius-outer-max` (sharp 0, the theme's radius for subtle and strong, 9999px for rounded). The nav bar, the prompt bar and both menus use `min(outer-max, inner + padding)`, and the tabs, buttons, chips and menu rows use the inner value. Measured: Illuzion 12px outside and 8px inside, Savaya 8 and 4, Pacha and Amnesia 9999 for both.

---

## 25. Every line follows the border colour rule

**You said:** "all 'lines' e.g. borders and dividers that a component has (including popups) should follow the border color rule"

**Principle:** All lines, including dividers and the lines of popups, use the border colour rule.

**What was done:** `components/ai/prompt-bar.tsx`: the divider above the menu footer and the attachment chip's outline now use `--control-edge`. The composer's outline no longer changes colour on focus.

---

## 26. Prompt bar content renamed, Max is the default

**You said:** "Rename the content to: Slay Lane (Max) / Huh Ave (Pro) / Meh Way (Basic)" … "make Max the default"

**Principle:** No rule stated.

**What was done:** `components/ai/prompt-bar.tsx`: the three models are Slay Lane (Max), Huh Ave (Pro) and Meh Way (Basic), in that order. The name and the tag are shown as separate text in each row. Slay Lane is the starting model, including in the built-in demo sequences.

---

## 27. Nav bar content from the Figma example

**You said:** "update the content to match my example <Figma 310-6506>"

**Principle:** No rule stated; the content mirrors the Figma example.

**What was done:** `components/animate-ui/components/base/fluid-tabs.tsx`: the tabs are Look, Feel and Rules with Phosphor Swatches, Scribble and Film Script icons. The Storybook story's ids were updated.

---

## 28. Popup fill: the component's fill plus a dark wash

**You said:** "back to overlays! The background color should be: overlay background fill + alpha/dark/sm" … then "I meant component background fill + alpha/dark/sm. Unless a glass theme - then use the next level up e.g. if component glass is medium, popup is heavy"

**Principle:** A popup's fill is the component's own fill plus `alpha/dark/sm`. On a glass theme it uses the next glass weight up instead.

**What was done:** `components/themed-surface.tsx`: `SurfaceFill` has a `popup` option (the component's fill under the dark `sm` wash; glass goes Soft to Medium). Both prompt-bar menus use it.

**Not checked by you on screen:** I noted that Medium glass reads as see-through over a busy background.

---

## 29. A heavy blur behind popups

**You said:** "add a heavy background blur to popups too the alpha/blur/../sm variable. if the page width is less than 1200 then use alpha/blur/320/sm. if more use alpha/blur/1200/sm"

**Principle:** Popups blur what is behind them with the `alpha/blur` `sm` variable: the 320 set under 1200px wide, the 1200 set over.

**What was done:** I read the values from Figma (320 sm is 40px, 1200 sm is 120px). `themes/css.ts` and the token files write them; `styles/tokens.css` defines `--popup-blur` with a 1200px switch; both menus use it. Measured: `blur(40px)` at 766px wide and `blur(120px)` at 1300px.

**Edge case:** a page exactly 1200px wide gets the 1200 value (`min-width`).

---

## 30. Links inside a popup use primary

**You said:** "If there's a link/ ghost button within the popup (see the 'connect' button on the prompt bar) use the color token: primary" … "primary background (i mean)"

**Principle:** A link or ghost button inside a popup uses the `primary` colour token, as its background.

**What was done:** `components/ai/prompt-bar.tsx`: the "Connect" button has a `primary` background with the `primary-foreground` text, a small pill with the inner corner. It also stays `primary` once connected. It was not checked in the browser after the final change (you stopped that check and then said "perfect").

---

## 31. An input inside a component gets double padding

**You said:** "when an input field is within a component always use double padding"

**Principle:** An input field inside a component has twice that component's padding.

**What was done:** `components/ai/prompt-bar.tsx`: 8px at the sides inside the 4px bar (it was 4px); 28px at the sides in the 14px tall layout. Vertical padding was not changed: the bar must stay 44px high.

---

## 32. Rounded corners apply to controls, not to cards

**You said:** "good point (my mistake) on 'rounded' so buttons, inputs, nav bar etc. (like the flagship components) use 'button: 9999px' however - things like card styles are not fully rounded - they follow the sm, md etc. tokesn"

**Principle:** On a rounded theme, controls (buttons, inputs, the nav bar and the like) use the `edges/button` step, 9999px. Cards and surfaces are not fully rounded: they follow the `sm`, `md` and other numbered steps.

**What was done:** guideline text only, no code change. `docs/component-theming-guidelines.md` rules R1 to R5 were rewritten, and flag F2 was marked resolved. The code already used `edges/button` for the controls inside the flagship components, and cards use other tokens, so nothing needed changing.

---

## 33. Text rule: theme and typescale tokens

**You said:** "T4. Text only uses the theme styles defined in 'theme' tokens and text sizes defined in 'typescale' tokens. The default size for all core interactive elements (e.g. button, input, select, nav) and paragraph text is (body)md."

**Principle:** Text styles come from the `theme` tokens and text sizes from the `typescale` tokens. Core interactive elements and paragraph text default to `(body) md`.

**What was done:** guideline text only, no code change. `docs/component-theming-guidelines.md` rule T4 was replaced with your wording. The earlier detail about theme-supplied font, weight, line height and letter spacing became T5, and a K3 cross-reference was added under Core Interactive Components.

---

## 34. Gradient follows elevation

**You said:** "C4. ... based on elevation principles (e.g. component popups adjust the tokens used)"

**Principle:** The gradient texture is based on elevation principles, and a component's popup adjusts the tokens used.

**What was done:** guideline text only, no code change. Rule C4 in `docs/component-theming-guidelines.md` was reworded, a question C4a was added about which tokens a popup gradient uses, and flag F7 records that C4 and P4 now disagree. The code still gives a gradient popup the component's fill plus `alpha/dark/sm`. You then pointed me back to entry 28 ("I meant component background fill + alpha/dark/sm"): that already answers it, so C4a and F7 were changed to resolved.

---

## 35. No values in the alpha rule

**You said:** "C6. The alpha steps, for reference: dark xs 4%, sm 8%, md 16%, lg 32%. Values are in the Figma `alpha` collection. Feedback: - dont hard code any values in here"

**Principle:** Don't hard-code values. Refer to the token; the value lives in Figma.

**What was done:** guideline text only, no code change. Rule C6 in `docs/component-theming-guidelines.md` now names the steps and points at the collection, with no percentages.

---

## 36. Popups also blur the background

**You said:** "popups also apply a background blur"

**Principle:** A popup applies a background blur. (You had already specified it in entry 29: the `alpha/blur` `sm` variable, the 320 set under 1200px wide and the 1200 set over.)

**What was done:** guideline text only, no code change. Rules C4 and C4a in `docs/component-theming-guidelines.md` now say a popup also applies a background blur, pointing to P5. The code already blurs every popup.

---

## 37. No values in the guidelines

**You said:** "remove ALL actual values from here e.g. step: sharp 0, subtle 4px, strong 8px, rounded 9999px. just use token references and always show token references in code style" … "if i ever want to change the token values i dont want this guidance to clash"

**Principle:** The guidance never copies a value. It names tokens, in code style, so a change to a token's value in Figma never clashes with it.

**What was done:** guideline text only, no code change. Every pixel, percentage, millisecond and size was taken out of `docs/component-theming-guidelines.md` (corner steps, padding, heights, the icon box, the popup width, the blur page widths, the hover and elevation examples). Where a token exists the rule names it (`edges/button`, `alpha/dark/xs`, `Timing/fast`). Where none exists, the rule says what the number is for and points to a new flag, F8, which lists the missing tokens. A short section at the top explains this. You then said token names that carry a size (`dimensions/4`, `dimensions/8`, `alpha/blur/320/sm`, `alpha/blur/1200/sm`) are fine to keep, so those names were put back in S1, P2 and P5, and the padding and blur page-width items were taken out of F8. This log is a record of what was asked at the time, so it still contains values.

---

## 38. New tokens: border width, padding, icon box

**You said:** "ive added more tokens" (screenshots of the Figma `icons`, `spacing` and `edges` / `border-width` variables)

**Principle:** A rule that needs a number should name a token for it.

**What was done:** guideline text only, no code change. I read the new variables from Figma: `edges/border-width/*`, `spacing/padding/*` and `icons/container/*`. `docs/component-theming-guidelines.md` now uses `edges/border-width/md` for the border (B1), `spacing/padding/xs` and `spacing/padding/sm` for the padding minimums (S1, P2) and `icons/container/md` for the icon box (I1). F8 now lists only the control heights and the popup width share, and a new flag F9 asks how the theme's `spacing` setting relates to the padding steps. The components in code still hard-code these sizes; they are not yet wired to the new tokens.

---

## 39. New `size-controls` tokens

**You said:** "look through the variables in my figma file - ive made some changes"

**Principle:** Rules name the tokens in the Figma file. Where a token exists for a number, use it.

**What was done:** guideline text only, no code change. I read every collection in the Figma file again. The new `size-controls` collection holds the control sizes that F8 had listed as missing: `interactive-component/min-height` and `min-width` for a component and for a component within a component, the icon box, and the minimum padding. It also has `card/padding/*`. `docs/component-theming-guidelines.md` now uses those tokens in S1, I1, K1 and K2. F8 is down to the popup width share, R6 asks about card padding, and F10 records that `edges/rounded/button` now points to `dimensions/max`.

---

## 40. Two new components in the Preview: a stat card and a fish-pic card

**You said:** "can you add 2 new components into the preview. apply the same token principles as the others" <Figma 290-9540>, "read the annotations in dev mode"

**Principle:** The same token principles as the flagship components. The Figma annotations are instructions: the stat card switches between today, this month and this year with the Select, and its number is the Sliding Number, animated on view and when the period changes; the second card is a modified Streaming Text.

**What was done:** new `ai/stat-card.tsx`, `ai/thread-insight-card.tsx` and `themed-card.tsx`, a `themed` mode on `ai/streaming-text.tsx`, new tokens `--edges-sm`, `--edges-xs` and `--edges-md` (every theme, `themes/css.ts` and the token files), new type classes `text-body-sm` and `text-heading-h3`, and the fish picture from Figma saved to `apps/web/public/preview/fish-thread.png`. Both cards matched the Figma sizes when first built. The values for "today" and "this year" were invented, since Figma only gave this month.

---

## 41. Popup width, popup corners, cards use `edges/md`

**You said:** "too small (not wide enough) why?" / "popups are in a card container and shouldnt apply the button: 9999px radius. just the usual card value" / "make cards use ../md radius"

**Principle:** A popup is a card: it takes the card corner, never the control corner. The card corner is the `edges/md` step.

**What was done:** the select popup was as wide as its trigger, so the tick sat on the text; it now grows to its rows with a minimum of half the card. Cards, and popups (the prompt bar's menus too), use `--edges-md`. The select popup was later dropped when you chose the native select (entry 43), so the width fix no longer applies to the stat card; the corner change still applies to the prompt bar's menus.

---

## 42. Fish card: skeleton picture, text from the top, pauses

**You said:** "can you make the image load in via skeleton and show when the text is fully displayed" / "align the animated text to top so it doesnt jump around" / "pause for 1s before loading the 'new followers' card numbers. pause for 2s before loading the fish pics card"

**Principle:** No rule stated beyond the instruction.

**What was done:** the picture is a skeleton until the sentence has finished, then fades in (`--motion-fast`). The text is aligned to the top. A new hook `hooks/use-delayed-in-view.ts` waits for the card to be seen and then pauses: 1s before the figures count up and 2s before the sentence streams (both are props, `startDelay`).

---

## 43. Native select, fixed width, no page jump, constant height

**You said:** "make this fixed width based on the longest text value" / "why does the page jump when i click this?" / "<Storybook native select> use this instead for the select" / "make sure the box doesnt change height when i switch to 'today'"

**Principle:** A control does not change size with its value.

**What was done:** the page jumped because the Base UI popup scrolls to a row it has not yet placed, so the period select is now your Native Select (`native-select.tsx` has a `themed` chip: inner corner, body md, the secondary fill, a hover wash, a themed caret). A native select is as wide as its longest option. The browser draws its dropdown, so the popup guidelines (P1 to P8) cannot apply to it: that is a flag. The Select popup code I had added to `select.tsx` was removed.

---

## 44. The two cards together

**You said:** "contain these 2 components together so: when stacked - they share the same width (based on largest) with a 16px margin. when side-by-side - they share the same height - also with 16px margin. the width & height of the followers card should be based on the widest & tallest scenario so it doesnt jump around"

**Principle:** The group sizes itself from its content, the widest and tallest case, so nothing moves.

**What was done:** `apps/web/src/Preview.tsx` puts the cards in one grid: one column under 800px wide, two columns from 800px, 16px apart. Stacked, both are the wider card's width (320px); side by side, both are the taller card's height. The stat card lays every period's figure in one hidden cell, so its width and height come from the widest and tallest period. Measured at 676px and 1300px wide: the stat card stayed the same size across today, this month and this year, and the gap was 16px.

---

## 45. The guidelines renumbered in three levels, and the page loses its theme picker

**You said:** "I suggest you renumber the 'things' to: e.g. 1.1.1 — 1 - topic e.g. texture & color mode — 1.1/2/3 etc. - different token applications e.g. color-mode, texture — 1.1.1/2/3 - individual points about that token application e.g. texture > glass. Then for exceptions either add at level 2 or level 3 e.g. 1.1*.2* but add a star" / "If you're asking a question/review point use a ? so .. 2.3?.4?" / "not needed. just show examples" (the theme picker)

**Principle:** A rule is found by its place: topic, then token application, then point. A star marks an exception, a question mark marks a point that needs your answer or review.

**What was done:** `docs/component-theming-guidelines.md` is renumbered, and the Flags section is gone: each flag is now a ? point under the topic it belongs to. `docs/component-theming-guidelines.html` no longer has the theme picker; every example is a real theme, named where it matters. Old to new numbers: T1 1.1.1, T2 1.1.2, X1 1.1.3*, T4 1.2.1, T5 1.2.2, F4 1.2.3?, C1 2.1.1 and 2.2.1 to 2.2.3, F1 2.1.2?, B1 3.1.1 to 3.1.3 and 3.2.1 (3.1.2* is the exception), R1 4.1.1, R2 4.1.2, R3 4.1.3, R4 4.1.4, R3's open part 4.1.5?, R5 4.1.6?, F10 4.1.7?, S1 4.2.1, S2 4.2.2, R6 4.2.3, S3 4.2.4, I1 5.1.1, I2 5.1.2*, H1 6.1.1, H2 6.1.2, F6 6.1.3?, M1 7.1.1, M2 7.1.2, M3 7.1.3*, M4 7.1.4?, F3 7.1.5?, E1 8.1.1, E2 8.1.2, E3 8.1.3, F3 8.1.4?, K1 9.1.1, K2 9.1.2*, K4 9.1.3 and 9.1.4?, P2 10.1.1, P3 10.1.2, P6 10.1.3, F8 10.1.4?, P4 10.2.1, P5 10.2.2, P8 10.2.3, F5 10.2.4?, P9 10.3.1, P10 10.4.1*, B6 11.1.1, X2 11.2.1, X3 11.2.2, G1 12.1.1.

---

## 46. Letter spacing is a percentage

**You said:** "yeah %" (to the question whether the letter spacing of 1 on Illuzion and Pacha is a percent)

**Principle:** A theme's letter spacing is a percentage of the font size.

**What was done:** the question 1.2.3? in `docs/component-theming-guidelines.md` became the rule 1.2.3. The code already treats the value as a percent, so nothing in it changed.

---

## 47. Fabrik and Laroc are light

**You said:** "both light in figma" (to the question whether the code should follow Figma for Fabrik and Laroc)

**Principle:** There is one `color-mode` per theme, and it is the one in Figma.

**What was done:** `themes/presets.ts`: Fabrik's scheme and tone are light (it was dark), and Laroc's scheme is light (it was dark, with a light tone). Their palettes already matched Figma, so only the colour-mode changed. In `packages/ui/tokens/fabrik.json` and `laroc.json` the washes follow: the border is `alpha/dark/xs`, the hover is `alpha/dark/sm`, Fabrik's solid fill is `alpha/light/sm`, and the success colour is the light-mode one. `themes.test.ts` has Fabrik as light and Laroc's `color-scheme` as light. The type check is clean and all 30 theme tests pass. The question 2.1.2? became the rule 2.1.2.

---

## 48. The solid fill's wash goes up a step

**You said:** "lets change to dark/sm and light/md" (the solid fill: it was `alpha/dark/xs` and `alpha/light/sm`)

**Principle:** The solid texture is the `card` token under a dark wash `sm` in a dark colour-mode, and a light wash `md` in a light colour-mode.

**What was done:** `themes/css.ts` (`controlFill`) and the `control-fill` token of the four solid themes (Fabrik, Illuzion, Laroc, Pacha, all now light colour-mode, so `alpha/light/md`). Rule 2.2.1 in `docs/component-theming-guidelines.md` says the same. This is the shared fill token, so it changes every component that uses it: the nav bar, the prompt bar, the metal buttons' fill, and both new cards. It supersedes the `xs` step in entry 6.

---

## 49. Corners and spacing are separate topics

**You said:** "seperate corners and spacing"

**Principle:** One topic, one subject.

**What was done:** topic 4 is now "Corners" (4.1 Corners) and a new topic 5 is "Spacing" (5.1 Padding, formerly 4.2). Every later topic moved down one: Icons 6, Hover states 7, Motion / transitions 8, Shadow / elevation 9, Size 10, Popups 11, Metal 12, Feedback 13. The rules inside keep their second and third numbers, so for example popup blur went from 10.2.2 to 11.2.2, and a card's default padding from 4.2.3 to 5.1.3. The numbers quoted inside the rules, and the examples under them, were renumbered too. In `docs/component-theming-guidelines.md` and the page, nothing else changed.

---

## 50. The corner maximum is an exception

**You said:** "excpetions" (about the sentence "It never goes past the theme's maximum for the control: edges/button, so radius=sharp is always square and radius=rounded is always fully rounded" in 4.1.4)

**Principle:** A limit on a rule is an exception, so it is its own starred point.

**What was done:** the sentence became the exception 4.1.5* in `docs/component-theming-guidelines.md`, with its own two examples (sharp always square, rounded always fully rounded) beside illustrations. The ? points after it moved down one: 4.1.5? is now 4.1.6?, 4.1.6? is 4.1.7? and 4.1.7? is 4.1.8?.

---

## 51. One rule for the outer corner, and cards' corner as an exception

**You said:** "exception" (about 4.1.2, cards not being fully rounded on a rounded theme) / "same point" (about 4.1.3, a card's default corner, and 4.1.4, the outer corner sum)

**Principle:** One point, one place; a limit on a rule is an exception.

**What was done:** 4.1.2 is now an exception to 4.1.1 (4.1.2\*). The old 4.1.3 and 4.1.4 are one point, 4.1.3: the outer corner is the inner corner plus the padding; a card follows it, and a card with nothing inside that has a corner of its own is `edges/md`. The corner maximum is 4.1.4\*, and the ? points are 4.1.5?, 4.1.6? and 4.1.7?.

---

## 52. Cards are never fully rounded

**You said:** "cards are never fully rounded" (to the question whether a card holding a pill-shaped control should be capped at one of its own `edges` steps)

**Principle:** A card is never fully rounded, whatever is inside it.

**What was done:** the question became the exception 4.1.5* in `docs/component-theming-guidelines.md`: when the outer-corner sum would make a card fully rounded, its corner is capped below fully rounded. Which `edges` step is the cap is a new question, 4.1.6?. The two older questions moved to 4.1.7? (other surfaces) and 4.1.8? (`dimensions/max`). It has no illustration yet, because the cap step is not decided. You then added "unless designed in figma": 4.1.5* now says a card is never fully rounded unless it is designed that way in Figma.

---

## 53. Sizes and numbers link to `dimensions`

**You said:** "yes i expect all size/numericals to link to dimension tokens (like in figma)" (to the question whether the code should follow `dimensions/max` exactly)

**Principle:** Every size or number is a `dimensions` token, directly or through another token set, as in Figma.

**What was done:** in `docs/component-theming-guidelines.md`, a sub-point under 1.1.1 states the principle, and the question became the rule 4.1.6 (fully rounded is `dimensions/max`). The earlier ? points are 4.1.7? and 4.1.8?. In the code, `themes/css.ts` and the nine token files now carry `--dimensions-max` (169px, the Figma value) and the rounded themes' inner and maximum corners point at it, where they were a fixed 9999px. Measured in the app on Pacha: the nav bar and its tabs are 169px, and look the same as before. Not done: the other sizes in the code (padding, heights, the icon box, border width, corner steps) are still values in the components, not `dimensions` tokens. That is a larger change.

---

## Not in this log

- The "Flagship Components" guidance in `.design-sync/conventions.md`. You told me it was too vague, and then that it was poor. It is not a record of what you asked for, and this log replaces it as the record.
- Anything you rejected or interrupted that never took effect: a `--popup-fill` token built on the popover colour (replaced by entry 28), an extra underlay layer for the ring (replaced by entry 20), 3px ring thickness (replaced by entry 21), the "Connected" colour in green (removed in entry 30).
- Not committed: none of the work in this log has been committed or pushed.
