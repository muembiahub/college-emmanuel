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
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("recharts") || id.includes("d3-")) {
              return "vendor-recharts";
            }
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom") || id.includes("scheduler") || id.includes("use-sync-external-store")) {
              return "vendor-react";
            }
            if (id.includes("lucide-react") || id.includes("react-icons")) {
              return "vendor-icons";
            }
            if (id.includes("framer-motion")) {
              return "vendor-motion";
            }
            if (id.includes("react-hot-toast") || id.includes("react-toastify")) {
              return "vendor-toast";
            }
            if (id.includes("react-loading-skeleton")) {
              return "vendor-skeleton";
            }
            if (id.includes("html2pdf.js") || id.includes("html2canvas")) {
              return "vendor-pdf";
            }
            return "vendor-others";
          }
        }
      }
    }
  }
});