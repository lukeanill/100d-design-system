import { Suspense, lazy, useEffect, type ComponentType, type ReactNode } from "react"

import { installForcedStates } from "../lib/force-states"

/**
 * A fixture draws one component in the states Claude chose to test: `fixtures/<path>.tsx`,
 * with the path's slashes written as double underscores. It is real design-system code, so
 * the tokens it shows are the ones the component really applies. A hover or focus state is
 * drawn with the markers from lib/force-states.ts.
 */
export interface FixtureState {
  name: string
  render: () => ReactNode
}

export type Width = "full" | "half" | "hug"

export interface Fixture {
  states: FixtureState[]
  /**
   * The two boxes under the states. `width` draws the default component at full, half and hug
   * width of its container; `longText` draws it with a very long label in a narrow container.
   * Leave one out when it does not apply to the component.
   */
  scenarios?: {
    width?: (width: Width) => ReactNode
    longText?: () => ReactNode
  }
}

/** The width class a component takes to fill its container, or none for "hug". */
export const fill = (width: Width) => (width === "hug" ? "" : "w-full")

const modules = import.meta.glob<{ default: Fixture }>("../../fixtures/*.tsx")
const cache = new Map<string, ComponentType<{ names: string[] }>>()

const fixtureKey = (path: string) => `../../fixtures/${path.replaceAll("/", "__")}.tsx`

export const hasFixture = (path: string) => fixtureKey(path) in modules

const BOX = "flex flex-col items-center gap-6 overflow-clip border border-foreground/[0.24] p-4"
const LABEL = "text-sm leading-[1.42]"
const WIDTHS: { name: Width; class: string }[] = [
  { name: "full", class: "w-full" },
  { name: "half", class: "w-1/2" },
  { name: "hug", class: "w-fit" },
]

function load(path: string) {
  const found = cache.get(path)
  if (found) return found
  const Lazy = lazy(async () => {
    const { default: fixture } = await modules[fixtureKey(path)]()
    return {
      default: function Rendered({ names }: { names: string[] }) {
        useEffect(installForcedStates, [])
        const { width, longText } = fixture.scenarios ?? {}
        // The card around these states already carries the theme under test.
        return (
          <div className="flex flex-col gap-12 text-base">
            <div className="flex flex-wrap items-start gap-x-10 gap-y-8">
              {fixture.states
                .filter((s) => names.includes(s.name))
                .map((state) => (
                  <div key={state.name} className="flex flex-col gap-4">
                    <p className="text-lg leading-[1.42]">{state.name}</p>
                    <div className="w-fit">{state.render()}</div>
                  </div>
                ))}
            </div>
            {(width || longText) && (
              <div className="flex items-stretch gap-4">
                {width && (
                  <div className={`${BOX} w-[402px]`}>
                    {WIDTHS.map((w) => (
                      <div key={w.name} className="flex w-full flex-col items-center gap-2">
                        <p className={LABEL}>width {w.name}</p>
                        <div className={`${w.class} flex justify-center`}>{width(w.name)}</div>
                      </div>
                    ))}
                  </div>
                )}
                {longText && (
                  <div className={`${BOX} w-[402px] justify-center`}>
                    <p className={LABEL}>really long text</p>
                    <div className="w-[240px]">{longText()}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      },
    }
  })
  cache.set(path, Lazy)
  return Lazy
}

/** The tested states of one component, drawn live under their labels; the theme comes from the card around them. */
export function StateRender({ path, names }: { path: string; names: string[] }) {
  if (!hasFixture(path)) return <p className="text-base italic opacity-50">No fixture yet for {path}.</p>
  const Fixture = load(path)
  return (
    <Suspense fallback={null}>
      <Fixture names={names} />
    </Suspense>
  )
}
