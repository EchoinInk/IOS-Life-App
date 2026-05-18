import { defineConfig, type ConfigEnv } from "vite";
import baseConfig from "./vite.config";

// Production-specific configuration with cache headers
export default defineConfig((config: ConfigEnv) => {
  const base = baseConfig(config);
  
  return {
    ...base,
    preview: {
      port: 4173,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
    build: {
      ...base.build,
      rollupOptions: {
        ...base.build?.rollupOptions,
        output: {
          ...base.build?.rollupOptions?.output,
          // Ensure proper content hashing for cache busting
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: (assetInfo) => {
            // Different cache strategies for different asset types
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/css/[name].[hash][extname]';
            }
            if (assetInfo.name && assetInfo.name.match(/\.(png|jpe?g|gif|svg|webp|ico)$/)) {
              return 'assets/images/[name].[hash][extname]';
            }
            if (assetInfo.name && assetInfo.name.match(/\.(woff2?|eot|ttf|otf)$/)) {
              return 'assets/fonts/[name].[hash][extname]';
            }
            return 'assets/[name].[hash][extname]';
          },
        },
      },
      // Additional production optimizations
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1000,
    },
  };
});
