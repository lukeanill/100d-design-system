# Component theming guidelines

Working draft, for your feedback. Every rule comes from something you said while we built the three flagship components (the nav bar `FluidTabs`, the prompt bar `PromptBar` with its menus, and the metal buttons `ControlButton` with `metal`). They are the reference implementations. The record of what you asked for, in your words, is in [flagship-components-log.md](flagship-components-log.md).

## How this guidance stays true when a token changes

This guidance never contains a value of its own. A rule names the token it uses (`alpha/dark/xs`, `radius/button`, `radius/border-width/md`, `Timing/fast`, `shadow`, `size-controls/interactive-component/min-height/component`). A token whose name carries its size (`alpha/blur/320/sm`) is referred to by that name, which is how you named it. Where no token exists yet, the rule says what the number is for and a ? point asks for the token (see 11.1.4?). Because of that, changing a token's value in Figma changes the components and needs no edit here. If a rule ever does need a number, that is a missing token: it becomes a ? point, not text.

## How to leave feedback

- Rules are numbered in three levels. The first number is the topic (for example 2, texture and colour-mode), the second is a token application within it (2.2, texture), and the third is a single point about it (2.2.3, glass). Point at a rule by its number.
- A star after a number (3.1.2*) marks an exception to the rule it follows.
- A question mark after a number (4.1.7?) marks a point I'm asking you about, or want you to review. A ? point has no answer yet and I have not guessed one. Once you answer it, it becomes a rule with a plain number.
- Write under the line that says `Feedback:` in the rule you're commenting on. Add as many lines as you like. Replace `Feedback:` with `OK:` if a rule is right as written.
- The theme setting names are the ones in your Figma theme table: `spacing`, `radius`, `color-mode`, `shadow`, `texture`, `motion`.

---

# ALL COMPONENTS

## 1 Tokens

### 1.1 Theme tokens

- **1.1.1** Use theme tokens and styles only. Nothing is written by hand: no hex colour, no pixel radius, no shadow value, no duration.
  - Sizes and numbers: every size or number is a `dimensions` token, directly or through another token set (`radius`, `spacing`, `icons` and `size-controls` are all `dimensions` steps in Figma). A component never has a number of its own.
  Feedback:
- **1.1.2** Every token applied to a component starts from the theme's settings, where they apply.
  - Example: `radius=sharp` means no border radius anywhere.
  - Example: `shadow=none` means no shadow anywhere.
  - Example: `motion=none` means no transitions.
  Feedback:
- **1.1.3\*** Exception: a component can use different tokens or styles only if that style is fundamental to the component's purpose.
  - Example: the metal components have a unique animated border.
  Feedback:

### 1.2 Text

- **1.2.1** Text only uses the theme styles defined in the `theme` tokens and the text sizes defined in the `typescale` tokens. The default size for all core interactive elements and for paragraph text is `(body) md`.
  - Example: core interactive elements (a button, an input, a select and a nav) use `(body) md`.
  - Example: paragraph text uses `(body) md`.
  Feedback:
- **1.2.2** The font, weight, line height and letter spacing come from the theme's variables (`Font/Sans/font`, `weight`, `line-height`, `letter-spacing`). A component never sets its own size, weight or letter spacing.
  - Example: `body/sans/md/regular` is the theme's body font, weight, line height and letter spacing at the `(body) md` size.
  Feedback:
- **1.2.3** A theme's letter spacing is a percentage of the font size (`Font/Sans/letter-spacing`), not a pixel value.
  Feedback:

## 2 Texture & color-mode

### 2.1 Colour-mode

- **2.1.1** `color-mode` (light or dark) is one setting per theme, whether the theme is defined in Figma or generated in the app. It dictates which colour tokens a component uses, within a theme, and which glass style is used. There is no second light or dark setting.
  Feedback:
- **2.1.2** Fabrik is `color-mode=light`, as in Figma. Laroc is `color-mode=dark`. The code follows Figma.
  Feedback:

### 2.2 Texture

- **2.2.1** Solid `texture`: the `card` token with an alpha overlay. Dark colour-mode: `alpha/dark/sm`. Light colour-mode: `alpha/light/md`.
  Feedback:
- **2.2.2** Gradient `texture`: a top-to-bottom gradient from the `md` alpha step to the `lg` alpha step. Dark colour-mode: `alpha/dark/md` to `alpha/dark/lg`. Light colour-mode: `alpha/light/md` to `alpha/light/lg`.
  Feedback:
- **2.2.3** Glass `texture`: the Soft glass from the Glass sheet, in its dark or light tone to match the colour-mode. It is the component's base background layer, with no fill colour and no alpha wash under it, and it overrides any rule that clashes with it (see 3.1.2*).
  Feedback:

