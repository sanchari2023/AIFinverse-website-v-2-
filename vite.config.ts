import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];

export default defineConfig({
  plugins,
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  // Set envDir to root so it finds the .env file
  envDir: path.resolve(__dirname),
  // Set root to the client folder where index.html is located
  root: path.resolve(__dirname, "client"),
  build: {
    // Output should go to the root dist folder
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
      ".aifinverse.com",
    ],
    proxy: {
      "/api": {
        target: "https://api.aifinverse.com", // Point to your cloud backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        secure: true, // Set to true for HTTPS cloud endpoints
      },
    },
  },
});