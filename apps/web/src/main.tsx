import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router"

import "@workspace/ui/globals.css"
import { App } from "./App.tsx"
import { History } from "./History.tsx"
import { QAGallery } from "./QAGallery.tsx"
import { Tokens } from "./Tokens.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/history" element={<History />} />
          <Route path="/qa" element={<QAGallery />} />
          <Route path="/tokens" element={<Tokens />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
