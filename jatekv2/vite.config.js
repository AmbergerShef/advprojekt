import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return;
          }

          if (
            id.includes("three") ||
            id.includes("@react-three") ||
            id.includes("postprocessing") ||
            id.includes("three-stdlib") ||
            id.includes("maath") ||
            id.includes("meshline") ||
            id.includes("troika")
          ) {
            return "vendor-three";
          }

          return "vendor";
        },
      },
    },
  },
});
