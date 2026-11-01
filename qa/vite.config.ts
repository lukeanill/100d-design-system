import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

import { qaApi } from "./server/api.ts"

export default defineConfig({
  // the app lives at /qa/ (http://localhost:5174/qa/run), as it will on the site
  base: "/qa/",
  plugins: [react(), tailwindcss(), qaApi()],
  server: { port: Number(process.env.PORT) || 5174 },
  resolve: {
    // one React for the app and the design system, however Vite splits its dependency bundles
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
