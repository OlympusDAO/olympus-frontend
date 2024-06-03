import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import react from "@vitejs/plugin-react";
import polyfillNode from "rollup-plugin-polyfill-node";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";
import transformPlugin from "vite-plugin-transform";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default ({ mode }) => {
  return defineConfig({
    plugins: [
      react({
        include: "**/*.tsx",
      }),
      viteTsconfigPaths(),
      svgrPlugin(),
      { ...polyfillNode({ fs: true }), enforce: "post" },
      transformPlugin({
        tStart: "%{",
        tEnd: "}%",
        replace: {
          COOLER_LOANS_API_ENDPOINT: process.env.VITE_COOLER_LOANS_API_ENDPOINT
            ? process.env.VITE_COOLER_LOANS_API_ENDPOINT
            : mode === "development"
            ? "https://olympus-cooler-loans-api-dev.web.app" // Avoids CORS errors during local development
            : "https://olympus-cooler-loans-api-prod.web.app", // Used in production builds
        },
      }),
    ],
    resolve: {
      alias: {
        path: "rollup-plugin-node-polyfills/polyfills/path",
        fs: "rollup-plugin-node-polyfills/polyfills/fs",
        os: "rollup-plugin-node-polyfills/polyfills/os",
        Buffer: "rollup-plugin-node-polyfills/polyfills/buffer",
      },
    },
    build: {
      outDir: "./build",
    },
    test: {
      setupFiles: "src/setupTests.tsx",
      environment: "jsdom", // or 'jsdom', 'node'
      globals: true,
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/cypress/**",
        "**/.{idea,git,cache,output,temp}/**",
        "**/src/typechain/**",
        "src/testHelpers.ts",
        "src/testHandlers.js",
        "src/testUtils.tsx",
        "src/testWagmiUtils.tsx",
      ],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html", "lcov", "json-summary", "text-summary"],
      },
    },
    optimizeDeps: {
      include: ["@emotion/use-insertion-effect-with-fallbacks"],
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: "globalThis",
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
  });
};
