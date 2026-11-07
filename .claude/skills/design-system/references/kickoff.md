# Kickoff questions

Use when someone starts **building a new app, site or feature with the design system package** (`@lukeanill/ui`, or `@workspace/ui` inside this repo). Not for small edits to something already built. Start by inviting them to share project context and designs (Step 0), then ask the questions. Ask before writing any code, because these answers are hard to change later. The recommendations below are defaults for when no context says otherwise.

Look and feel (motion, page transitions, backgrounds, light or dark, icons) and the product's tone are part of the theme. Do not ask about them; they come with the theme the user picks.

## Step 0: let them tell you about the project first

Do not recommend anything yet. Your first message is a short invitation, in plain English, for them to share what they have, for example:

> Before I ask anything, tell me about the project in your own words: what it is, who it's for, and anything already decided. If you have designs (a Figma link, screenshots, a PDF, a brief or a live site to match), share them now.

Then stop and wait for their reply. Do not use AskUserQuestion for this step: it needs room for free text and attachments. If they have nothing yet, they will say so.

When they reply:
- Read everything they shared. Open Figma links in dev mode (read-only), look at screenshots and files, and note what the designs already answer: colours that point to a theme, rounded or sharp corners, glass or flat surfaces, phone or desktop frames, forms and sign-in screens, maps or video.
- Say back, in two or three lines, what you understood.
- Mark which of the twelve questions the context already answers, and skip those.
- If they said "no designs" or "not yet", carry on without them. Never ask twice.

## How to ask

- Number everything you raise (see Numbering in `SKILL.md`). The twelve questions keep the numbers 1 to 12 below.
- Use AskUserQuestion for the remaining questions. It takes up to 4 at a time, so ask Round 1, then Round 2, then Round 3.
- Write each question in plain English, one sentence, with 2 or 3 example answers. Put your recommendation first and mark it "(Recommended)". Say why in a few words. Base each recommendation on what they told you and showed you, and say so ("Your designs use soft round corners, so Pacha or Laroc fit"). Without that context a recommendation is only a guess, which is why Step 0 comes first.
- If something they shared contradicts a default (a desktop-only tool, a client audit), the shared context wins over the defaults below.
- Skip anything the user has already told you, and say what you assumed.
- If they say "you choose", use the recommendation, and list it as an assumption in your final report.
- Write the answers into a short file in the project (for example `DESIGN-DECISIONS.md`) so later sessions don't ask again.

## Round 1

**1. Which theme?**
Pick one of the nine (`themes.md`): Fabrik, Illuzion, Laroc, Bootshaus, Berghain, Savaya, Pacha, Amnesia, Ushuaia. Or make a custom one in the Themer at ds.lukeai.space/themes.
- Examples: Berghain is dark, glass, sharp and serious. Pacha is light, round and bouncy. Ushuaia is light and warm.
- Recommend two or three that fit what they're building, with one line each. If unsure, Berghain (the default).
- Also ask: does one theme stay fixed, or can people switch?

**2. Accessibility: how accessible does it need to be?**
- Recommended: WCAG AA. That means usable with a keyboard, works with screen readers, visible focus, respects "reduce motion", and survives 200% zoom.
- Other examples: "AA plus a legal requirement" (EU accessibility law, ADA), "client will audit it".
- Warn them now if the chosen theme's fixed colours can't meet a stricter standard.

**3. Which devices and screen sizes?**
- Recommended: phones first, then tablet and desktop. Phones: iPhone Safari (iOS 16 and up) and Chrome on Android (last 2 versions). Smallest screen: 320px wide.
- Examples of changes: "desktop only", "add Firefox and Edge", "must be installable on the home screen".
- The system's own breakpoints are in `breakpoints.md`. Phone work follows `mobile-web-guidelines.md`.

**4. What gets saved, and for how long?**
- Recommended: keep anything important on the server. Let the browser remember only small conveniences, like the chosen theme or a half-written draft.
- Examples: "nothing saved", "saved drafts that survive closing the tab", "works offline".
- Tell them: Safari can wipe saved browser data after 7 days away, and private windows can block saving, so the browser alone isn't safe for anything that matters.

## Round 2

