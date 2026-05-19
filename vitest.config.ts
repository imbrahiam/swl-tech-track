import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
    globals: true,
    // Separate integration tests that need DB from unit tests
    // Run unit tests: bun test
    // Run all (including integration): bun test --reporter=verbose
    exclude: ["**/node_modules/**", "**/__tests__/integration/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
