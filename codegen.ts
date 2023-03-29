import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "https://api.thegraph.com/subgraphs/name/olympusdao/olympus-protocol-metrics",
  documents: ["src/graphql/queries.graphql"],
  generates: {
    "src/generated/graphql.tsx": {
      plugins: ["typescript", "typescript-operations", "typescript-react-query"],
      config: {
        withHooks: true,
        preResolveTypes: true,
        addInfiniteQuery: true,
        scalars: {
          BigDecimal: "number",
          BigInt: "number",
          Bytes: "Uint8Array",
        },
      },
      hooks: {
        afterOneFileWrite: ["yarn lint:fix"],
      },
    },
  },
  overwrite: true,
};

export default config;
