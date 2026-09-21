import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"

import "@workspace/ui/globals.css"
import { History } from "./History.tsx"
import { Tokens } from "./Tokens.tsx"
import { ThemeStudio } from "./theme-studio"
import { Showcase } from "./Showcase.tsx"
import { ThemeProvider } from "@workspace/ui/components/theme-provider"
import { FontThemeProvider } from "@workspace/ui/components/font-theme-provider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <FontThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Showcase />} />
            <Route path="/history" element={<History />} />
            <Route path="/tokens" element={<Tokens />} />
            {/* Available in both: in dev it writes to your working copy, on the
                deployed site it commits to the repo. Both are password-gated. */}
            <Route path="/themes" element={<ThemeStudio />} />
          </Routes>
        </BrowserRouter>
      </FontThemeProvider>
    </ThemeProvider>
  </StrictMode>
)
