# Mobile Web Build Guidelines

You are building front-end code for a responsive website that must work well on mobile phone browsers: **iOS Safari** and **Chrome on Android** first, desktop second. Follow these rules by default. They are written as instructions to you, the AI building the site.

---

## 0. How to work with me

- **Default to these rules without asking.** Only ask when a rule conflicts with something I've explicitly requested, or when the right choice depends on product context you don't have.
- **Tell me when you deviate.** If you skip or break a rule (e.g. for framework reasons, browser support, or time), say which rule and why in your summary.
- **Call out assumptions explicitly** at the end of each task: browser support targets, things you couldn't test, features you feature-detected or left out.
- **Never claim mobile behaviour is verified** unless it was tested in real WebKit (Playwright WebKit, iOS Simulator, or a device). Chromium device emulation does not count as Safari testing.
- **Browser baseline:** iOS Safari 16+, Chrome (Android) last 2 versions. Use `@supports` / feature detection for anything newer, and list it.
- **Prefer native platform features over custom JS** (native `<dialog>`, `<select>`, date pickers, CSS scroll-snap, `position: sticky`).
- **Code is framework-agnostic below.** Translate to the project's stack (React/Next/Vue/Tailwind, etc.) rather than adding raw CSS files alongside it.

---

## 1. `<head>` — always include

```html
<html lang="en">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"> <!-- 180×180 -->
<link rel="manifest" href="/manifest.webmanifest">       <!-- 192 + 512 icons -->
```

- NEVER add `user-scalable=no` or `maximum-scale=1`. Blocking zoom is an accessibility failure.
- Add `<meta name="format-detection" content="telephone=no">` only if numbers (prices, IDs) are being wrongly auto-linked.
- `preconnect` to critical third-party origins; `preload` the LCP image and primary font.

---

## 2. Base CSS reset — include in every project

```css
html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
  scroll-padding-top: var(--header-h, 0px);
}
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
body {
  min-height: 100vh;
  min-height: 100svh;
  padding-inline: env(safe-area-inset-left) env(safe-area-inset-right);
  overflow-wrap: anywhere;
}
img, video, svg { max-width: 100%; height: auto; display: block; }

button, a, [role="button"], input, select, textarea, label {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}
input, select, textarea {
  font-size: max(16px, 1rem); /* < 16px triggers iOS zoom on focus */
}
:focus:not(:focus-visible) { outline: none; }
:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
```

---

## 3. Layout & viewport units

- **Do not use `100vh` for full-height elements.** Use `100svh` (stable, toolbar visible) for content sections, `100dvh` for app shells. Always put a `100vh` fallback line first.
- Do not recalculate layout on every `resize` event — mobile browsers fire `resize` when the toolbar shows/hides during scroll. Only react to **width** changes:
  ```js
  let w = innerWidth;
  addEventListener('resize', () => { if (innerWidth !== w) { w = innerWidth; relayout(); } });
  ```
- Do not use `orientationchange` (deprecated). Use `matchMedia('(orientation: portrait)')`.
- Add `min-width: 0` to flex/grid children that contain text, images, or code blocks — the most common cause of horizontal overflow.
- Use `overflow-x: clip` (not `hidden`) on wrappers so `position: sticky` keeps working.
- Ensure no horizontal scroll at **320px** width.
- Prefer container queries (`@container`) for component-level responsiveness; media queries for page-level layout.
- Use `rem` for type and spacing; `clamp()` for fluid type.
- Never put a `position: fixed` element inside an ancestor with `transform`, `filter` or `perspective`.

---

## 4. Safe areas

- Any fixed or full-bleed element touching a screen edge must pad with `env(safe-area-inset-*)`:
  ```css
  .bottom-bar { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
  .site-header { padding-top: env(safe-area-inset-top); }
  ```
- Remember landscape uses left/right insets.
- iOS Safari's URL bar is at the bottom by default. Fixed bottom CTAs must not collide with it — test with the toolbar both expanded and collapsed.

---

## 5. Typography

