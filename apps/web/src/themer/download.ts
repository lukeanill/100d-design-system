import { notifyProblem, notifySuccess } from "./notify"

/**
 * Hand the file to the browser. If it cannot, put the code on the clipboard
 * instead and say so, so the person is never left with nothing.
 */
export async function downloadFile(name: string, text: string) {
  try {
    const url = URL.createObjectURL(new Blob([text], { type: "text/css" }))
    const a = document.createElement("a")
    a.href = url
    a.download = name
    document.body.append(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return true
  } catch {
    try {
      await navigator.clipboard.writeText(text)
      notifyProblem({
        title: "The download was blocked",
        now: "The code is copied to your clipboard instead.",
        next: `Paste it into a file called ${name}.`,
      })
    } catch {
      notifyProblem({
        title: "The download was blocked",
        now: "The code is still on this page, but it couldn't be copied for you.",
        next: `Select it, copy it, and save it as ${name}.`,
      })
    }
    return false
  }
}

export { notifySuccess }
