import assert from "node:assert/strict"
import { test } from "node:test"

import { parseIndex } from "./sync.ts"

const entry = (id: string, title: string, type = "story", tags = ["dev"]) => ({ id, title, type, tags })

test("stories of one title become one component, in Storybook order", () => {
  const parsed = parseIndex({
    a: entry("a", "Components/Actions/Button"),
    b: entry("b", "Components/Inputs/Split To Edit"),
    c: entry("c", "Components/Inputs/Split To Edit"),
  })
  assert.deepEqual(parsed.map((c) => c.path), ["components/actions/button", "components/inputs/split to edit"])
  assert.deepEqual(parsed[1].storyIds, ["b", "c"])
})

test("tokens pages and docs entries are not components", () => {
  const parsed = parseIndex({
    a: entry("a", "Tokens/Colors"),
    b: entry("b", "Components/Actions/Button", "docs"),
  })
  assert.deepEqual(parsed, [])
})

test("the category is the folder path, as the sidebar nests it", () => {
  const parsed = parseIndex({
    a: entry("a", "Components/Actions/Button"),
    b: entry("b", "Special FX Components/Metal/Panel Toggle"),
  })
  assert.deepEqual(parsed.map((c) => c.category), ["Components / Actions", "Special FX Components / Metal"])
  assert.deepEqual(parsed.map((c) => c.name), ["Button", "Panel Toggle"])
})

test("stories the sidebar hides, and the Animation folder, are left out", () => {
  const parsed = parseIndex({
    a: entry("a", "Components/Actions/Quick Reply", "story", ["test"]),
    b: entry("b", "Animation/Text/Reveal/Typing"),
    c: entry("c", "Components/Actions/Button"),
  })
  assert.deepEqual(parsed.map((c) => c.path), ["components/actions/button"])
})
