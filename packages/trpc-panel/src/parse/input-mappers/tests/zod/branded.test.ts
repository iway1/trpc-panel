import { defaultReferences } from "../../defaultReferences";
import { zodSelectorFunction } from "../../zod/selector";
import { ZodDefWithType } from "../../zod/zod-types";
import { ParsedInputNode } from "../../../parsed-node-types";
import { z, ZodType } from "zod";

describe("Parsed ZodBranded", () => {
    it("should parse branded nodes as their base zod type", () => {
        const testCases: {
            node: ParsedInputNode;
            zodType: ZodType;
        }[] = [
            {
                node: {
                    type: "number",
                    path: [],
                },
                zodType: z.number().brand("number"),
            },
            {
                node: {
                    type: "string",
                    path: [],
                },
                zodType: z.string().brand("string"),
            },
        ];
        for (var testCase of testCases) {
            const parsed = zodSelectorFunction(
                testCase.zodType._def as unknown as ZodDefWithType,
                defaultReferences()
            );
            expect(parsed).toStrictEqual("");
        }
    });
});
