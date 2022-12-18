
import { initTRPC } from "@trpc/server";
import { z } from "zod";

import * as trpcExpress from "@trpc/server/adapters/express";
import { TRPCError } from "@trpc/server";
import { inferAsyncReturnType } from "@trpc/server";
import superjson from "superjson";

type TRPCMeta = Record<string, unknown>;
type Meta<TMeta = TRPCMeta> = TMeta & {
  cool?: string;
};
const t = initTRPC
  .context<ContextType>()
  .meta<Meta>()
  .create({ transformer: superjson, isServer: true });

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
utilityRouter._def.procedures.getUsState._def.meta;

const multiRouter = {
  userRouter,
  postsRouter,
  utilityRouter,
};

export const testRouter = t.router({
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
          aDiscriminatedUnion: z.discriminatedUnion("discriminatedField", [
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
          ]),
        })
      )
      .query(() => {
        return "It's an input";
      }),
    emailTextInput: t.procedure
      .input(
        z.object({
          email: z.string().email("That's an invalid email (custom message)"),
        })
      )
      .query(({ input }) => {
        return "It's good";
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
