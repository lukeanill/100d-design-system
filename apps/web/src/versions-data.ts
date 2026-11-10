// The release history behind the /versions page: one entry per published version of @lukeanill/ui, newest first.
// `at` is the publish time from the package registry (UTC). `notes` are the release's one-line summaries.
// Add an entry here for every release, before merging to master (see "Going live" in CLAUDE.md).

export type VersionEntry = {
  version: string
  at: string
  notes: string[]
}

export const versionEntries: VersionEntry[] = [
  { version: "8.0.0", at: "2026-11-10T13:46:05Z", notes: ["Tag Select and Discrete Tabs removed", "Overlays, cards, alerts and navigation on the real glass layers; buttons, inputs and selects solid", "AI components follow the theme's tokens, Notification List has controls"] },
  { version: "7.1.0", at: "2026-11-09T00:30:05Z", notes: ["Default hover on core components", "Skill updates"] },
  { version: "7.0.0", at: "2026-11-08T22:10:59Z", notes: ["uiColor setting and the new Fabrik palette", "PP Neue Montreal v3", "Tinted glass removed"] },
  { version: "6.4.0", at: "2026-11-07T02:25:15Z", notes: ["Ships the design-system skill and the install-skill command"] },
  { version: "6.3.1", at: "2026-11-06T03:42:36Z", notes: ["All component transitions follow the theme's Component Animations choice"] },
  { version: "6.3.0", at: "2026-11-04T14:00:08Z", notes: ["Ported components follow the theme's radius and control colours"] },
  { version: "6.2.0", at: "2026-11-04T07:10:21Z", notes: ["Components follow the theme's Component Animations choice"] },
  { version: "6.1.1", at: "2026-11-04T05:08:46Z", notes: ["Type-only imports in text-rotate"] },
  { version: "6.1.0", at: "2026-11-04T00:11:29Z", notes: ["Beam Input", "The default theme no longer overrides earlier themes"] },
  { version: "6.0.3", at: "2026-11-01T17:40:40Z", notes: ["Font smoothing", "Theme tiles", "Showcase text sizes"] },
  { version: "6.0.2", at: "2026-11-01T16:28:12Z", notes: ["Body fonts and letter spacing follow Figma"] },
  { version: "6.0.1", at: "2026-11-01T16:23:29Z", notes: ["The theme no longer has a serif font"] },
  { version: "6.0.0", at: "2026-11-01T16:18:43Z", notes: ["Theming follows the Figma Themes file"] },
  { version: "5.0.0", at: "2026-10-31T16:57:02Z", notes: ["Adds the Voice components and the Prompt Bar model label"] },
  { version: "4.3.0", at: "2026-10-17T23:58:55Z", notes: ["Metal Surface, Control Button, Control Group and Panel Toggle"] },
  { version: "4.2.0", at: "2026-09-23T15:23:41Z", notes: ["Adds the page transitions"] },
  { version: "4.1.0", at: "2026-09-21T18:19:28Z", notes: ["Adds Split To Edit"] },
  { version: "4.0.0", at: "2026-09-20T04:14:48Z", notes: [] },
]
