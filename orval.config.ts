import { defineConfig } from 'orval';

export default defineConfig({
  coolerLoans: {
    input: "tmp/openapi.yaml",
    output: {
      target: "src/generated/coolerLoans.ts",
      client: "react-query",
      clean: true,
      override: {
        mutator: {
          path: "src/views/Lending/Cooler/hooks/customHttpClient.ts",
          name: "customHttpClient",
        },
        useTypeOverInterfaces: true,
      }
    },
    hooks: {
      afterAllFilesWrite: "yarn lint:fix",
    },
  },
});
