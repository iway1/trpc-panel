# tRPC.panel()

Probably the easiest and cheapest way to build a testing UI and documentation for your tRPC endpoints. tRPC panel automatically generates a UI for manually testing your tRPC backend with 0 overhead:

![Screenshot 2022-12-08 at 7 24 02 PM](https://user-images.githubusercontent.com/12774588/206602120-017a2b3a-66c3-4bf0-bd93-90fb4bddf0cc.png)

trpc panel moves as fast as your trpc backend with minimal effort.

Check out our [test app](https://app.trpcpanel.io)

## Features

- 🚀 Automatically inspect your tRPC router and recursively generate a typesafe UI
- 🕒 Zero overhead
  - No output schemas (procedure return types can be inferred as nature intended)
  - New procedures will be added to your UI as you create them in your backend
  - No compilation required, works with any backend
- 📄 [Document](#documenting-procedures) your procedures and input parameters with minimal effort
- 🐦 Supports nested routers, and nested input objects. The structure of the UI maps one-to-one to your API's routers and procedures.
- 🧭 SideNav and VSCode-like procedure / router search to quickly find what you're looking for
- ✨ [Transform](#data-transformers) data with built in `superjson` support.

## Quick Start

Install with your preferred package manager:

```sh
yarn add trpc-panel
```

render your panel and return it from your backend (express example):

```js
import { renderTrpcPanel } from "trpc-panel";
// ...
app.use("/panel", (_, res) => {
  return res.send(
    renderTrpcPanel(myTrpcRouter, { url: "http://localhost:4000/trpc" })
  );
});
```

`trpc-panel` just renders as a string, so it can be used with any backend.

## NextJS / create-t3-app example

In Nextjs you'd want to create an api route somewhere like `src/pages/api/panel.ts` and send a text response:

```ts
import type { NextApiRequest, NextApiResponse } from "next";
import { renderTrpcPanel } from "trpc-panel";
import { appRouter } from "../../server/api/root";

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).send(
    renderTrpcPanel(appRouter, {
      url: "http://localhost:3000/api/trpc",
      transformer: "superjson",
    })
  );
}
```

Then we can visit the url `http://localhost:3000/api/panel` to use the panel. Here we do `transformer: "superjson"` assuming we have `superjson` set as the transformer in tRPC (which create-t3-app does by default).

## Documenting Procedures

As of v1.1.0, `trpc-panel` supports documenting procedures.

Documentation is opt-in, meaning you only need to set it up if you want to use it. When docs are included for your trpc procedure, a "Docs" section will appear in your procedure:

![Documentation Example](https://user-images.githubusercontent.com/12774588/208321430-6fea4c92-b0a9-4d9c-a95e-6bf5af04823b.png)

### Procedure Descriptions

`trpc-panel` supports documenting procedures via trpc meta. First setup your trpc instance to be typed with `TRPCPanelMeta`:

```ts
import { initTRPC } from "@trpc/server";
import { TRPCPanelMeta } from "trpc-panel";

const t = initTRPC.meta<TRPCPanelMeta>().create();
```

Then in your routers you can provide a description to the meta:

```ts
export const appRouter = t.router({
  sayHello: t.procedure
    .meta({ /* 👉 */ description: "This shows in the panel." })
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.name}!` };
    });
});
```

### Input Parameter Descriptions

`trpc-panel` supports documenting parameters via zod's `.describe()` method. This allows developers to quickly write documentation as they're writing schemas:

```ts
export const appRouter = t.router({
  sayHello: t.procedure
    .input(z.object({
        name: z.string().describe("The name to say hello too.")
    }))
    .query(({ input }) => {
      return { greeting: `Hello ${input.name}!` };
    });
});
```

Whatever you pass to `describe()` will appear in the docs section. Any input fields without a description will not appear in the docs section.

## Data Transformers

Trpc panel supports `superjson`, just pass it into the transformer option:

```js
app.use("/panel", (_, res) => {
  return res.send(
    renderTrpcPanel(myTrpcRouter, {
      url: "http://localhost:4000/trpc",
      transformer: "superjson",
    })
  );
});
```

## Contributing

`trpc-panel` welcomes and encourages open source contributions. Please see our [contributing](./CONTRIBUTING.md) guide for information on how to develop locally.

## Limitations

Currently, tRPC panel only supports tRPC v10 and only works with zod input schemas. With it's current design it would be feasible to easily add support for other input types as well

There are no plans to support v9 or other previous tRPC versions.

### Supported zod types

The following are supported

- Array
- BigInt
- Boolean
- Branded
- Default
- DiscriminatedUnion
- Effects
- Enum
- Literal
- NativeEnum
- Nullable
- Null
- Nullish
- Number
- Object
- Optional
- Promise
- String
- Undefined

We would like to add the following types:

- Union
- Tuple
- Record
- Never
- Map (superjson only)
- Set (superjson only)
- Date (superjson only)
- Any
