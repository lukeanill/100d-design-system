/** What Claude finds, as a grade; what the user decides, as a rating. */

export const RATINGS = ["perfect", "minor", "major", "critical"] as const
export type Rating = (typeof RATINGS)[number]

export const GRADES = ["A", "B+", "B", "C+", "C", "D+", "D"] as const
export type Grade = (typeof GRADES)[number]

/**
 * A is no issues. B, C and D are 1-4, 5-9 and 10+ issues. A "+" means some of the tested
 * states have issues; without it, every tested state has at least one.
 */
export function gradeFor(issues: number, statesWithIssues: number, statesTested: number): Grade {
  if (issues === 0) return "A"
  const band = issues <= 4 ? "B" : issues <= 9 ? "C" : "D"
  return (statesWithIssues < statesTested ? `${band}+` : band) as Grade
}

/** The heading line of a grade group: "No issues", "1-4 issues. Some States." */
export function gradeSummary(grade: Grade) {
  if (grade === "A") return { count: "No issues", scope: null }
  const count = grade.startsWith("B") ? "1-4 issues." : grade.startsWith("C") ? "5-9 issues." : "10+ issues."
  return { count, scope: grade.endsWith("+") ? "Some States." : "All States." }
}
