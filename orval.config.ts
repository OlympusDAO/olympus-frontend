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
      },
    },
    hooks: {
      afterAllFilesWrite: "yarn lint:fix",
    },
  },
  olympusUnits: {
    input: "tmp/olympus-units-api.yaml",
    output: {
      target: "src/generated/olympusUnits.ts",
      client: "react-query",
      clean: false,
      override: {
        mutator: {
          path: "src/views/Rewards/hooks/customHttpClient.ts",
          name: "customHttpClient",
        },
        useTypeOverInterfaces: true,
      },
    },
    hooks: {
      afterAllFilesWrite: "yarn lint:fix",
    },
  },
});
