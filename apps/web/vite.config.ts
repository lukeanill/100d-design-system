import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { themeStudio } from "./theme-studio-plugin"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), themeStudio()],
  // honour a PORT assigned by the harness so a second dev server can run
  server: { port: Number(process.env.PORT) || 5173 },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
