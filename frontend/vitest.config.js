import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "#components": path.resolve(__dirname, "./src/components"),
      "#lib": path.resolve(__dirname, "./src/lib"),
      "#hooks": path.resolve(__dirname, "./src/hooks"),
      "#contexts": path.resolve(__dirname, "./src/contexts"),
      "#pages": path.resolve(__dirname, "./src/pages"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
});