import assert from "node:assert/strict"
import { test } from "node:test"

import { gradeFor, gradeSummary } from "./grade.ts"

test("no issues is an A, whatever was tested", () => {
  assert.equal(gradeFor(0, 0, 5), "A")
})

test("a + means some states, no + means all states", () => {
  assert.equal(gradeFor(2, 1, 5), "B+")
  assert.equal(gradeFor(2, 5, 5), "B")
  assert.equal(gradeFor(1, 1, 1), "B")
})

test("the bands are 1-4, 5-9 and 10+", () => {
  assert.equal(gradeFor(4, 1, 5), "B+")
  assert.equal(gradeFor(5, 1, 5), "C+")
  assert.equal(gradeFor(9, 5, 5), "C")
  assert.equal(gradeFor(10, 1, 5), "D+")
  assert.equal(gradeFor(30, 5, 5), "D")
})

test("the heading line reads as the Figma does", () => {
  assert.deepEqual(gradeSummary("A"), { count: "No issues", scope: null })
  assert.deepEqual(gradeSummary("C+"), { count: "5-9 issues.", scope: "Some States." })
  assert.deepEqual(gradeSummary("D"), { count: "10+ issues.", scope: "All States." })
})
