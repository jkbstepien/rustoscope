import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [preact()],
  base: "/rustoscope/",
  resolve: {
    alias: {
      react: "preact/compat",
      "react-dom": "preact/compat",
      "@": "/src"
    },
  },
  build: {
    outDir: "dist",
  },
});
