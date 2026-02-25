import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import commonjs from "@originjs/vite-plugin-commonjs";

export default defineConfig({
  plugins: [react(), commonjs()],
  server: {
    port: 3000,
    strictPort: false,
  },
  define: {
    "process.env": {},
  },
});
