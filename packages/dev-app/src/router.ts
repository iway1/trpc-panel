import { z } from "zod";
import { createTRPCRouter, procedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

const postsRouter = createTRPCRouter({
  getAllPosts: procedure.query(() => {
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
  createPost: procedure
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

export const appRouter = createTRPCRouter({
  postsRouter,
  inputShowcaseRouter: createTRPCRouter({
    textInput: procedure
      .input(z.object({ aTextInput: z.string() }))
      .query(() => {
        return "It's an input";
      }),
    numberInput: procedure
      .input(z.object({ aNumberInput: z.number() }))
      .query(() => {
        return "It's an input";
      }),
    enumInput: procedure
      .input(z.object({ aEnumInput: z.enum(["One", "Two"]) }))
      .query(() => {
        return "It's an input";
      }),
    nativeEnumInput: procedure
    .input(z.object({ aEnumInput: z.nativeEnum({ONE: "one", TWO: "two"}) }))
    .query(() => {
      return "It's an input";
    }),
    stringArrayInput: procedure
      .input(z.object({ aStringArray: z.string().array() }))
      .query(() => {
        return "It's an input";
      }),
    objectInput: procedure
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
    discriminatedUnionInput: procedure
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
    emailTextInput: procedure
      .input(
        z.object({
          email: z.string().email("That's an invalid email (custom message)"),
        })
      )
      .query(() => {
        return "It's good";
      }),
    voidInput: procedure.input(z.void()).query(() => {
      return "yep";
    }),
  }),
  postSomething: procedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
      })
    )
    .mutation(({ input: { title, content } }) => {
      return {
        title,
        content,
      };
    }),
  procedureWithDescription: procedure
    .meta({
      description: "This is a description",
    })
    .input(
      z.object({
        id: z.string().describe("The id of the thing."),
        searchTerm: z
          .string()
          .optional()
          .describe(
            "The name of the thing to search for. Really really long long long boi long boi long"
          ),
        searchTerm2: z
          .string()
          .optional()
          .describe(
            "The name of the thing to search for. Really really long long long boi long boi long Really really long long long boi long boi long Really really long long long boi long boi long Really really long long long boi long boi long"
          ),
      })
    )
    .query(() => {
      return "Was that described well enough?";
    }),

  hello: procedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(({ input }) => {
      return `Hello ${input.name}`;
    }),
  anErrorThrowingRoute: procedure
    .input(
      z.object({
        ok: z.string(),
      })
    )
    .query(() => {
      throw new TRPCError({
        message: "It broke.",
        code: "FORBIDDEN",
      });
    }),
  allInputs: procedure
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
        boolean: z.boolean(),
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
});

// export type definition of API
export type AppRouter = typeof appRouter;
