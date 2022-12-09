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
import superjson from "superjson";

const serverUrl = process.env.SERVER_URL;
const trpcPath = process.env.TRPC_PATH;
const port = process.env.DEV_PORT;
// to marginally improve local development experience
const liveReload = process.env.LIVE_RELOAD === "true";
const simulateDelay = process.env.SIMULATE_DELAY === "true";

if (!serverUrl) throw new Error("No SERVER_URL passed.");
if (!trpcPath) throw new Error("No TRPC_PATH passed.");

const __dirname = dirname(fileURLToPath(import.meta.url));
const t = initTRPC.context<ContextType>().create({ transformer: superjson });
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
        authorized: !!authHeader,
    };
}

type ContextType = inferAsyncReturnType<typeof createContext>;

const UserSchema = z.object({
    id: z.string(),
    username: z.string(),
    interests: z.string().array(),
});

type User = z.infer<typeof UserSchema>;

const IDSchema = z.object({
    id: z.string(),
});

const fakeData: {
    user: User;
} = {
    user: {
        id: "f43cb448-1194-4528-80c7-b6f9287ad5fa",
        username: "trpclover47",
        interests: [
            "type safety",
            "using 'as any'",
            "mindfulness meditation",
            "mcu movies",
        ],
    },
};

const userRouter = t.router({
    getUserById: t.procedure.input(IDSchema).query((old) => {
        return fakeData.user;
    }),
    updateUser: t.procedure.input(UserSchema).mutation(({ input }) => {
        return input;
    }),
    deleteUser: t.procedure.input(IDSchema).mutation(() => {
        return {
            message: "User deleted (not really)",
        };
    }),
    getAllUsers: t.procedure.query(() => {
        return [fakeData.user, fakeData.user, fakeData.user, fakeData.user];
    }),
});

const postsRouter = t.router({
    getPostsById: t.procedure.input(IDSchema).query(() => {
        return {
            id: "asodifjaosdf",
            text: "Post Id",
        };
    }),
    getAllPosts: t.procedure.query(() => {
        return [
            {
                id: "asodifjaosdf",
                text: "Post Id",
            },
            {
                id: "asodifjaosdf",
                text: "Post Id",
            },
            {
                id: "asodifjaosdf",
                text: "Post Id",
            },
        ];
    }),
    createPost: t.procedure
        .input(
            z.object({
                text: z.string(),
            })
        )
        .mutation(({ input }) => {
            return {
                id: "aoisdjfoasidjfasodf",
                text: input.text,
            };
        }),
});

const utilityRouter = t.router({
    getUsState: t.procedure.query(() => {
        return [
            {
                stateCode: "NY",
                stateName: "New York",
                stateId: 0,
            },
        ];
    }),
});

const multiRouter = {
    userRouter,
    postsRouter,
    utilityRouter,
};

const router = t.router({
    userRouter: userRouter,
    postsRouter: postsRouter,
    utilityRouter: utilityRouter,
    nestedRouters: t.router(multiRouter),
    deeplyNestedRouter: t.router({
        levelOne: t.router({
            levelTwo: t.router({
                levelThree: t.router(multiRouter),
            }),
        }),
    }),
    inputShowcaseRouter: t.router({
        textInput: t.procedure
            .input(z.object({ aTextInput: z.string() }))
            .query(() => {
                return "It's an input";
            }),
        numberInput: t.procedure
            .input(z.object({ aNumberInput: z.number() }))
            .query(() => {
                return "It's an input";
            }),
        enumInput: t.procedure
            .input(z.object({ aEnumInput: z.enum(["One", "Two"]) }))
            .query(() => {
                return "It's an input";
            }),
        stringArrayInput: t.procedure
            .input(z.object({ aStringArray: z.string().array() }))
            .query(() => {
                return "It's an input";
            }),
        objectInput: t.procedure
            .input(
                z.object({
                    anObject: z.object({
                        numberArray: z.number().array(),
                    }),
                })
            )
            .query(() => {
                return "It's an input";
            }),
        discriminatedUnionInput: t.procedure
            .input(
                z.object({
                    aDiscriminatedUnion: z.discriminatedUnion(
                        "discriminatedField",
                        [
                            z.object({
                                discriminatedField: z.literal("One"),
                                aFieldThatOnlyShowsWhenValueIsOne: z.string(),
                            }),
                            z.object({
                                discriminatedField: z.literal("Two"),
                                aFieldThatOnlyShowsWhenValueIsTwo: z.object({
                                    someTextFieldInAnObject: z.string(),
                                }),
                            }),
                            z.object({
                                discriminatedField: z.literal("Three"),
                            }),
                        ]
                    ),
                })
            )
            .query(() => {
                return "It's an input";
            }),
    }),

    anErrorThrowingRoute: t.procedure
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
    authorizedProcedure: t.procedure.mutation(({ ctx }) => {
        if (!ctx.authorized) throw new TRPCError({ code: "UNAUTHORIZED" });
        return {
            is: "good",
        };
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

expressApp.get("/", (_req, res) => {
    res.send(
        renderTrpcPanel(router, {
            url: `${serverUrl}${port ? `:${port}` : ""}/${trpcPath}`,
            transformer: "superjson",
        })
    );
});

expressApp.listen(port ? port : 4000);
