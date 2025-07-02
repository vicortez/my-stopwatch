// electron.vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import { resolve } from "path";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [react(), tailwindcss()],
    server: {
      port: 3e3,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src")
      }
    },
    css: {
      modules: {
        localsConvention: "camelCase"
        // generateScopedName: '[name]__[local]___[hash:base64:5]', // optional config for displaying module name
      }
    }
    // define: {
    //   // Only define API_PROD_URL in production builds
    //   API_PROD_URL:
    //     process.env.NODE_ENV === 'production'
    //       ? JSON.stringify('https://stopwatch.cortez.top')
    //       : 'asdf'
    // }
  }
});
export {
  electron_vite_config_default as default
};
