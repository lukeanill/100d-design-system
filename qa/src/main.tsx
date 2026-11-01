import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Navigate, Route, Routes } from "react-router"

import { ThemeProvider } from "@workspace/ui/components/theme-provider"

import "./qa.css"
import { Frame } from "./components/Frame"
import { Results } from "./pages/Results"
import { Run } from "./pages/Run"

/** The tool always wears Berghain, the look the Figma draws; the theme under test is scoped to what is being tested. */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider forcedTheme="berghain">
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Routes>
          <Route element={<Frame />}>
            <Route path="/" element={<Navigate to="/run" replace />} />
            <Route path="/run" element={<Run />} />
            <Route path="/results" element={<Results />} />
            <Route path="/results/:id" element={<Results />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
