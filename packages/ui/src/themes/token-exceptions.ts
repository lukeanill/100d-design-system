// Agreed exceptions, component by component: a place where a component deliberately does not use the token Figma
// maps to (a literal value, a different token, a state Figma does not define). Each one is agreed with the design
// owner before it is added here, and the Storybook Tokens panel shows them under the component they belong to.
//
// Add one by the component's Storybook title (the story's `title`, for example "Components/Actions/Button"):
//
//   "Components/Actions/Button": [
//     { what: "Pressed state darkens the fill by 8%", token: "--primary", why: "Figma has no pressed state yet", agreedOn: "2026-11-07" },
//   ],

export interface TokenException {
  /** What differs from Figma, in plain words. */
  what: string
  /** The code token or CSS property involved, if there is one. */
  token?: string
  /** The Figma variable it would otherwise use, if there is one. */
  figma?: string
  /** Why it is allowed. */
  why: string
  /** The date it was agreed, YYYY-MM-DD. */
  agreedOn: string
}

/** Keyed by the component's Storybook title. */
export const TOKEN_EXCEPTIONS: Record<string, TokenException[]> = {
  "Components/Selects/Radio": [
    {
      what: "The radio circle stays fully round instead of taking the button radius",
      token: "--radius-button",
      figma: "radius/button",
      why: "A radio is a circle by definition; a rounded square would read as a checkbox",
      agreedOn: "2026-11-07",
    },
  ],
}

export const exceptionsFor = (title: string): TokenException[] => TOKEN_EXCEPTIONS[title] ?? []