**5. What are you building it with, and where does it go live?**
- Recommended: Vite or Next.js with Tailwind v4 (the system needs Tailwind), hosted on Vercel.
- Examples: "Next.js on Vercel", "Vite single-page app on Netlify", "inside our existing React app".
- Also ask whether they can install `@lukeanill/ui` (it comes from GitHub Packages and needs access). The app must import the package's stylesheet and a theme, and wrap everything in `ThemeProvider`.

**6. How fast does it need to be?**
- Recommended: judged on a mid-range Android phone on 4G. The page shows its main content in under 2.5 seconds, reacts to a tap in under 0.2 seconds, and doesn't jump around while loading.
- Examples: "fine, use the recommendation", "must work on slow connections", "has a big video or map".
- Warn them: glass themes (Bootshaus, Berghain, Savaya) and animated backgrounds cost speed on older phones.

**7. Do people sign in, and what do you collect about them?**
- Recommended: collect as little as possible. Only add a cookie banner and analytics if you really use them.
- Examples: "no sign-in, no personal data", "email and password sign-in", "Google sign-in plus analytics", "payments".
- Ask which regions (EU/UK means consent for non-essential cookies) and which third-party tools (analytics, chat, ads). Third-party scripts should load after the page, never before it.

**8. What's first, and who tests it on which real devices?**
- Recommended: build the key screens first, including empty, loading and error states. Someone checks on a real iPhone and a real Android phone before launch, because emulators miss things like keyboard behaviour.
- Examples: "sign-up and dashboard first, I test on my iPhone", "needs sign-off from a client".
- Ask what must work before launch and who does the QA.

## Round 3: how we'll work together

These four keep the build on track. Claude cannot guess them, and planning will not raise them by itself. Ask them as closed questions: each has the options below, the recommended one first and marked "(Recommended)". The question box adds an "Other" choice by itself, so the user can always type their own answer.

**9. What should we protect against in the first release?**
Before asking, Claude says in a line or two which risks it sees for this project (who can see or change what, bad input, offline or failed payments and logins, search visibility, analytics, page speed), because planning won't bring them up unprompted. Whatever is not chosen is written down as "later".
- Security and errors only: who can see what, bad input, and friendly messages when things fail (Recommended)
- Everything: security, errors, search visibility (SEO), analytics and page speed
- Just the basics: the happy path works, handle the rest later

**10. How will we know it works?**
Claude then shows the exact command it ran and its output, and fixes the real cause if something fails. It never hides an error or fakes data to pass.
- Build, types, lint and tests all pass, plus a check in the browser (Recommended)
- Tests pass, nothing else
- It matches the designs, checked by screenshot
- I'll check it by hand

**11. Should Claude copy what already exists?**
Claude notes the answer and any "don't touch" folders in the project's `CLAUDE.md`, kept short.
- Yes, find the closest example and copy it (Recommended)
- Yes, I'll show you which ones
- No, start fresh

**12. Plan first, or just start?**
Planning means Claude researches without writing code and lists its open questions in `planning.md`. The interview fills up the session, so Claude saves the decisions and the plan to files.
- Plan first, then build in a fresh session (Recommended)
- Plan first, then build in this session
- Just start: it's a small change

## While building (how Claude behaves)

1. One issue per request. If the user sends several, work through them one at a time.
2. For a bug: if the user pastes an error and says "fix", just fix it. If that misses, ask for the symptom, where it happens, and what it should do, and write a failing test before the fix.
3. If a fix works but is clumsy, offer to throw it away and redo it the clean way, now that the problem is understood.
4. After two failed corrections in a row, stop arguing. Tell the user, and suggest going back to the last good point (Esc twice, or `/rewind`), or saving progress to a file, clearing, and restarting with a sharper prompt.
5. Keep the session clean: use subagents for wide searches so results stay out of the main thread, suggest `/compact` at about half full, and suggest `/clear` between unrelated jobs.
6. When Claude makes a mistake worth remembering, propose a one-line addition to `CLAUDE.md` and ask before adding it.

## After the answers

1. Repeat the decisions back in a short list and get a yes or corrections.
2. Check them against the references. The theme exists, nothing asked for is on the known-gaps list (`guidance.md` §5), and the devices are covered.
3. Build, following `guidance.md` and, for phones, `mobile-web-guidelines.md`. In the final report, list the decisions, the assumptions, and what was not verified.