## 3 Lines

### 3.1 Borders

- **3.1.1** The outer shell has a border of `radius/border-width/md`. Light colour-mode: `alpha/dark/xs`. Dark colour-mode: `alpha/light/xs`.
  Feedback:
- **3.1.2\*** Exceptions: a glass texture has no border, and a component whose border is part of its effect (the metal ring) keeps its own.
  Feedback:
- **3.1.3** The border is centred on the edge, so it never takes space from the padding. Padding and corners are worked out without it.
  Feedback:

### 3.2 Other lines

- **3.2.1** Every other line a component has uses the same colour rule as the border (3.1.1).
  - Example: a divider.
  - Example: the outline of its popup.
  Feedback:

## 4 Corners

### 4.1 Corners

- **4.1.1** Controls and the elements inside a component (buttons, inputs, selects, tabs, the nav bar, menu rows, chips) wear the theme's `radius/button` step. The step resolves per theme `radius`: `sharp` is square, `rounded` is fully rounded.
  Feedback:
- **4.1.2\*** Exception to 4.1.1: cards and other surfaces are not fully rounded on a rounded theme. They follow the numbered `radius` steps (`sm`, `md`, `lg`, `xl`) for the theme's `radius`.
  Feedback:
- **4.1.3** The outer corner of a component that contains elements is the inner corner plus the padding of the outer component. The border is not counted. A card follows the same rule: a card that contains a card, a picture or a control takes its corner from this sum. A card with nothing inside it that has a corner of its own is `radius/md`.
  - Example: a nav bar. Its tabs are `radius/button`, so the bar is that plus its padding.
  - Example: a card with a picture in it. The picture is `radius/xs`, so the card is that plus its padding.
  Feedback:
- **4.1.4\*** Exception: the outer corner never goes past the theme's maximum for the control, `radius/button`.
  - Example: `radius=sharp` is always square, whatever the padding.
  - Example: `radius=rounded` is always fully rounded.
  Feedback:
- **4.1.5\*** Exception: a card is never fully rounded, unless it is designed that way in Figma. When the sum in 4.1.3 would make a card fully rounded (a card that contains a pill-shaped control on a rounded theme), the card's corner is capped below fully rounded.
  Feedback:
- **4.1.6** Fully rounded is `dimensions/max`. `radius/rounded/button` resolves to it, and the code follows it exactly, not a very large radius of its own.
  Feedback:
- **4.1.7?** Which `radius` step is that cap for a card: `sm`, `md`, `lg` or `xl`?
  Feedback:
- **4.1.8?** Which `radius` step do other surfaces use, besides a card?
  Feedback:

## 5 Spacing

### 5.1 Padding

- **5.1.1** A core interactive component's padding is at least `size-controls/interactive-component/min-padding/component`, and is always an even number.
  Feedback:
- **5.1.2** An input field inside a component has double that component's padding at the sides.
  Feedback:
- **5.1.3** A card's default padding is `size-controls/card/padding/padding-md`, and it is always an even number (5.1.1).
  Feedback:
- **5.1.4** The theme's `spacing` setting drives layout between components only. Component padding stays at the fixed tokens (5.1.1, 11.1.1, 5.1.3), so a control is the same size in every theme. (Figma has `mg` for Amnesia's `spacing`, which looks like a typo for `md`.)
  Feedback:

## 6 Icons

### 6.1 Icon

- **6.1.1** Use an icon from the Phosphor set, in the theme's selected icon weight, in a box of `size-controls/interactive-component/min-height/icon-within-component` by `size-controls/interactive-component/min-width/icon-within-component` (both resolve to `icons/container/md`).
  Feedback:
- **6.1.2\*** Exception: a Figma file provides a different or unique icon.
  Feedback:

## 7 Hover states

### 7.1 Hover

- **7.1.1** One formula based on colour-mode, for every texture. Light colour-mode: add `alpha/dark/sm` over the background. Dark colour-mode: add `alpha/light/sm`.
  Feedback:
- **7.1.2** A state (hover, focus, press) only changes the background layer. It never changes the colour of text or an icon, a border, or a shadow.
  Feedback:
- **7.1.3?** The hover wash (7.1.1) is a shared token, so a change to it applies to every component that uses it, not only the three flagship ones. Is that what you want?
  Feedback:

## 8 Motion / transitions

### 8.1 Duration and easing

- **8.1.1** Follow Material Design's "choosing a duration" guidance, and use a variable from the `Timing` set only (`instant`, `fast`, `faster`, `long`, `longer`, `longest`). A hover or press is `fast`.
  Feedback:
- **8.1.2** The theme's `motion` setting supplies the easing. `motion=none` is `instant`.
  Feedback:
