import {
  ZodArrayDef,
  ZodBigIntDef,
  ZodBooleanDef,
  ZodBrandedDef,
  ZodDefaultDef,
  ZodEffectsDef,
  ZodEnumDef,
  ZodNativeEnumDef,
  ZodFirstPartyTypeKind,
  ZodLiteralDef,
  ZodNullableDef,
  ZodNullDef,
  ZodNumberDef,
  ZodObjectDef,
  ZodOptionalDef,
  ZodPromiseDef,
  ZodStringDef,
  ZodUndefinedDef,
  ZodVoidDef,
} from "zod";
import { parseZodStringDef } from "./parsers/parseZodStringDef";
import { ParserSelectorFunction } from "../../parseNodeTypes";
import { ZodDefWithType } from "./zod-types";
import { parseZodArrayDef } from "./parsers/parseZodArrayDef";
import { parseZodBooleanFieldDef } from "./parsers/parseZodBooleanFieldDef";
import {
  parseZodDiscriminatedUnionDef,
  ZodDiscriminatedUnionDefUnversioned,
} from "./parsers/parseZodDiscriminatedUnionDef";
import { parseZodEnumDef } from "./parsers/parseZodEnumDef";
import { parseZodNativeEnumDef } from "./parsers/parseZodNativeEnumDef";
import { parseZodLiteralDef } from "./parsers/parseZodLiteralDef";
import { parseZodNumberDef } from "./parsers/parseZodNumberDef";
import { parseZodObjectDef } from "./parsers/parseZodObjectDef";
import { parseZodOptionalDef } from "@src/parse/input-mappers/zod/parsers/parseZodOptionalDef";
import { parseZodNullableDef } from "@src/parse/input-mappers/zod/parsers/parseZodNullableDef";
import { parseZodBigIntDef } from "@src/parse/input-mappers/zod/parsers/parseZodBigIntDef";
import { parseZodBrandedDef } from "@src/parse/input-mappers/zod/parsers/parseZodBrandedDef";
import { parseZodDefaultDef } from "@src/parse/input-mappers/zod/parsers/parseZodDefaultDef";
import { parseZodEffectsDef } from "@src/parse/input-mappers/zod/parsers/parseZodEffectsDef";
import { parseZodNullDef } from "@src/parse/input-mappers/zod/parsers/parseZodNullDef";
import { parseZodPromiseDef } from "@src/parse/input-mappers/zod/parsers/parseZodPromiseDef";
import { parseZodUndefinedDef } from "@src/parse/input-mappers/zod/parsers/parseZodUndefinedDef";
import { parseZodVoidDef } from "./parsers/parseZodVoidDef";

export const zodSelectorFunction: ParserSelectorFunction<ZodDefWithType> = (
  def,
  references
) => {
  // const optional = isZodOptional(zodAny);
  // const unwrappedOptional = optional ? zodAny._def.innerType : zodAny;
  // Please keep these in alphabetical order
  switch (def.typeName) {
    case ZodFirstPartyTypeKind.ZodArray:
      return parseZodArrayDef(def as ZodArrayDef, references);
    case ZodFirstPartyTypeKind.ZodBoolean:
      return parseZodBooleanFieldDef(def as ZodBooleanDef, references);
    case ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
      return parseZodDiscriminatedUnionDef(
        // Zod had some type changes between 3.19 -> 3.20 and we want to support both, not sure there's a way
        // to avoid this.
        def as unknown as ZodDiscriminatedUnionDefUnversioned,
        references
      );
    case ZodFirstPartyTypeKind.ZodEnum:
      return parseZodEnumDef(def as ZodEnumDef, references);
    case ZodFirstPartyTypeKind.ZodNativeEnum:
      return parseZodNativeEnumDef(def as ZodNativeEnumDef, references);
    case ZodFirstPartyTypeKind.ZodLiteral:
      return parseZodLiteralDef(def as ZodLiteralDef, references);
    case ZodFirstPartyTypeKind.ZodNumber:
      return parseZodNumberDef(def as ZodNumberDef, references);
    case ZodFirstPartyTypeKind.ZodObject:
      return parseZodObjectDef(def as ZodObjectDef, references);
    case ZodFirstPartyTypeKind.ZodOptional:
      return parseZodOptionalDef(def as ZodOptionalDef, references);
    case ZodFirstPartyTypeKind.ZodString:
      return parseZodStringDef(def as ZodStringDef, references);
    case ZodFirstPartyTypeKind.ZodNullable:
      return parseZodNullableDef(def as ZodNullableDef, references);
    case ZodFirstPartyTypeKind.ZodBigInt:
      return parseZodBigIntDef(def as ZodBigIntDef, references);
    case ZodFirstPartyTypeKind.ZodBranded:
      return parseZodBrandedDef(def as ZodBrandedDef<any>, references);
    case ZodFirstPartyTypeKind.ZodDefault:
      return parseZodDefaultDef(def as ZodDefaultDef, references);
    case ZodFirstPartyTypeKind.ZodEffects:
      return parseZodEffectsDef(def as ZodEffectsDef, references);
    case ZodFirstPartyTypeKind.ZodNull:
      return parseZodNullDef(def as ZodNullDef, references);
    case ZodFirstPartyTypeKind.ZodPromise:
      return parseZodPromiseDef(def as ZodPromiseDef, references);
    case ZodFirstPartyTypeKind.ZodUndefined:
      return parseZodUndefinedDef(def as ZodUndefinedDef, references);
    case ZodFirstPartyTypeKind.ZodVoid:
      return parseZodVoidDef(def as ZodVoidDef, references);
  }
  return { type: "unsupported", path: references.path };
};
