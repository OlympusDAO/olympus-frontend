import { CodegenConfig } from "@graphql-codegen/cli";

const subgraphApiKey = process.env.VITE_SUBGRAPH_API_KEY;
if (!subgraphApiKey) {
  throw new Error("VITE_SUBGRAPH_API_KEY is not defined");
}

const config: CodegenConfig = {
  schema:
    "https://gateway.thegraph.com/api/[api-key]/subgraphs/id/DTcDcUSBRJjz9NeoK5VbXCVzYbRTyuBwdPUqMi8x32pY".replace(
      "[api-key]",
      subgraphApiKey,
    ),
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
