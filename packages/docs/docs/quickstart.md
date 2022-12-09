# Quick Start

Just install with your preferred package manager:

`yarn add trpc-panel`

And then render the panel:

```js
import { renderTrpcPanel } from "trpc-panel";
// ...
app.use("/panel", (_, res) => {
    return res.send(
        renderTrpcPanel(myTrpcRouter, { url: "http://localhost:4000/trpc" })
    );
});
```

Then you're ready to test:

![Screenshot Of Panel](./assets/screenshot.png)
