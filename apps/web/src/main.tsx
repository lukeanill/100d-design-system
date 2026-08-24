import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"

import "@workspace/ui/globals.css"
import { App } from "./App.tsx"
import { History } from "./History.tsx"
import { Tokens } from "./Tokens.tsx"
import { Duplicates } from "./Duplicates.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/history" element={<History />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/duplicates" element={<Duplicates />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
