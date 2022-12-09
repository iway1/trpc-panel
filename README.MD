# tRPC.panel()

Probably the easiest and cheapest way to build a testing UI for your tRPC endpoints for development, QA or any other manual testing. tRPC panel automatically generates a UI for manually testing your tRPC backend with 0 overhead:

![Screenshot 2022-12-08 at 7 24 02 PM](https://user-images.githubusercontent.com/12774588/206602120-017a2b3a-66c3-4bf0-bd93-90fb4bddf0cc.png)

trpc panel moves as fast as your trpc backend with no extra effort.

Check out our test app [here](https://app.trpcpanel.io)

## Features

-   Automatically inspect your tRPC router and recursively generate a typesafe UI
-   Zero overhead
    -   No output schemas (procedure return types can be inferred as nature intended)
    -   New procedures will be added to your UI as you create them in your backend.
-   Supports nested routers, and nested input objects. The structure of the UI maps one-to-one to your API's routers and procedures.
-   Field and validation specific error messages
-   Compile-step free (simply injects an object representing your router into a pre-bundled application)
-   SideNav to quickly find procedures of interest

## Quick Start
Install with your preferred package manager:

`yarn add trpc-panel`

render your panel and return it from your backend (express example):

```js
import { renderTrpcPanel } from "trpc-panel";
// ...
app.use("/panel", (_, res) => {
    return res.send(
        renderTrpcPanel(myTrpcRouter, { trpcUrl: "http://localhost:4000/trpc" })
    );
});
```

## Limitations

Currently, tRPC panel only supports tRPC v10 and only works with zod input schemas. With it's current design it would be feasible to easily add support for other input types as well

There are no plans to support v9 or other previous tRPC versions.

### Supported zod types

The following are supported

-   ZodObject
-   ZodString
-   ZodNumber
-   ZodEnum
-   ZodDiscriminatedUnion
-   ZodArray
-   ZodLiteral (These don't show up in the UI but will be send on form submission)

## Contributing / Learn More
If there's a feature you'd like from `trpc-panel`, please open an issue! Trpc panel is looking for guidance from the community on which features it should prioritize adding.

If you'd like to contribute check out our [contribution guide](https://trpcpanel.io/docs/contributing). 

If you just want to learn more about trpc panel, checkout the main [docs site](https://trpcpanel.io)