- Font stack must end in system fonts: `YourFont, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
- Web fonts: WOFF2 only, subsetted, `font-display: swap`, max 2–3 weights. Use `size-adjust` / `ascent-override` on the fallback `@font-face` to reduce layout shift.
- Headings: `text-wrap: balance`. Body: `text-wrap: pretty`.
- Body text minimum 16px.
- Don't rely on `-webkit-font-smoothing` — it has no effect on iOS.

---

## 6. Touch, pointer & hover

- **Wrap all hover styles** so they don't get stuck on touch devices:
  ```css
  @media (hover: hover) and (pointer: fine) { .btn:hover { … } }
  ```
- Never put essential info or actions behind hover only.
- Minimum hit area **44×44px**. For small icons, expand invisibly:
  ```css
  .icon-btn { position: relative; }
  .icon-btn::after { content: ""; position: absolute; inset: -12px; }
  ```
- Always provide a visible `:active` state. If `:active` doesn't fire on iOS, add `document.addEventListener('touchstart', () => {}, { passive: true });`.
- **Use real `<button>` and `<a href>` elements.** Never attach click handlers to `div`/`span`.
- Use Pointer Events (`pointerdown/move/up` + `setPointerCapture`) for drag/swipe — not separate mouse and touch handlers.
- All `touchstart`, `touchmove`, `wheel`, `scroll` listeners must be `{ passive: true }` unless `preventDefault()` is genuinely required (say so if it is).
- Horizontal swipe components: `touch-action: pan-y`. Vertical: `pan-x`. Keep them away from screen edges so they don't fight the iOS back-swipe.
- Only use `user-select: none` / `-webkit-touch-callout: none` on controls, never on content.
- Every custom gesture (swipe-to-delete, drag-to-reorder) needs a button alternative.
- Feature-detect `navigator.vibrate` (doesn't exist on iOS).

---

## 7. Scrolling

- Modals, drawers, and inner scroll areas: `overscroll-behavior: contain`.
- Only disable pull-to-refresh (`html { overscroll-behavior-y: none; }`) for map/canvas/full-app UIs — ask me first.
- Anchor targets must clear sticky headers (`scroll-padding-top` on `html`, or `scroll-margin-top` on targets).
- Carousels: CSS `scroll-snap-type` / `scroll-snap-align` before reaching for a JS library.
- Use `IntersectionObserver` instead of scroll listeners for reveal, lazy load, sticky state, infinite scroll.
- Remove `-webkit-overflow-scrolling: touch` if found — it's obsolete.
- Check that no ancestor of a `position: sticky` element has `overflow: hidden`.

---

## 8. Modals, menus & overlays

- Use native `<dialog>` + `.showModal()` by default (focus trap, Esc, `::backdrop`, inert background for free). Consider the Popover API for non-modal popovers.
- For custom overlays, set `inert` on the background content.
- Body scroll lock that works on iOS:
  ```js
  function lock() {
    const y = scrollY;
    document.body.dataset.scrollY = y;
    Object.assign(document.body.style, { position: 'fixed', top: `-${y}px`, width: '100%' });
  }
  function unlock() {
    const y = Number(document.body.dataset.scrollY || 0);
    document.body.removeAttribute('style');
    scrollTo(0, y);
  }
  ```
- Make the back button/gesture close overlays: `history.pushState` on open, close on `popstate`.
- Return focus to the trigger element on close.

---

## 9. Forms & on-screen keyboard

**Every input must have:**
- a real `<label for>` (placeholder is not a label)
- a `name`
- the correct `type` / `inputmode`
- the correct `autocomplete` token
- an `enterkeyhint` where useful

**Types & keyboards**
- `type="email" | "tel" | "url" | "search"` as appropriate.
- **Do not use `type="number"`** for card numbers, postcodes, OTPs, phone numbers or IDs. Use `type="text" inputmode="numeric"` (or `decimal`).
- Search: wrap in `<form role="search" action="…">` so the keyboard shows a Search/Go key.

**Autocomplete tokens to use:** `name`, `given-name`, `family-name`, `email`, `tel`, `street-address`, `address-line1`, `postal-code`, `country`, `cc-name`, `cc-number`, `cc-exp`, `cc-csc`, `username`, `current-password`, `new-password`, `one-time-code`.

**Other attributes**
- `enterkeyhint="next | go | send | search | done"`.
- `autocapitalize="off" autocorrect="off" spellcheck="false"` on emails, usernames, codes, URLs. `autocapitalize="words"` on names.
- Camera upload: `<input type="file" accept="image/*" capture="environment">`.
- Never block paste on password or OTP fields.

**Styling**
- Font size ≥16px on all inputs, selects, textareas (see reset).
- Reset iOS default styling where it conflicts with the design: `appearance: none; border-radius: 0;` then restyle.
- Prefer native `<select>`, `type="date"`, `type="time"`.

**Validation**
- Use built-in constraints (`required`, `pattern`, `minlength`) and style errors with `:user-invalid`, not `:invalid` (which shows on page load).
- Show errors inline next to the field, linked with `aria-describedby`.

**Keyboard handling**
- Keep the focused field visible:
  ```js
  el.addEventListener('focus', e => setTimeout(() => e.target.scrollIntoView({ block: 'center' }), 300));
  ```
- Track the keyboard height via `visualViewport` (works in both Safari and Chrome) and expose it as a CSS variable:
  ```js
  if (window.visualViewport) {
    const update = () => {
      const kb = innerHeight - visualViewport.height - visualViewport.offsetTop;
      document.documentElement.style.setProperty('--kb', `${Math.max(0, kb)}px`);
    };
    visualViewport.addEventListener('resize', update);
    visualViewport.addEventListener('scroll', update);
  }
  ```
  Then: `.sticky-cta { bottom: var(--kb, 0px); }`, or hide fixed bottom bars while an input is focused.
- You may add `interactive-widget=resizes-content` to the viewport meta for Chrome Android, but Safari ignores it — the `visualViewport` approach is still required.
- The VirtualKeyboard API (`navigator.virtualKeyboard`, `env(keyboard-inset-height)`) is Chrome-only — progressive enhancement only.
- Save in-progress form data to `sessionStorage` — mobile browsers kill background tabs.

---

## 10. Images & media

- Every `<img>` needs `alt`, `width` and `height` (or CSS `aspect-ratio`) to prevent CLS.
- Use `srcset` + `sizes` with AVIF/WebP. Use `<picture>` for format fallback and art-directed mobile crops.
- Below the fold: `loading="lazy" decoding="async"`.
- The LCP image: **no** lazy loading; add `fetchpriority="high"` and preload it.
- CSS backgrounds: `image-set()` for resolution variants.
- Icons: inline SVG or SVG sprite with `<use>`. No icon fonts.
- Inline/background video: `<video playsinline muted autoplay loop preload="metadata" poster="…">`. Without `playsinline`, iOS forces fullscreen.
- Audio cannot autoplay — create/`resume()` `AudioContext` inside a user gesture.
- Element Fullscreen API isn't supported on iPhone — feature-detect; use `video.webkitEnterFullscreen()` for video.

---

## 11. Performance

Design for a **mid-range Android phone on 4G**, not a MacBook.

- Targets (mobile, field data): **LCP < 2.5s, INP < 200ms, CLS < 0.1.**
- Code-split by route. `defer` or `type="module"` all scripts. Lazy-load heavy components (maps, editors, carousels, video players).
- Break up long tasks (>50ms): `await scheduler.yield()` where supported, else `setTimeout(0)`.
- Animate only `transform` and `opacity`. Use `will-change` sparingly and remove it after animation.
- Long pages: `content-visibility: auto; contain-intrinsic-size: auto 500px;` on off-screen sections.
- Virtualise long lists (>100 items).
- Be cautious with `backdrop-filter`, large `box-shadow`, and `filter: blur()` — expensive on mobile GPUs. Include `-webkit-backdrop-filter` for older Safari.
- Load third-party scripts (analytics, chat widgets, tag managers) after interaction or idle — never render-blocking.
- Throttle listeners with `requestAnimationFrame`.
- Hashed static assets get long `Cache-Control`; enable Brotli.
- `navigator.connection` / `Save-Data` are Chrome-only hints — never required.

---

## 12. Page lifecycle & back/forward cache

- **Never use the `unload` event.** Use `visibilitychange` / `pagehide` for saving state and analytics.
- Send exit analytics with `navigator.sendBeacon()` or `fetch(..., { keepalive: true })`.
- Handle bfcache restores (very common with mobile back-swipe):
  ```js
  addEventListener('pageshow', e => { if (e.persisted) refreshStaleUI(); });
  ```
- Don't set `Cache-Control: no-store` on HTML unless required (it disables bfcache) — flag it if you do.
- SPAs: manage `history.scrollRestoration` so back navigation returns to the previous scroll position.

---

## 13. Storage, cookies & Safari privacy

- Safari blocks third-party cookies — don't build features relying on them (cross-site embeds, third-party auth iframes). Use first-party cookies or the Storage Access API.
- Safari may clear script-written storage (localStorage, IndexedDB) after 7 days without a visit. Never treat it as permanent.
- Wrap all storage access in `try/catch`.
- Cookies: `Secure; SameSite=Lax` (or `Strict`).

---

## 14. Native-like APIs — always feature-detect

- Share: `if (navigator.share) { … } else { copy-link fallback }`.
- `navigator.clipboard.writeText()` — HTTPS + user gesture only.
- Web Push on iOS works only for home-screen-installed sites (16.4+). Don't promise push to iOS browser users.
- Geolocation / camera / mic: request inside a user gesture, handle denial gracefully with a fallback UI.
- Wake Lock: `if ('wakeLock' in navigator)`.
- Use `tel:`, `mailto:`, `sms:` links for contact details.

---

## 15. User preferences

Support all of these:

- `prefers-color-scheme` (or CSS `light-dark()`)
- `prefers-reduced-motion: reduce` — disable parallax, autoplaying carousels, large transitions, smooth scroll
- `prefers-contrast: more` — stronger borders/contrast
- `forced-colors: active` — ensure controls remain visible

---

## 16. Accessibility in code

- Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`. One `<h1>` per page; no skipped heading levels.
- Icon-only buttons need `aria-label`.
- Toggles/menus: `aria-expanded` + `aria-controls`.
- SPA route changes: move focus to the new page's `<h1>` (with `tabindex="-1"`) and announce via an `aria-live="polite"` region.
- Layout must survive 200% browser zoom and large system text sizes without overlap or clipped text.
- Colour contrast: WCAG AA minimum.

