import { useEffect } from "react"
import { addons } from "storybook/preview-api"
import { exceptionsFor, getPreset } from "@workspace/ui/themes"
import { scanTokens } from "./scan"
import { REQUEST_EVENT, UPDATE_EVENT, type TokensPayload } from "./events"

/** Everything a story renders: its own wrapper, plus popups the component opens into the page body. */
function roots(): Element[] {
  const wrapper = document.querySelector("[data-ds-tokens-root]")
  // the wrapper is the story frame, not the component: read what is inside it
  const inside = wrapper ? Array.from(wrapper.children).filter((el) => !el.hasAttribute("data-ds-skip")) : []
  const portals = Array.from(document.body.children).filter(
    (el) => el.tagName === "DIV" && !/^(storybook|sb-)/.test(el.id) && !/(^|\s)sb-/.test(el.className) && !el.contains(wrapper),
  )
  return [...inside, ...portals]
}

/**
 * Renders nothing. After the story renders, and whenever it changes, it reads which design tokens the component
 * uses and sends the list to the Tokens panel.
 */
export function TokenReporter({ themeId, title, storyId }: { themeId: string; title: string; storyId: string }) {
  useEffect(() => {
    const channel = addons.getChannel()
    const theme = getPreset(themeId)
    if (!theme) return
    const send = () => {
      const payload: TokensPayload = {
        theme: theme.id,
        themeLabel: theme.label,
        title,
        uses: scanTokens(roots(), theme),
        exceptions: exceptionsFor(title),
      }
      channel.emit(UPDATE_EVENT, payload)
    }
    let timer: ReturnType<typeof setTimeout>
    const schedule = () => {
      clearTimeout(timer)
      timer = setTimeout(send, 300)
    }
    schedule()
    const observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style", "data-state"] })
    channel.on(REQUEST_EVENT, send)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
      channel.off(REQUEST_EVENT, send)
    }
  }, [themeId, title, storyId])
  return null
}
