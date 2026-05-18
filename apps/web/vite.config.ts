import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import * as path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      manifest: {},
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"]
      }
    }) as PluginOption
  ].filter(Boolean) as PluginOption[],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core"
    ]
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["lucide-react"]
        },
        entryFileNames: "assets/[name].[hash].js",
        chunkFileNames: "assets/[name].[hash].js",
        assetFileNames: "assets/[name].[hash].[ext]"
      }
    },
    assetsInline: mode === "production",
    minify: "terser",
    sourcemap: mode === "development",
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true
  },

  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false
    },
    headers:
      mode === "production"
        ? {
            "Cache-Control": "public, max-age=31536000, immutable"
          }
        : {}
  }
}));
