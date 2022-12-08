---
title: vs. trpc-openapi
---

# OpenAPI or nah?

`trpc-panel` and `trpc-openapi` each provide a user interface that enables manual testing of tRPC backends. However, tRPC Panel has some key advantages (even though `trpc-openapi` is an awesome project!)

### Inferred return types

`trpc-panel` doesn't require output schemas, whereas `trpc-openapi` does. Output schemas can end up requiring a significant amount of maintenance and effort from developers. If your output schemas are complex (IE lots of `.extends` usage in zod) and there are a lot of them, it can dumpster typescript performance which can be very costly in the long run.

Plus you lose type inference on return types of your trpc procedures which is one of trpc's greatest features.

### 0 Overhead

`trpc-panel` will automatically generate a UI for every procedure and router in your tRPC backend, where as `trpc-openapi` requires the developer to maintain additional code per procedure in the form of procedure metadata.

### Better UI

`trpc-panel` generates typesafe forms with field and validation specific error messages, and a side navigation for your trpc router. In theory this should allow for faster, more intuitive testing of trpc end points (versus just passing a json object as is required in tRPC open api.)

## When to use `trpc-openapi`

`trpc-openapi`'s greatest advantage is that it provides a REST api. trpc panel does not provide a rest API. Also `trpc-openapi`, like all open api specs, give information about the outputs of end points as well as provide a way to view input/output schemas independent of any end points.

### Can I use `trpc-panel` with `trpc-openapi`?

Yes! If you want to use `trpc-panel`'s awesome UI, you can have a trpc panel on any trpc v10 backend.
