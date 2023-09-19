import { defineConfig } from 'orval';

export default defineConfig({
  coolerLoans: {
    input: "tmp/openapi.yaml",
    output: {
      target: "src/generated/coolerLoans.ts",
      client: "react-query",
      clean: true,
    },
    hooks: {
      afterAllFilesWrite: "yarn lint:fix",
    },
  },
});
