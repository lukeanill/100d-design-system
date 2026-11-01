import { describe, expect, it } from "vitest"

import { getPreset } from "@workspace/ui/themes"

import { GROUPS, OPTIONS, draftToText, textToDraft } from "./options"
import { draftFromPreset, emptyDraft, feelDone, lookDone, valuesDone } from "./state"

describe("the theming options", () => {
  it("each has a description and says what it accepts", () => {
    const text = draftToText(emptyDraft())
    for (const o of OPTIONS) {
      expect(o.description.length).toBeGreaterThan(10)
      expect(text).toContain(`${o.name}:`)
    }
    expect(text.match(/Accepts:/g)!.length).toBe(OPTIONS.length - 1)
  })

  it("are grouped as the Themer groups them", () => {
    expect(GROUPS.map((g) => g.title)).toEqual([
      "Name", "Color", "Typography", "Texture", "Edges", "Shadow", "Spacing", "Icons",
      "Component Animations", "Page Transitions", "Animated Background", "Hero Section", "Values",
    ])
  })

  it("write and read back every preset exactly", () => {
    for (const id of ["berghain", "alpes"]) {
      const preset = getPreset(id)
      if (!preset) continue
      const draft = draftFromPreset(preset)
      const { draft: back, errors } = textToDraft(draftToText(draft), emptyDraft())
      expect(errors).toEqual([])
      // the icon family is not a line of its own: it comes with the weight
      expect({ ...back, label: "", iconStyle: undefined }).toEqual({ ...draft, label: "", iconStyle: undefined })
    }
  })

  it("a filled-in block completes the theme", () => {
    const draft = draftFromPreset(getPreset("berghain")!)
    const { draft: back } = textToDraft(draftToText({ ...draft, label: "Mine" }), emptyDraft())
    expect(back.label).toBe("Mine")
    expect(lookDone(back) && feelDone(back) && valuesDone(back)).toBe(true)
  })
})

describe("typing in the block", () => {
  it("an empty block says nothing is chosen", () => {
    const { draft, errors } = textToDraft(draftToText(emptyDraft()), emptyDraft())
    expect(errors).toEqual([])
    expect(draft.primary).toBeUndefined()
  })

  it("takes a colour with or without the hash, in any case", () => {
    const base = draftToText(emptyDraft())
    const { draft } = textToDraft(base.replace("primary:", "primary: 0000FF"), emptyDraft())
    expect(draft.primary).toBe("#0000ff")
  })

  it("flags a line that is not acceptable and keeps the last good value", () => {
    const good = { ...emptyDraft(), primary: "#336699" }
    const text = draftToText(good).replace("primary: #336699", "primary: banana")
    const { draft, errors } = textToDraft(text, good)
    expect(errors).toHaveLength(1)
    expect(errors[0].name).toBe("primary")
    expect(errors[0].message).toContain("banana")
    expect(draft.primary).toBe("#336699")
  })

  it("flags a choice that is not on the list, and unknown options", () => {
    const text = draftToText(emptyDraft()).replace("edges:", "edges: pointy") + "\nzoom: 3"
    const { errors } = textToDraft(text, emptyDraft())
    expect(errors.map((e) => e.name)).toEqual(["edges", "zoom"])
  })

  it("reads numbers, yes/no and the two-way questions", () => {
    const text = draftToText(emptyDraft())
      .replace("background overlay:", "background overlay: 40%")
      .replace("background inverse colors:", "background inverse colors: yes")
      .replace("decisions:", "decisions: In control")
      .replace("heading weight:", "heading weight: 700")
    const { draft, errors } = textToDraft(text, emptyDraft())
    expect(errors).toEqual([])
    expect(draft.animatedBackgroundOverlay).toBe(40)
    expect(draft.animatedBackgroundInverse).toBe(true)
    expect(draft.values[1]).toBe("b")
    expect(draft.headingWeight).toBe(700)
  })

  it("clearing a line clears the option", () => {
    const set = { ...emptyDraft(), radius: "strong" as const }
    const { draft } = textToDraft(draftToText(set).replace("edges: strong", "edges:"), set)
    expect(draft.radius).toBeUndefined()
  })
})
