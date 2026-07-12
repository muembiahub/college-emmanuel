import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Nécessaire pour Electron
  base: "./",

  plugins: [react()],

  server: {
    host: "0.0.0.0",
    port: 5173,

    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },

      "/dashboard": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },

      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },

      "/current-user": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },

      "/search": {
        target: "http://localhost:3000",
        changeOrigin: true,
      }
    }
  },

  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});