import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174
  },
  build: {
    modulePreload: {
      resolveDependencies: (_filename, deps) =>
        deps.filter((dep) => !/(animation|calendar|charts|dnd|feedback|forms|providers|state|tables|uploads)-/.test(dep))
    },
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["recharts"],
          animation: ["framer-motion"],
          calendar: ["react-day-picker", "date-fns"],
          uploads: ["react-dropzone", "sortablejs"],
          feedback: ["sonner"],
          state: ["zustand", "@tanstack/react-query"],
          router: ["react-router-dom"],
          forms: ["react-hook-form", "zod", "@hookform/resolvers"],
          tables: ["@tanstack/react-table"],
          dnd: ["@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities"]
        }
      }
    }
  }
});
