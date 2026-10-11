import type { CodegenConfig } from "@graphql-codegen/cli";

// Typed GraphQL client for the panels, generated from the contract schema.
// Output in gql/ is committed; CI re-runs `pnpm generate` and fails on any diff.
const config: CodegenConfig = {
  schema: "../../packages/contracts/graphql/schema.graphql",
  documents: ["lib/**/*.ts", "!lib/**/*.test.ts"],
  ignoreNoDocuments: false,
  generates: {
    "./gql/": {
      preset: "client",
      config: { enumsAsTypes: true, useTypeImports: true },
    },
  },
};

export default config;
