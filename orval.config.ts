import { defineConfig } from "orval";
import builder from "./lib/builder";

export default defineConfig({
  discord: {
    output: {
      headers: true,
      baseUrl: "https://discord.com/api/v10",
      mode: "single",
      workspace: "generated/",
      clean: true,
      target: "generated/target.ts",
      client: builder(),
      override: {
        mutator: {
          name: "customFetch",
          path: "../lib/custom-fetch.ts",
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
    hooks: {
      afterAllFilesWrite:
        "sed -i 's/formData/createGuildStickerBody/g' ./generated/generated/target.ts",
    },
  },
});
