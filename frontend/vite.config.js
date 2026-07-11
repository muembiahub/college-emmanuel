import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({

  // Important pour Electron
  base: "./",

  plugins: [
    react()
  ],

  server: {

    port: 5173,

    proxy: {

      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },

      "/current-user": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },

      "/dashboard": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },

      "/auth": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },

      "/search": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      }

    }

  }

});