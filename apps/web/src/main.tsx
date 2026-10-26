import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, useLocation } from "react-router"

import "@workspace/ui/globals.css"
import { History } from "./History.tsx"
import { Tokens } from "./Tokens.tsx"
import { Showcase } from "./Showcase.tsx"
import { Themer } from "./themer/Themer"
import { ThemeProvider } from "@workspace/ui/components/theme-provider"
import { ThemePageTransition } from "@workspace/ui/components/transitions/theme-page-transition"

/**
 * The routes, and whatever transition the active theme brings.
 *
 * `location` is passed to <Routes> explicitly because the transition holds the
 * outgoing page in state while the screen is covered; without it that held
 * element would re-match against the new URL and swap early, which is the whole
 * thing the cover is hiding.
 */
function AppRoutes() {
  const location = useLocation()
  return (
    <ThemePageTransition transitionKey={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Showcase />} />
        <Route path="/history" element={<History />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/themes" element={<Themer />} />
      </Routes>
    </ThemePageTransition>
  )
}

/**
 * The homepage has no theme of its own: it is always the look the Figma draws,
 * which is the design system's default tokens. A theme chosen on the homepage
 * applies to the preview alone. Every other route keeps whatever theme the
 * visitor has set.
 */
const HOME_LOOK = "berghain"

function Themed({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  return (
    <ThemeProvider forcedTheme={pathname === "/" || pathname === "/themes" ? HOME_LOOK : undefined}>
      {children}
    </ThemeProvider>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Themed>
        <AppRoutes />
      </Themed>
    </BrowserRouter>
  </StrictMode>
)
