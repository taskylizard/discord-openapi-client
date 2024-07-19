import { defineConfig } from "orval";

export default defineConfig({
  petstore: {
    output: {
      baseUrl: "https://discord.com/api/v10",
      prettier: true,
      mode: "tags-split",
      workspace: "generated/",
      clean: true,
      target: "generated/target.ts",
      client: "fetch",
      override: {
        mutator: {
          name: "customFetch",
          path: "../custom-fetch.ts",
        },
        useBigInt: true,
        useNativeEnums: true,
        header: (info) => [
          ...(info.title ? [info.title] : []),
          ...(info.description ? [info.description] : []),
          ...(info.version ? [`OpenAPI spec version: ${info.version}`] : []),
        ],
      },
      urlEncodeParameters: true,
    },
    input: {
      target: "./openapi/specs/openapi.json",
    },
  },
});
