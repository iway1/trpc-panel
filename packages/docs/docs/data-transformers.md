# Data Transformers

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

No other data transformers are available at the moment, but feel free to [open an issue](https://github.com/iway1/trpc-panel/issues) and / or submit a PR.
