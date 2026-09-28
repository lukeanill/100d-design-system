import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, useLocation } from "react-router"

import "@workspace/ui/globals.css"
import { History } from "./History.tsx"
import { Tokens } from "./Tokens.tsx"
import { ThemeStudio } from "./theme-studio"
import { Showcase } from "./Showcase.tsx"
import { ThemeProvider } from "@workspace/ui/components/theme-provider"
import { FontThemeProvider } from "@workspace/ui/components/font-theme-provider"
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
        {/* Available in both: in dev it writes to your working copy, on the
            deployed site it commits to the repo. Both are password-gated. */}
        <Route path="/themes" element={<ThemeStudio />} />
      </Routes>
    </ThemePageTransition>
  )
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <FontThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </FontThemeProvider>
    </ThemeProvider>
  </StrictMode>
)
