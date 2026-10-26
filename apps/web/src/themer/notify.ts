import { toast } from "@workspace/ui/components/toast"

/**
 * A problem the person can act on. Every message says what failed, what the
 * Themer is doing about it right now, and what to do next, so none of them is
 * a dead end.
 */
export function notifyProblem({ title, now, next }: { title: string; now: string; next: string }) {
  toast.add({ title, description: `${now} ${next}`, type: "error", timeout: 9000 })
}

export const notifySuccess = (title: string) => toast.add({ title, type: "success", timeout: 5000 })
