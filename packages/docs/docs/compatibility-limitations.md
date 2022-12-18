---
title: Compatibility
---

# Compatibility and Limitations

Currently, tRPC panel only supports tRPC v10 and only works with zod input schemas. With it's current design it would be feasible to easily add support for other input validators as well.

`trpc-panel` will skip any procedures that have unsupported inputs validators.

There are no plans to support v9 or other previous tRPC versions.

### Supported zod types

See [our github](https://github.com/iway1/trpc-panel) for a full list of supported zod types.