- **8.1.3\*** Exception: where the animation is the component's core identity (metal is "the point" of the effect), it keeps its own timing.
  Feedback:
- **8.1.4?** Which `Timing` step should the nav bar's active-tab pill moving, and the active text colour changing, use? They are not on the `Timing` set yet. (Menus and popups are settled in 11.3.1.)
  Feedback:
- **8.1.5?** The Material Design wording in 8.1.1 is my reading of the guidance, written without opening the pages. Please check it against how you read it.
  Feedback:

## 9 Shadow / elevation

### 9.1 Shadow

- **9.1.1** Use the `shadow` tokens only, at the strength of the theme's `shadow` setting (subtle or strong).
  Feedback:
- **9.1.2** Follow Material Design's elevation principles: elevation shows which surface sits above which.
  Feedback:
- **9.1.3** A popup is always one level above the component that opens it.
  - Example: the component is `xs`, its popup is `sm`.
  Feedback:
- **9.1.4?** The Material Design wording in 9.1.2 is my reading of the guidance, written without opening the pages. Please check it against how you read it.
  Feedback:

---

# CORE INTERACTIVE COMPONENTS

For example: button, input, select.

## 10 Size

### 10.1 Control size

- **10.1.1** The default minimum height is `size-controls/interactive-component/min-height/component`, and the default minimum width is `size-controls/interactive-component/min-width/component`.
  Feedback:
- **10.1.2\*** Exception: a core interactive component inside another component has a default minimum height of `size-controls/interactive-component/min-height/component-within-component` and a default minimum width of `size-controls/interactive-component/min-width/component-within-component`. The component it sits in keeps the `component` minimums in 10.1.1.
  Feedback:
- **10.1.3** A core interactive component's height is a minimum: it grows when its content needs more room.
  Feedback:
- **10.1.4?** What counts as a core interactive component besides a button, input, select and nav?
  Feedback:

---

# COMPONENTS WITH POPUPS

A popup is a menu, popover or dropdown that a component opens.

## 11 Popups

### 11.1 Layout

- **11.1.1** Padding: at least `spacing/padding/sm`, always an even number.
  Feedback:
- **11.1.2** Width: at least the system's minimum popup width, as a share of the width of the component that opens it (see 11.1.4?).
  Feedback:
- **11.1.3** Corners: a popup is a card, so its corner is the card corner, `radius/md` (4.1.2, 4.1.3), and never the fully rounded control corner.
  Feedback:
- **11.1.4?** The minimum popup width has no token. Should the share of the component's width become a token, and what should it be called?
  Feedback:

### 11.2 Surface

- **11.2.1** Fill: the component's own fill (2.2) plus `alpha/dark/sm` on top. On a glass texture there is no wash, and the glass goes up one weight (the component's Soft is Medium in the popup, Medium is Heavy).
  Feedback:
- **11.2.2** Blur: a heavy blur of what is behind it, from the `alpha/blur` variables at the `sm` step. A page narrower than the width in the name `1200` uses `alpha/blur/320/sm`; a page at least that wide uses `alpha/blur/1200/sm`.
  Feedback:
- **11.2.3** A link or ghost button inside a popup has a `primary` background and a `primary-foreground` colour for its text.
  Feedback:
- **11.2.4?** The Medium glass used for a popup on a glass theme shows what is behind it quite clearly. 11.2.1 follows your rule, but you may want Heavy for readability.
  Feedback:

### 11.3 Motion

- **11.3.1** A popup opens at `Timing/faster` and closes at `Timing/fast`, so leaving is quicker than arriving.
  Feedback:

### 11.4 Native select

- **11.4.1\*** Exception: a native select's dropdown is drawn by the browser, so 11.1 to 11.2 cannot apply to it. A component that needs a themed popup uses a custom one; a native select keeps the themed chip (corner, text, fill, hover, caret) and leaves the dropdown to the browser.
  Feedback:

---

# COMPONENT SPECIFIC GUIDELINES

## 12 Metal

### 12.1 Ring

- **12.1.1** On a light colour-mode, a metal ring sits on a darker line outside it, `alpha/dark/xs`, so the ring reads on a pale surface.
  Feedback:

### 12.2 Fill and effect

- **12.2.1** The fill under the effect must be translucent, never solid white, or the effect can't be seen.
  Feedback:
- **12.2.2** The effect must show and animate on every metal control, and metal controls shown together are the same height.
  Feedback:

---

# COLLABORATION GUIDELINES

## 13 Feedback

### 13.1 Issues

- **13.1.1** Always give feedback when there is an issue, or an expected issue, applying a theme token to a component (for example, a theme with no value for something a component needs).
  Feedback:
