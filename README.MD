# tRPC.panel()

Probably the easiest and cheapest way to test your tRPC endpoints for developement and QA. tRPC panel automatically generates a UI for manually testing your tRPC backend with 0 overhead.

## Features

-   Automatically inspect your tRPC router and recursively generate a typesafe UI
-   Zero overhead
    -   No output schemas (procedure return types can be inferred as nature intended)
    -   New procedures will be added to your UI as you create them in your backend.
-   Supports nested routers, and nested input objects. The structure of the UI maps one-to-one to your API's routers and procedures.
-   Field and validation specific error messages
-   Compile-step free (simply injects an object representing your router into a pre-bundled application)
-   SideNav to quickly find procedures of interest

## Who is this for

Anyone who would needs to manually test a tRPC API will likely see benefit from using this library. Since it's designed specifically for tRPC, it can (hopefully) provide the easiest way to quickly build and send requests to your tRPC backend. Also,It can be useful during development as well as for QA testers.

## How It Works

tRPC Panel inspects tRPC V10 Routers and creates an object (called a router definition) containing the bare minimum information required to construct the UI. No information about your backend will make its way to the front end other than router names / paths, as well as procedures and their inputs (represented as a JSON schema).

The object is then injected into a prebundled React application, which then renders an app based on your router definition.

## Limitations

Currently, tRPC panel only supports tRPC v10 and only works with zod input schemas. With it's current design it would be feasible to easily add support for other input types as well.

tRPC Panel doesn't current

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