---

## 17. Navigation

- Navigation must use real `<a href>` (so long-press, preview and open-in-new-tab work).
- Don't intercept edge swipes.
- Sticky headers: keep them short; expose height as `--header-h` for `scroll-padding-top`.

---

## 18. Safari compatibility gotchas

- Check caniuse for anything newer than ~2 years (e.g. View Transitions, scroll-driven animations, anchor positioning, `:has()` edge cases). Wrap in `@supports` and provide a fallback.
- Don't parse dates with `new Date('2026-11-07 10:00')` — use ISO with `T` (`2026-11-07T10:00`) or a date library.
- Avoid regex lookbehind if supporting below iOS 16.4.
- Configure Autoprefixer / Lightning CSS with a browserslist including `ios_saf >= 16`.

---

## 19. Testing — what you must do (or tell me you didn't)

- Run Playwright tests with **WebKit** and mobile device presets (e.g. `iPhone 15`, `Pixel 7`), not just Chromium.
- Run Lighthouse in mobile mode and report LCP, INP (or TBT), CLS.
- Check these states before saying a UI is done:
  - [ ] 320px width — no horizontal scroll
  - [ ] Large phone width (~430px)
  - [ ] Landscape (safe areas left/right)
  - [ ] Keyboard open on every form (focused field visible, CTA reachable)
  - [ ] Dark mode
  - [ ] Reduced motion
  - [ ] 200% zoom / large text
  - [ ] Slow 4G + 4× CPU throttle
  - [ ] Back/forward navigation (bfcache restore, scroll position, overlays close on back)
- Tell me what needs checking on a real iPhone/Android that you couldn't verify (e.g. toolbar collapse, keyboard behaviour, haptics).
- To make local testing on my phone easy, run the dev server on the LAN (`vite --host`, `next dev -H 0.0.0.0`) and tell me the URL.

---

## 20. End-of-task summary format

When you finish a front-end task, end with:

1. **What you built** (one or two lines)
2. **Rules you deviated from** and why
3. **Assumptions you made**
4. **Not verified on real devices** — what I should check on my phone
