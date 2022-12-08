import express, { Router } from "express";
import { renderTrpcPanel } from "trpc-panel";
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import livereload from "livereload";
import connectLiveReload from "connect-livereload";
import morgan from "morgan";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import * as trpcExpress from "@trpc/server/adapters/express";
import { TRPCError } from "@trpc/server";
import { inferAsyncReturnType } from "@trpc/server";
import cors from "cors";

const serverUrl = process.env.SERVER_URL;
const trpcPath = process.env.TRPC_PATH;
const port = process.env.DEV_PORT;
// to marginally improve local development experience
const liveReload = process.env.LIVE_RELOAD === "true";
const simulateDelay = process.env.SIMULATE_DELAY === "true";

if (!serverUrl) throw new Error("No SERVER_URL passed.");
if (!trpcPath) throw new Error("No TRPC_PATH passed.");

const __dirname = dirname(fileURLToPath(import.meta.url));
const t = initTRPC.context<ContextType>().create();
if (liveReload) {
    const liveReloadServer = livereload.createServer();
    liveReloadServer.server.once("connection", () => {
        console.log("Connection");
        setTimeout(() => {
            liveReloadServer.refresh("/test-router");
            console.log("Reloaded");
        }, 100);
    });
    liveReloadServer.watch("./");
}

async function createContext(opts: trpcExpress.CreateExpressContextOptions) {
    const authHeader = opts.req.headers["authorization"];
    return {
        authorized: authHeader === "token-good",
    };
}

type ContextType = inferAsyncReturnType<typeof createContext>;

const router = t.router({
    getStuff: t.procedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .input(
            z.object({
                id2: z.string(),
            })
        )
        .query(({ input }) => {
            return {
                id: input.id,
                someThing: "A thing string",
            };
        }),
    postSomething: t.procedure
        .input(z.object({ id: z.string() }))
        .mutation(({ input }) => {
            console.log("did post 'er");
            return "A response";
        }),
    justANumber: t.procedure
        .input(
            z.object({
                num: z.number(),
            })
        )
        .query(({ input }) => {
            return input.num;
        }),
    anotherRouter: t.router({
        nestedGetStuff: t.procedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .query(({ input }) => {
                return {
                    id: input.id,
                };
            }),
        withoutInput: t.procedure.query(() => ({ nothingToSee: "here" })),
        innerRouter: t.router({
            doubleNested: t.procedure
                .input(z.object({ property: z.string() }))
                .query(() => "Good"),
            f: t.procedure
                .input(
                    z.object({
                        failBecauseOfThis: z.function(),
                    })
                )
                .query(() => "Nope"),
        }),
    }),
    anErrorThrowingRouteWithMessage: t.procedure
        .input(
            z.object({
                ok: z.string(),
            })
        )
        .query(() => {
            throw new TRPCError({
                message: "It's pretty bad over here.",
                code: "FORBIDDEN",
            });
        }),
    anErrorThrowingRouterWithoutMessage: t.procedure
        .input(
            z.object({
                ok: z.string(),
            })
        )
        .query(() => {
            throw new TRPCError({ code: "BAD_REQUEST" });
        }),
    multipleInputs: t.procedure
        .input(z.object({}))
        .query(() => ({ cool: "stuff" })),
    allInputs: t.procedure
        .input(
            z.object({
                obj: z.object({
                    string: z.string().optional(),
                }),
                stringMin5: z.string().min(5),
                numberMin10: z.number().min(10),
                stringOptional: z.string().optional(),
                enum: z.enum(["One", "Two"]),
                optionalEnum: z.enum(["Three", "Four"]).optional(),
                stringArray: z.string().array(),
                union: z.discriminatedUnion("disc", [
                    z.object({
                        disc: z.literal("one"),
                        oneProp: z.string(),
                    }),
                    z.object({
                        disc: z.literal("two"),
                        twoProp: z.enum(["one", "two"]),
                    }),
                ]),
            })
        )
        .query(() => ({ goodJob: "yougotthedata" })),
    authorizedInput: t.procedure.query(({ ctx }) => {
        if (!ctx.authorized) throw new TRPCError({ code: "UNAUTHORIZED" });
        return {
            is: "good",
        };
    }),
    voidInput: t.procedure.input(z.void()).query(() => "nope"),
    noInput: t.procedure.query(() => "none"),
    subscription: t.procedure.subscription(() => "no"),
    failsToParse: t.procedure
        .input(
            z.object({
                failBecauseOfThis: z.function(),
            })
        )
        .query(() => "Nope"),
    anotherRouter2: t.router({
        nestedGetStuff: t.procedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .query(({ input }) => {
                return {
                    id: input.id,
                };
            }),
        withoutInput: t.procedure.query(() => ({ nothingToSee: "here" })),
        innerRouter: t.router({
            doubleNested: t.procedure
                .input(z.object({ property: z.string() }))
                .query(() => "Good"),
            f: t.procedure
                .input(
                    z.object({
                        failBecauseOfThis: z.function(),
                    })
                )
                .query(() => "Nope"),
        }),
    }),
    anotherRouter3: t.router({
        nestedGetStuff: t.procedure
            .input(
                z.object({
                    id: z.string(),
                })
            )
            .query(({ input }) => {
                return {
                    id: input.id,
                };
            }),
        withoutInput: t.procedure.query(() => ({ nothingToSee: "here" })),
        innerRouter: t.router({
            doubleNested: t.procedure
                .input(z.object({ property: z.string() }))
                .query(() => "Good"),
            f: t.procedure
                .input(
                    z.object({
                        failBecauseOfThis: z.function(),
                    })
                )
                .query(() => "Nope"),
        }),
    }),
});

const expressApp = express();
expressApp.use(cors({ origin: "*" }));

if (liveReload) {
    expressApp.use(connectLiveReload());
}

if (simulateDelay) {
    console.log("Simulating delay...");
    expressApp.use((req, res, next) => {
        setTimeout(() => {
            next();
            console.log("Next in timeout");
        }, 1000);
    });
}

expressApp.use(morgan("short", {}));
expressApp.use(
    `/${trpcPath}`,
    trpcExpress.createExpressMiddleware({
        router: router,
        createContext: createContext,
    })
);

expressApp.get("/test-render", (_req, res) => {
    res.send(
        renderTrpcPanel(router, {
            url: `${serverUrl}${port ? `:${port}` : ""}/${trpcPath}`,
        })
    );
});

expressApp.listen(port ? port : 4000);
