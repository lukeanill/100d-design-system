// The release history behind the /versions page: one entry per published version of @lukeanill/ui, newest first.
// `at` is the publish time from the package registry (UTC). `notes` are the release's one-line summaries.
// Add an entry here for every release, before merging to master (see "Going live" in CLAUDE.md).
// A release that adds components lists them in `newComponents`, each with a screenshot taken from its Storybook story
// in the Berghain theme and saved to apps/web/public/versions/<name>.png (width and height in CSS px, half the PNG).

/** A component the release added, with a screenshot of it in the Berghain theme (apps/web/public/versions). */
export type NewComponent = { name: string; image: string; width: number; height: number }

export type VersionEntry = {
  version: string
  at: string
  notes: string[]
  /** The components this release added; each gets a screenshot under the version number. */
  newComponents?: NewComponent[]
}

export const versionEntries: VersionEntry[] = [
  { version: "8.1.1", at: "2026-11-10T19:00:00Z", notes: ["Glass edge follows the weight: soft 0.2, medium 0.3, heavy 0.4"] },
  { version: "8.1.0", at: "2026-11-10T18:32:02Z", notes: ["13 animated background effects in a new Interactive group", "Panel Toggle removed", "Insight Cards, Pinned List, Notification List, Selection Actions, Task Rows, Stat Card and Badge follow the theme's glass and text styles"] },
  { version: "8.0.0", at: "2026-11-10T13:46:05Z", notes: ["Tag Select and Discrete Tabs removed", "Overlays, cards, alerts and navigation on the real glass layers; buttons, inputs and selects solid", "AI components follow the theme's tokens, Notification List has controls"] },
  { version: "7.1.0", at: "2026-11-09T00:30:05Z", notes: ["Default hover on core components", "Skill updates"] },
  { version: "7.0.0", at: "2026-11-08T22:10:59Z", notes: ["uiColor setting and the new Fabrik palette", "PP Neue Montreal v3", "Tinted glass removed"] },
  { version: "6.4.0", at: "2026-11-07T02:25:15Z", notes: ["Ships the design-system skill and the install-skill command"] },
  { version: "6.3.1", at: "2026-11-06T03:42:36Z", notes: ["All component transitions follow the theme's Component Animations choice"] },
  { version: "6.3.0", at: "2026-11-04T14:00:08Z", notes: ["Ported components follow the theme's radius and control colours"] },
  { version: "6.2.0", at: "2026-11-04T07:10:21Z", notes: ["Components follow the theme's Component Animations choice"] },
  { version: "6.1.1", at: "2026-11-04T05:08:46Z", notes: ["Type-only imports in text-rotate"] },
  { version: "6.1.0", at: "2026-11-04T00:11:29Z", notes: ["Beam Input", "The default theme no longer overrides earlier themes"], newComponents: [{ name: "Beam Input", image: "/versions/beam-input.png", width: 640, height: 171 }] },
  { version: "6.0.3", at: "2026-11-01T17:40:40Z", notes: ["Font smoothing", "Theme tiles", "Showcase text sizes"] },
  { version: "6.0.2", at: "2026-11-01T16:28:12Z", notes: ["Body fonts and letter spacing follow Figma"] },
  { version: "6.0.1", at: "2026-11-01T16:23:29Z", notes: ["The theme no longer has a serif font"] },
  { version: "6.0.0", at: "2026-11-01T16:18:43Z", notes: ["Theming follows the Figma Themes file"] },
  { version: "5.0.0", at: "2026-10-31T16:57:02Z", notes: ["Adds the Voice components and the Prompt Bar model label"], newComponents: [{ name: "Thinking Orb", image: "/versions/thinking-orb.png", width: 626, height: 484 }, { name: "Voice Direction", image: "/versions/voice-direction.png", width: 327, height: 334 }, { name: "Voice Glow", image: "/versions/voice-glow.png", width: 583, height: 194 }, { name: "Voice Ring", image: "/versions/voice-ring.png", width: 274, height: 274 }] },
  { version: "4.3.0", at: "2026-10-17T23:58:55Z", notes: ["Metal Surface, Control Button, Control Group and Panel Toggle"], newComponents: [{ name: "Control Button", image: "/versions/control-button.png", width: 220, height: 167 }, { name: "Metal Surface", image: "/versions/metal-surface.png", width: 220, height: 170 }, { name: "Panel Toggle", image: "/versions/panel-toggle.png", width: 220, height: 167 }] },
  { version: "4.2.0", at: "2026-09-23T15:23:41Z", notes: ["Adds the page transitions"] },
  { version: "4.1.0", at: "2026-09-21T18:19:28Z", notes: ["Adds Split To Edit"], newComponents: [{ name: "Split To Edit", image: "/versions/split-to-edit.png", width: 259, height: 139 }] },
  { version: "4.0.0", at: "2026-09-20T04:14:48Z", notes: [] },
]
