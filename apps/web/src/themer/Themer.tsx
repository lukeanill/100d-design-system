import { useEffect, useMemo, useRef, useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
} from "@workspace/ui/components/animate-ui/components/base/alert-dialog"
import { Button } from "@workspace/ui/components/button"
import { Toaster } from "@workspace/ui/components/toast"
import { getPreset, themeToFile, type ThemeDraft } from "@workspace/ui/themes"

import { CodeScreen, MyThemeScreen } from "./Code"
import { Copy } from "./Copy"
import { downloadFile } from "./download"
import { Landing, type LandingChoice } from "./Landing"
import { Language } from "./Language"
import { notifySuccess } from "./notify"
import { BASELINE, draftFromPreset, draftToTheme, emptyDraft, feelDone, lookDone, unsetLabels, valuesDone, type Step, type Tab } from "./state"

/** The generic template: Berghain, named my-theme, for someone to edit. */
const TEMPLATE = themeToFile({ ...BASELINE, id: "my-theme", label: "My theme" })

export function Themer() {
  const [step, setStep] = useState<Step>("landing")
  const [origin, setOrigin] = useState<"copy" | "build">("build")
  const [preset, setPreset] = useState<string | null>(null)
  const [draft, setDraft] = useState<ThemeDraft>(emptyDraft)
  const [tab, setTab] = useState<Tab>("look")
  const [visited, setVisited] = useState<Set<Tab>>(new Set(["look"]))
  const [dirty, setDirty] = useState(false)
  const [leaving, setLeaving] = useState<null | (() => void)>(null)
  const announced = useRef(false)

  const theme = useMemo(() => draftToTheme(draft), [draft])
  const file = useMemo(() => themeToFile(theme, { unset: unsetLabels(draft) }), [theme, draft])

  const patch = (p: Partial<ThemeDraft>) => {
    setDraft((d) => ({ ...d, ...p }))
    setDirty(true)
  }
  const showTab = (t: Tab) => {
    // a page cannot be opened until the one before it is complete
    if (t === "feel" && !lookDone(draft)) return
    if (t === "values" && !(lookDone(draft) && feelDone(draft))) return
    setTab(t)
    setVisited((v) => new Set(v).add(t))
  }
  /** Leaving with unsaved work asks first. Nothing here is stored anywhere. */
  const leave = (go: () => void) => (dirty ? setLeaving(() => go) : go())
  const reset = () => {
    setDraft(emptyDraft())
    setPreset(null)
    setTab("look")
    setVisited(new Set(["look"]))
    setDirty(false)
    announced.current = false
    setStep("landing")
  }

  useEffect(() => {
    if (step === "mytheme" && !announced.current) {
      announced.current = true
      notifySuccess("Your new theme has been generated")
    }
  }, [step])

  const choose = (choice: LandingChoice) => {
    if (choice === "copy") setStep("copy")
    if (choice === "build") {
      setOrigin("build")
      setDraft(emptyDraft())
      setDirty(false)
      setTab("look")
      setVisited(new Set(["look"]))
      setStep("language")
    }
    if (choice === "code") setStep("code")
  }

  return (
    <Toaster>
      {step === "landing" && <Landing onChoose={choose} onHome={() => (window.location.href = "/")} />}

      {step === "copy" && (
        <Copy
          selected={preset}
          onSelect={setPreset}
          onBack={() => setStep("landing")}
          onContinue={() => {
            const p = getPreset(preset ?? undefined)
            if (!p) return
            setOrigin("copy")
            setDraft(draftFromPreset(p))
            setDirty(false)
            setTab("look")
            setVisited(new Set(["look"]))
            setStep("language")
          }}
        />
      )}

      {step === "language" && (
        <Language
          draft={draft}
          onChange={patch}
          tab={tab}
          onTab={showTab}
          visited={visited}
          onBack={() =>
            tab === "values" ? showTab("feel") : tab === "feel" ? showTab("look") : leave(() => setStep(origin === "copy" ? "copy" : "landing"))
          }
          onContinue={() =>
            tab === "look" ? showTab("feel") : tab === "feel" ? showTab("values") : lookDone(draft) && feelDone(draft) && valuesDone(draft) && setStep("mytheme")
          }
        />
      )}

      {step === "mytheme" && (
        <MyThemeScreen
          code={file}
          onBack={() => setStep("language")}
          onDownload={async () => {
            if (await downloadFile(`${theme.id}.css`, file)) setDirty(false)
          }}
          onExit={() => leave(reset)}
        />
      )}

      {step === "code" && (
        <CodeScreen code={TEMPLATE} onHome={() => setStep("landing")} onDownload={() => downloadFile("my-theme.css", TEMPLATE)} />
      )}

      <AlertDialog open={leaving !== null} onOpenChange={(open) => !open && setLeaving(null)}>
        <AlertDialogPopup>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave without downloading?</AlertDialogTitle>
            <AlertDialogDescription>Themes aren't saved anywhere, so this one will be lost.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel render={<Button variant="outline">Stay</Button>} />
            <AlertDialogAction
              render={<Button variant="outline">Leave</Button>}
              onClick={() => {
                const go = leaving
                setLeaving(null)
                go?.()
              }}
            />
          </AlertDialogFooter>
        </AlertDialogPopup>
      </AlertDialog>
    </Toaster>
  )
}
