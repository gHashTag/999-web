import type { CodegenConfig } from "@graphql-codegen/cli";
import { addTypenameSelectionDocumentTransform } from "@graphql-codegen/client-preset";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

const config: CodegenConfig = {
  schema: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
  documents: "src/**/*.tsx",
  overwrite: true,
  ignoreNoDocuments: true,
  generates: {
    "src/gql/": {
      preset: "client",
      documentTransforms: [addTypenameSelectionDocumentTransform],
      plugins: [],
      config: {
        scalars: {
          UUID: "string",
          Date: "string",
          Time: "string",
          Datetime: "string",
          JSON: "string",
          BigInt: "string",
          BigFloat: "string",
          Opaque: "any",
        },
      },
    },
  },
  hooks: {
    // afterAllFileWrite: ["pnpm run lint"],
  },
};

export default config;
