import express, { Router } from "express";
import { renderTrpcPanel, TRPCPanelMeta } from "trpc-panel";
import { initTRPC } from "@trpc/server";
import { z } from "zod";
import livereload from "livereload";
import connectLiveReload from "connect-livereload";
import morgan from "morgan";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import * as trpcExpress from "@trpc/server/adapters/express";
import { inferAsyncReturnType } from "@trpc/server";
import cors from "cors";
import superjson from "superjson";
import { testRouter } from "./router.js";

const serverUrl = process.env.SERVER_URL;
const trpcPath = process.env.TRPC_PATH;
const port = process.env.DEV_PORT;
// to marginally improve local development experience
const liveReload = process.env.LIVE_RELOAD === "true";
const simulateDelay = process.env.SIMULATE_DELAY === "true";

if (!serverUrl) throw new Error("No SERVER_URL passed.");
if (!trpcPath) throw new Error("No TRPC_PATH passed.");

const __dirname = dirname(fileURLToPath(import.meta.url));
type TRPCMeta = Record<string, unknown>;

const t = initTRPC
  .context<ContextType>()
  .meta<TRPCPanelMeta>()
  .create({ transformer: superjson });

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
utilityRouter._def.procedures.getUsState._def.meta;

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
    router: testRouter,
    createContext: createContext,
  })
);

console.log("Starting at url ");
console.log(`${serverUrl}${port ? `:${port}` : ""}/${trpcPath}`);

expressApp.get("/", (_req, res) => {
  res.send(
    renderTrpcPanel(testRouter, {
      url: `${serverUrl}${port ? `:${port}` : ""}/${trpcPath}`,
      transformer: "superjson",
    })
  );
});

expressApp.listen(port ? port : 4000);
