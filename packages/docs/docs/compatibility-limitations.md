---
title: Compatibility
---

# Compatibility and Limitations

Currently, tRPC panel only supports tRPC v10 and only works with zod input schemas. With it's current design it would be feasible to easily add support for other input validators as well.

`trpc-panel` will skip any procedures that have unsupported inputs validators.

There are no plans to support v9 or other previous tRPC versions.

### Supported zod types

The following are supported

-   ZodObject
-   ZodString
-   ZodNumber
-   ZodEnum
-   ZodDiscriminatedUnion
-   ZodArray
-   ZodLiteral (These don't show up in the UI but will be sent on form submission)

Ideally we'll add support for all zod types in the near future.
