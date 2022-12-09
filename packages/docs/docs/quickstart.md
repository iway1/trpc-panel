# Quick Start

Just install with your preferred package manager:

`yarn add trpc-panel`

And then render the panel:

```js
import { renderTrpcPanel } from "trpc-panel";
// ...
app.use("/panel", (_, res) => {
    return res.send(
        renderTrpcPanel(myTrpcRouter, { trpcUrl: "http://localhost:4000/trpc" })
    );
});
```

Then you're ready to test:

![Screenshot Of Panel](./assets/screenshot.png)

`trpc-panel` is just a big string containing a prebuilt React app, so it will work with any backend framework.
