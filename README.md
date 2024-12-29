# discord-openapi-client

> [!WARNING]
> This is work in progress.

Autogenerated OpenAPI client for Discord, generated from [discord/discord-api-spec](https://github.com/discord/discord-api-spec).

This should contain _almost_ everything you will need to interact with the Discord API, atleast whatever their OpenAPI spec has.

There are absolutely no significant dependencies apart from the `openapi-fetch` package for the generated types.

## Usage

> [!NOTE]
> This package is ESM only.

Install package:

```sh
# npm
npm install discord-openapi-client
# pnpm
pnpm add discord-openapi-client
# yarn
yarn add discord-openapi-client
# bun
bun add discord-openapi-client
# deno/jsr
deno add jsr:@tasky/discord-openapi-client
```

Usage example:

```js
import { client } from "discord-openapi-client";

const user = await client.GET(
  "/users/{user_id}" /** 👈 path params, fully typed */,
  {
    params: { path: { user_id: "123456789012345678" } },
  },
);

console.info(user);
```

The `client` object uses the [`openapi-fetch`](https://openapi-ts.dev/openapi-fetch/) package, with the `paths` type from the generated OpenAPI schema types. It handles all typesafety, ensuring you're using the correct path params, query params, etc, without any `any` or `unknown` casting.

You should also enable `noUncheckedIndexedAccess` in your `tsconfig.json`, so so any `additionalProperties` key will be typed as `T | undefined`. ([Docs](https://openapi-ts.dev/advanced#enable-nouncheckedindexedaccess-in-tsconfig))

Consult the [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) docs for more information.

Alternatively, if you want to construct your own client, the `paths`, `components`, `operations` and `schemas` types are exported from the package.

### Migrating from `v0.0.5`

I now use `openapi-typescript` to generate the types, as `orval` gave me a lot of trouble with the generated types. You can keep using the old version, or reuse the orval builder for yourself, see: https://github.com/taskylizard/discord-openapi-client/blob/e97fcd089e0ce4d43dd6d4a3fff6980b3fbb170d/orval.config.ts.

However, I won't recommend this approach, as the builder generates a lot of code (over 2550 symbols!), bloats the bundle size, and is not very maintainable.

## Building

1. Install dependencies with pnpm
2. Clone `discord/discord-api-spec` as `openapi`
3. Run `pnpm build`

### why?

I was bored
