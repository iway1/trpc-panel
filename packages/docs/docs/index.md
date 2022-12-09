---
title: Introduction
---

# tRPC Panel

tRPC Panel automatically generates a trpc native testing UI for your tRPC backend with one line of code with zero developer overhead:

![Trpc Panel Screenshot](./assets/screenshot.png)

You can check out the example app at [app.trpcpanel.io](https://app.trpcpanel.io)

### Features

-   Automatically inspect your tRPC router and recursively generate typesafe UI
-   Zero overhead
    -   Forget output schemas (procedure return types can be inferred as nature intended)
    -   New procedures will be added to your UI as you create them in your backend.
-   Native tRPC UI
    -   Nested routers and input objects. The structure of the UI maps one-to-one to your API's routers and procedures.
    -   Field and validation specific error messages
    -   "Fancy" array and discriminated union fields.
-   SideNav to quickly find procedures of interest

### Quickstart

Check out our [quick start guide](./quickstart.md).

### Limitations

Currently, `trpc-panel` only works with zod input schemas and only works with trpc V10. With its current design it would be feasible to mappers for other types of input schemas, which would allow `trpc-panel` to support other validation libraries. Depending on community demand, these will be added in the future.

### Backend Compatibility

`trpc-panel` doesn't care about your backend framework, it just cares about your trpc router. tRPC panel works with any backend because it works by injecting the information required to build the UI into a plain html string.
