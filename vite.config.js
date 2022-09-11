import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import react from "@vitejs/plugin-react";
import polyfillNode from "rollup-plugin-polyfill-node";
import { defineConfig } from "vite";
import svgrPlugin from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default ({ mode }) => {
  return defineConfig({
    plugins: [
      react({
        include: "**/*.tsx",
        babel: {
          plugins: ["macros"],
        },
      }),
      viteTsconfigPaths(),
      svgrPlugin(),
      polyfillNode({ fs: true }),
    ],
    define: {
      "process.env.NODE_ENV": `"${mode}"`,
    },
    resolve: {
      alias: {
        path: "rollup-plugin-node-polyfills/polyfills/path",
        fs: "rollup-plugin-node-polyfills/polyfills/fs",
        os: "rollup-plugin-node-polyfills/polyfills/os",
        Buffer: "rollup-plugin-node-polyfills/polyfills/buffer",
      },
    },
    test: {
      setupFiles: "src/setupTests.tsx",
      environment: "jsdom", // or 'jsdom', 'node'
      globals: true,
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/cypress/**",
        "**/.{idea,git,cache,output,temp}/**, **/src/typechain/**",
      ],
    },
    optimizeDeps: {
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
